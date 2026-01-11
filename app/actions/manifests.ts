"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { manifestSchema, type ManifestFormData } from "@/lib/schemas/shipment";
import { type ActionResult, success, error } from "@/types/action-result";
import type { Manifest, ManifestStatus } from "@/types/database";

/**
 * Generate unique manifest number
 */
function generateManifestNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `MNF-${year}${timestamp}`;
}

/**
 * Create a new manifest
 */
export async function createManifest(
  formData: ManifestFormData
): Promise<ActionResult<Manifest>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Validate input
    const parsed = manifestSchema.safeParse(formData);
    if (!parsed.success) {
      return error(parsed.error.issues[0].message, "VALIDATION_ERROR");
    }

    // Get user profile for organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const manifestNumber = formData.manifest_number || generateManifestNumber();

    const { data, error: dbError } = await supabase
      .from("manifests")
      .insert({
        manifest_number: manifestNumber,
        origin_warehouse_id: parsed.data.origin_warehouse_id,
        destination_warehouse_id: parsed.data.destination_warehouse_id,
        transport_mode: parsed.data.transport_mode,
        vehicle_number: parsed.data.vehicle_number || null,
        driver_name: parsed.data.driver_name || null,
        driver_phone: parsed.data.driver_phone || null,
        seal_number: parsed.data.seal_number || null,
        planned_departure: parsed.data.planned_departure,
        planned_arrival: parsed.data.planned_arrival,
        status: "draft",
        created_by: user.id,
        organization_id: profile?.organization_id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Create manifest error:", dbError);
      return error("Failed to create manifest", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath("/dashboard");
    return success(data as Manifest, "Manifest created successfully");
  } catch (err) {
    console.error("Create manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Add shipment to manifest (scan-based)
 */
export async function addShipmentToManifest(
  manifestId: string,
  shipmentReference: string
): Promise<ActionResult<{ shipmentId: string; reference: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Check manifest status
    const { data: manifest } = await supabase
      .from("manifests")
      .select("status, origin_warehouse_id, destination_warehouse_id")
      .eq("id", manifestId)
      .single();

    if (!manifest) {
      return error("Manifest not found", "NOT_FOUND");
    }

    if (manifest.status !== "open" && manifest.status !== "draft") {
      return error("Manifest is locked or dispatched", "CONFLICT");
    }

    // Find shipment by reference
    const { data: shipment } = await supabase
      .from("shipments")
      .select("id, reference, manifest_id, origin_warehouse_id, destination_warehouse_id")
      .eq("reference", shipmentReference.toUpperCase())
      .single();

    if (!shipment) {
      return error("Shipment not found", "NOT_FOUND");
    }

    if (shipment.manifest_id) {
      return error("Shipment already in a manifest", "CONFLICT");
    }

    // Validate route matches
    if (
      shipment.origin_warehouse_id !== manifest.origin_warehouse_id ||
      shipment.destination_warehouse_id !== manifest.destination_warehouse_id
    ) {
      return error("Shipment route does not match manifest route", "VALIDATION_ERROR");
    }

    // Add to manifest
    const { error: updateError } = await supabase
      .from("shipments")
      .update({ manifest_id: manifestId, updated_at: new Date().toISOString() })
      .eq("id", shipment.id);

    if (updateError) {
      return error("Failed to add shipment", "DATABASE_ERROR");
    }

    // Create scan event
    await supabase.from("scan_events").insert({
      shipment_id: shipment.id,
      manifest_id: manifestId,
      scan_type: "manifest_load",
      scanned_by: user.id,
    });

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);
    return success(
      { shipmentId: shipment.id, reference: shipment.reference },
      "Shipment added to manifest"
    );
  } catch (err) {
    console.error("Add shipment to manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Lock manifest (no more shipments can be added)
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

    // Check manifest has shipments
    const { count } = await supabase
      .from("shipments")
      .select("id", { count: "exact", head: true })
      .eq("manifest_id", manifestId);

    if (!count || count === 0) {
      return error("Cannot lock empty manifest", "VALIDATION_ERROR");
    }

    // Update status
    const { data, error: dbError } = await supabase
      .from("manifests")
      .update({ status: "locked", updated_at: new Date().toISOString() })
      .eq("id", manifestId)
      .in("status", ["draft", "open"])
      .select()
      .single();

    if (dbError) {
      return error("Failed to lock manifest", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);
    return success(data as Manifest, "Manifest locked");
  } catch (err) {
    console.error("Lock manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Dispatch manifest (updates all shipments to in_transit)
 */
export async function dispatchManifest(
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

    // Check manifest is locked
    const { data: manifest } = await supabase
      .from("manifests")
      .select("status")
      .eq("id", manifestId)
      .single();

    if (!manifest) {
      return error("Manifest not found", "NOT_FOUND");
    }

    if (manifest.status !== "locked") {
      return error("Manifest must be locked before dispatch", "VALIDATION_ERROR");
    }

    // Update manifest
    const { data, error: manifestError } = await supabase
      .from("manifests")
      .update({
        status: "dispatched",
        actual_departure: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", manifestId)
      .select()
      .single();

    if (manifestError) {
      return error("Failed to dispatch manifest", "DATABASE_ERROR");
    }

    // Update all shipments to in_transit
    const { error: shipmentsError } = await supabase
      .from("shipments")
      .update({ status: "in_transit", updated_at: new Date().toISOString() })
      .eq("manifest_id", manifestId);

    if (shipmentsError) {
      console.error("Failed to update shipments:", shipmentsError);
    }

    // Get shipment IDs for tracking events
    const { data: shipments } = await supabase
      .from("shipments")
      .select("id")
      .eq("manifest_id", manifestId);

    // Create tracking events for all shipments
    if (shipments && shipments.length > 0) {
      const trackingEvents = shipments.map((s) => ({
        shipment_id: s.id,
        status: "in_transit" as const,
        description: `Dispatched via manifest ${(data as Manifest).manifest_number}`,
        is_public: true,
      }));

      await supabase.from("tracking_events").insert(trackingEvents);
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard/tracking");
    revalidatePath(`/dashboard/manifests/${manifestId}`);
    return success(data as Manifest, "Manifest dispatched");
  } catch (err) {
    console.error("Dispatch manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get manifest with shipments
 */
export async function getManifest(
  manifestId: string
): Promise<ActionResult<Manifest & { shipments: unknown[] }>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("manifests")
      .select(
        `
        *,
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code),
        shipments(
          id,
          reference,
          consignee_name,
          consignee_city,
          pieces,
          weight_kg,
          status
        )
      `
      )
      .eq("id", manifestId)
      .single();

    if (dbError || !data) {
      return error("Manifest not found", "NOT_FOUND");
    }

    return success(data as Manifest & { shipments: unknown[] });
  } catch (err) {
    console.error("Get manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * List manifests with filters
 */
export async function listManifests(options?: {
  status?: ManifestStatus;
  limit?: number;
}): Promise<ActionResult<Manifest[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("manifests")
      .select(
        `
        *,
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code),
        shipments(count)
      `
      )
      .order("created_at", { ascending: false })
      .limit(options?.limit || 50);

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return error("Failed to list manifests", "DATABASE_ERROR");
    }

    return success((data || []) as Manifest[]);
  } catch (err) {
    console.error("List manifests error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Unlock manifest (allow edits again) - only for locked, not dispatched
 */
export async function unlockManifest(
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

    const { data, error: dbError } = await supabase
      .from("manifests")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", manifestId)
      .eq("status", "locked")
      .select()
      .single();

    if (dbError) {
      return error("Cannot unlock manifest - it may be dispatched already", "CONFLICT");
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);
    return success(data as Manifest, "Manifest unlocked");
  } catch (err) {
    console.error("Unlock manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Mark manifest as arrived at destination
 */
export async function arriveManifest(
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

    const { data, error: dbError } = await supabase
      .from("manifests")
      .update({
        status: "arrived",
        actual_arrival: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", manifestId)
      .eq("status", "dispatched")
      .select()
      .single();

    if (dbError) {
      return error("Manifest must be dispatched first", "CONFLICT");
    }

    // Update shipments to at_destination_hub
    const { error: shipmentsError } = await supabase
      .from("shipments")
      .update({ status: "at_destination_hub", updated_at: new Date().toISOString() })
      .eq("manifest_id", manifestId);

    if (shipmentsError) {
      console.error("Failed to update shipments:", shipmentsError);
    }

    // Create tracking events
    const { data: shipments } = await supabase
      .from("shipments")
      .select("id")
      .eq("manifest_id", manifestId);

    if (shipments && shipments.length > 0) {
      const trackingEvents = shipments.map((s) => ({
        shipment_id: s.id,
        status: "at_destination_hub" as const,
        description: `Arrived at destination hub via manifest ${(data as Manifest).manifest_number}`,
        is_public: true,
      }));

      await supabase.from("tracking_events").insert(trackingEvents);
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath("/dashboard/shipments");
    revalidatePath(`/dashboard/manifests/${manifestId}`);
    return success(data as Manifest, "Manifest arrived at destination");
  } catch (err) {
    console.error("Arrive manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Remove shipment from manifest
 */
export async function removeShipmentFromManifest(
  manifestId: string,
  shipmentId: string
): Promise<ActionResult<{ shipmentId: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Check manifest is editable
    const { data: manifest } = await supabase
      .from("manifests")
      .select("status")
      .eq("id", manifestId)
      .single();

    if (!manifest || (manifest.status !== "draft" && manifest.status !== "open")) {
      return error("Cannot modify locked or dispatched manifest", "CONFLICT");
    }

    const { error: updateError } = await supabase
      .from("shipments")
      .update({ manifest_id: null, updated_at: new Date().toISOString() })
      .eq("id", shipmentId)
      .eq("manifest_id", manifestId);

    if (updateError) {
      return error("Failed to remove shipment", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);
    return success({ shipmentId }, "Shipment removed from manifest");
  } catch (err) {
    console.error("Remove shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Complete manifest (all shipments delivered)
 */
export async function completeManifest(
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

    const { data, error: dbError } = await supabase
      .from("manifests")
      .update({
        status: "completed",
        actual_arrival: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", manifestId)
      .eq("status", "dispatched")
      .select()
      .single();

    if (dbError) {
      return error("Failed to complete manifest", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/manifests");
    return success(data as Manifest, "Manifest completed");
  } catch (err) {
    console.error("Complete manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
