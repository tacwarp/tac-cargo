"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { ManifestStatus } from "@/types/database";

/**
 * Update manifest status
 */
export async function updateManifestStatus(
  manifestId: string,
  status: ManifestStatus
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set timestamps based on status
    if (status === "dispatched") {
      updateData.actual_departure = new Date().toISOString();
    } else if (status === "arrived") {
      updateData.actual_arrival = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("manifests")
      .update(updateData)
      .eq("id", manifestId);

    if (updateError) {
      console.error("Update manifest status error:", updateError);
      return error("Failed to update manifest status", "DATABASE_ERROR");
    }

    // Update related shipments status
    if (status === "dispatched" || status === "in_transit") {
      await supabase
        .from("shipments")
        .update({ status: "in_transit", updated_at: new Date().toISOString() })
        .eq("manifest_id", manifestId);
    } else if (status === "arrived") {
      await supabase
        .from("shipments")
        .update({ status: "at_destination_hub", updated_at: new Date().toISOString() })
        .eq("manifest_id", manifestId);
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);

    return success(undefined, "Manifest status updated");
  } catch (err) {
    console.error("Update manifest status error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update manifest details
 */
export async function updateManifest(
  manifestId: string,
  data: {
    transport_mode?: string;
    vehicle_number?: string;
    driver_name?: string;
    driver_phone?: string;
    seal_number?: string;
    planned_departure?: string;
    planned_arrival?: string;
    notes?: string;
  }
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const updateData: Record<string, unknown> = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    const { error: updateError } = await supabase
      .from("manifests")
      .update(updateData)
      .eq("id", manifestId);

    if (updateError) {
      console.error("Update manifest error:", updateError);
      return error("Failed to update manifest", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);

    return success(undefined, "Manifest updated successfully");
  } catch (err) {
    console.error("Update manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get manifest by ID
 */
export async function getManifestById(manifestId: string): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { data: manifest, error: fetchError } = await supabase
      .from("manifests")
      .select(`
        *,
        origin_warehouse:warehouses!origin_warehouse_id(id, name, code),
        destination_warehouse:warehouses!destination_warehouse_id(id, name, code),
        shipments(id, reference, status, consignee_name, pieces, weight_kg)
      `)
      .eq("id", manifestId)
      .single();

    if (fetchError || !manifest) {
      return error("Manifest not found", "NOT_FOUND");
    }

    return success(manifest);
  } catch (err) {
    console.error("Get manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Add shipment to manifest
 */
export async function addShipmentToManifest(
  manifestId: string,
  shipmentId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { error: updateError } = await supabase
      .from("shipments")
      .update({ manifest_id: manifestId, updated_at: new Date().toISOString() })
      .eq("id", shipmentId);

    if (updateError) {
      console.error("Add shipment to manifest error:", updateError);
      return error("Failed to add shipment", "DATABASE_ERROR");
    }

    // Recalculate manifest totals
    const { data: shipments } = await supabase
      .from("shipments")
      .select("pieces, weight_kg")
      .eq("manifest_id", manifestId);

    if (shipments) {
      const totalPieces = shipments.reduce((sum, s) => sum + (s.pieces || 0), 0);
      const totalWeight = shipments.reduce((sum, s) => sum + (s.weight_kg || 0), 0);

      await supabase
        .from("manifests")
        .update({ total_pieces: totalPieces, total_weight: totalWeight })
        .eq("id", manifestId);
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);

    return success(undefined, "Shipment added to manifest");
  } catch (err) {
    console.error("Add shipment to manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Remove shipment from manifest
 */
export async function removeShipmentFromManifest(
  manifestId: string,
  shipmentId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { error: updateError } = await supabase
      .from("shipments")
      .update({ manifest_id: null, updated_at: new Date().toISOString() })
      .eq("id", shipmentId)
      .eq("manifest_id", manifestId);

    if (updateError) {
      console.error("Remove shipment from manifest error:", updateError);
      return error("Failed to remove shipment", "DATABASE_ERROR");
    }

    // Recalculate manifest totals
    const { data: shipments } = await supabase
      .from("shipments")
      .select("pieces, weight_kg")
      .eq("manifest_id", manifestId);

    const totalPieces = shipments?.reduce((sum, s) => sum + (s.pieces || 0), 0) || 0;
    const totalWeight = shipments?.reduce((sum, s) => sum + (s.weight_kg || 0), 0) || 0;

    await supabase
      .from("manifests")
      .update({ total_pieces: totalPieces, total_weight: totalWeight })
      .eq("id", manifestId);

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);

    return success(undefined, "Shipment removed from manifest");
  } catch (err) {
    console.error("Remove shipment from manifest error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
