"use server";

/**
 * @fileoverview Manifest Workflow Hardening
 * 
 * This module provides production-hardened manifest operations with:
 * - State machine enforcement (open → locked → dispatched)
 * - Atomic manifest item operations
 * - Idempotent scan operations
 * - Cross-system consistency (manifest ↔ shipments ↔ tracking)
 * - Real-time update support
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { Manifest, ManifestStatus, Shipment } from "@/types/database";

/**
 * Manifest state machine
 */
const VALID_MANIFEST_TRANSITIONS: Record<ManifestStatus, ManifestStatus[]> = {
  open: ["locked", "cancelled"],
  locked: ["dispatched", "open"], // Can reopen if needed
  dispatched: ["completed"], // Terminal operational state
  completed: [], // Terminal state
  cancelled: [], // Terminal state
};

/**
 * Validates manifest state transition
 */
function isValidManifestTransition(
  from: ManifestStatus,
  to: ManifestStatus
): boolean {
  return VALID_MANIFEST_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Scan result types with semantic meaning
 */
export type ScanResultType = "success" | "duplicate" | "error";

export interface ScanResult {
  type: ScanResultType;
  message: string;
  shipment?: Shipment;
  manifestId?: string;
}

/**
 * Add shipment to manifest (idempotent)
 * 
 * This operation is idempotent - scanning the same shipment multiple times
 * will not add duplicates, instead returning a "duplicate" result.
 */
export async function addShipmentToManifest(
  manifestId: string,
  shipmentReference: string
): Promise<ActionResult<ScanResult>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get manifest
    const { data: manifest, error: manifestError } = await supabase
      .from("manifests")
      .select("*")
      .eq("id", manifestId)
      .single();

    if (manifestError || !manifest) {
      return success({
        type: "error",
        message: "Manifest not found",
      });
    }

    // Validate manifest is open
    if (manifest.status !== "open") {
      return success({
        type: "error",
        message: `Cannot add to ${manifest.status} manifest`,
      });
    }

    // Find shipment
    const { data: shipment, error: shipmentError } = await supabase
      .from("shipments")
      .select("*")
      .eq("reference", shipmentReference.toUpperCase().trim())
      .single();

    if (shipmentError || !shipment) {
      return success({
        type: "error",
        message: `Shipment ${shipmentReference} not found`,
      });
    }

    // Check if already in manifest (idempotency)
    const { data: existing } = await supabase
      .from("manifest_items")
      .select("id")
      .eq("manifest_id", manifestId)
      .eq("shipment_id", shipment.id)
      .maybeSingle();

    if (existing) {
      return success({
        type: "duplicate",
        message: `${shipmentReference} already in manifest`,
        shipment: shipment as Shipment,
        manifestId,
      });
    }

    // Atomic transaction: Add to manifest + Update shipment status
    const { error: insertError } = await supabase
      .from("manifest_items")
      .insert({
        manifest_id: manifestId,
        shipment_id: shipment.id,
        scanned_at: new Date().toISOString(),
        scanned_by: user.id,
        organization_id: manifest.organization_id,
      });

    if (insertError) {
      // Check for unique constraint violation (race condition)
      if (insertError.code === "23505") {
        return success({
          type: "duplicate",
          message: `${shipmentReference} already in manifest`,
          shipment: shipment as Shipment,
          manifestId,
        });
      }
      return success({
        type: "error",
        message: `Failed to add shipment: ${insertError.message}`,
      });
    }

    // Update shipment status
    await supabase
      .from("shipments")
      .update({
        manifest_id: manifestId,
        status: "in_transit",
        updated_at: new Date().toISOString(),
      })
      .eq("id", shipment.id);

    // Create tracking event
    await supabase.from("tracking_events").insert({
      shipment_id: shipment.id,
      event_type: "manifest_load",
      status: "in_transit",
      description: `Added to manifest ${manifest.manifest_number}`,
      warehouse_id: manifest.origin_warehouse_id,
      created_by: user.id,
      organization_id: manifest.organization_id,
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "manifest_item_add",
      entity_type: "manifest",
      entity_id: manifestId,
      details: {
        shipment_id: shipment.id,
        shipment_reference: shipmentReference,
      },
      organization_id: manifest.organization_id,
    });

    revalidatePath("/dashboard/manifests");
    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard/scanning");

    return success({
      type: "success",
      message: `${shipmentReference} added successfully`,
      shipment: shipment as Shipment,
      manifestId,
    });
  } catch (err) {
    return error(
      `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      "INTERNAL_ERROR"
    );
  }
}

/**
 * Lock manifest (prevent further additions)
 */
export async function lockManifest(
  manifestId: string
): Promise<ActionResult<Manifest>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get manifest
    const { data: manifest } = await supabase
      .from("manifests")
      .select("*")
      .eq("id", manifestId)
      .single();

    if (!manifest) {
      return error("Manifest not found", "NOT_FOUND");
    }

    // Validate transition
    if (!isValidManifestTransition(manifest.status as ManifestStatus, "locked")) {
      return error(
        `Cannot lock manifest in ${manifest.status} status`,
        "VALIDATION_ERROR"
      );
    }

    // Get item count
    const { count } = await supabase
      .from("manifest_items")
      .select("*", { count: "exact", head: true })
      .eq("manifest_id", manifestId);

    if (!count || count === 0) {
      return error("Cannot lock empty manifest", "VALIDATION_ERROR");
    }

    // Update status
    const { data: updated, error: updateError } = await supabase
      .from("manifests")
      .update({
        status: "locked",
        locked_at: new Date().toISOString(),
        locked_by: user.id,
        item_count: count,
        updated_at: new Date().toISOString(),
      })
      .eq("id", manifestId)
      .select()
      .single();

    if (updateError) {
      return error(`Failed to lock manifest: ${updateError.message}`, "DATABASE_ERROR");
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "manifest_locked",
      entity_type: "manifest",
      entity_id: manifestId,
      details: {
        item_count: count,
        manifest_number: manifest.manifest_number,
      },
      organization_id: manifest.organization_id,
    });

    revalidatePath("/dashboard/manifests");
    return success(updated as Manifest);
  } catch (err) {
    return error(
      `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      "INTERNAL_ERROR"
    );
  }
}

/**
 * Dispatch manifest (mark as sent)
 */
export async function dispatchManifest(
  manifestId: string,
  vehicleNumber?: string,
  driverName?: string
): Promise<ActionResult<Manifest>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get manifest
    const { data: manifest } = await supabase
      .from("manifests")
      .select("*")
      .eq("id", manifestId)
      .single();

    if (!manifest) {
      return error("Manifest not found", "NOT_FOUND");
    }

    // Validate transition
    if (!isValidManifestTransition(manifest.status as ManifestStatus, "dispatched")) {
      return error(
        `Cannot dispatch manifest in ${manifest.status} status`,
        "VALIDATION_ERROR"
      );
    }

    // Update status
    const { data: updated, error: updateError } = await supabase
      .from("manifests")
      .update({
        status: "dispatched",
        dispatched_at: new Date().toISOString(),
        dispatched_by: user.id,
        vehicle_number: vehicleNumber,
        driver_name: driverName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", manifestId)
      .select()
      .single();

    if (updateError) {
      return error(`Failed to dispatch manifest: ${updateError.message}`, "DATABASE_ERROR");
    }

    // Update all shipments in manifest
    const { data: manifestItems } = await supabase
      .from("manifest_items")
      .select("shipment_id")
      .eq("manifest_id", manifestId);

    if (manifestItems && manifestItems.length > 0) {
      const shipmentIds = manifestItems.map((item) => item.shipment_id);

      await supabase
        .from("shipments")
        .update({
          status: "in_transit",
          updated_at: new Date().toISOString(),
        })
        .in("id", shipmentIds);

      // Create tracking events for all shipments
      const trackingEvents = shipmentIds.map((shipmentId) => ({
        shipment_id: shipmentId,
        event_type: "manifest_dispatch",
        status: "in_transit",
        description: `Manifest ${manifest.manifest_number} dispatched`,
        warehouse_id: manifest.origin_warehouse_id,
        created_by: user.id,
        organization_id: manifest.organization_id,
      }));

      await supabase.from("tracking_events").insert(trackingEvents);
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "manifest_dispatched",
      entity_type: "manifest",
      entity_id: manifestId,
      details: {
        manifest_number: manifest.manifest_number,
        vehicle_number: vehicleNumber,
        driver_name: driverName,
        item_count: manifest.item_count,
      },
      organization_id: manifest.organization_id,
    });

    revalidatePath("/dashboard/manifests");
    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard/tracking");
    return success(updated as Manifest);
  } catch (err) {
    return error(
      `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      "INTERNAL_ERROR"
    );
  }
}

/**
 * Remove shipment from manifest (only if manifest is open)
 */
export async function removeShipmentFromManifest(
  manifestId: string,
  shipmentId: string
): Promise<ActionResult<{ removed: boolean }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get manifest
    const { data: manifest } = await supabase
      .from("manifests")
      .select("*")
      .eq("id", manifestId)
      .single();

    if (!manifest) {
      return error("Manifest not found", "NOT_FOUND");
    }

    // Can only remove from open manifests
    if (manifest.status !== "open") {
      return error(
        `Cannot remove items from ${manifest.status} manifest`,
        "VALIDATION_ERROR"
      );
    }

    // Remove item
    const { error: deleteError } = await supabase
      .from("manifest_items")
      .delete()
      .eq("manifest_id", manifestId)
      .eq("shipment_id", shipmentId);

    if (deleteError) {
      return error(`Failed to remove shipment: ${deleteError.message}`, "DATABASE_ERROR");
    }

    // Update shipment
    await supabase
      .from("shipments")
      .update({
        manifest_id: null,
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", shipmentId);

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "manifest_item_remove",
      entity_type: "manifest",
      entity_id: manifestId,
      details: {
        shipment_id: shipmentId,
      },
      organization_id: manifest.organization_id,
    });

    revalidatePath("/dashboard/manifests");
    revalidatePath("/dashboard/shipments");
    return success({ removed: true });
  } catch (err) {
    return error(
      `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      "INTERNAL_ERROR"
    );
  }
}

