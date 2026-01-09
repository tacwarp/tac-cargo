"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { shipmentSchema, type ShipmentFormData } from "@/lib/schemas/shipment";
import {
  type ActionResult,
  success,
  error,
} from "@/types/action-result";
import type { Shipment, ShipmentStatus } from "@/types/database";

/**
 * Generate unique shipment reference
 */
function generateReference(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString(36).toUpperCase();
  return `SHP-${year}${timestamp}`;
}

/**
 * Create a new shipment
 */
export async function createShipment(
  formData: ShipmentFormData
): Promise<ActionResult<Shipment>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Validate input
    const parsed = shipmentSchema.safeParse(formData);
    if (!parsed.success) {
      return error(parsed.error.issues[0].message, "VALIDATION_ERROR");
    }

    // Get user profile for organization
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    const reference = formData.reference || generateReference();

    const { data, error: dbError } = await supabase
      .from("shipments")
      .insert({
        reference,
        customer_id: parsed.data.customer_id || null,
        consignee_name: parsed.data.consignee_name,
        consignee_phone: parsed.data.consignee_phone,
        consignee_email: parsed.data.consignee_email || null,
        consignee_address: parsed.data.consignee_address,
        consignee_city: parsed.data.consignee_city,
        consignee_state: parsed.data.consignee_state,
        consignee_pincode: parsed.data.consignee_pincode,
        origin_warehouse_id: parsed.data.origin_warehouse_id || null,
        destination_warehouse_id: parsed.data.destination_warehouse_id || null,
        transport_mode: parsed.data.transport_mode,
        service_level_id: parsed.data.service_level_id || null,
        weight_kg: parsed.data.weight_kg || null,
        pieces: parsed.data.pieces || 1,
        declared_value: parsed.data.declared_value || null,
        notes: parsed.data.notes || null,
        status: "pending",
        created_by: user.id,
        organization_id: profile?.organization_id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Create shipment error:", dbError);
      return error("Failed to create shipment", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard");
    return success(data as Shipment, "Shipment created successfully");
  } catch (err) {
    console.error("Create shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update shipment status
 */
export async function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  notes?: string
): Promise<ActionResult<Shipment>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Update shipment
    const { data, error: dbError } = await supabase
      .from("shipments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", shipmentId)
      .select()
      .single();

    if (dbError) {
      console.error("Update shipment status error:", dbError);
      return error("Failed to update shipment status", "DATABASE_ERROR");
    }

    // Create tracking event
    await supabase.from("tracking_events").insert({
      shipment_id: shipmentId,
      status,
      description: notes || `Status updated to ${status}`,
      is_public: true,
    });

    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard/tracking");
    revalidatePath(`/dashboard/shipments/${shipmentId}`);
    return success(data as Shipment, "Status updated");
  } catch (err) {
    console.error("Update shipment status error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Assign shipment to manifest
 */
export async function assignShipmentToManifest(
  shipmentId: string,
  manifestId: string
): Promise<ActionResult<Shipment>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Check manifest is open
    const { data: manifest } = await supabase
      .from("manifests")
      .select("status")
      .eq("id", manifestId)
      .single();

    if (!manifest) {
      return error("Manifest not found", "NOT_FOUND");
    }

    if (manifest.status !== "open" && manifest.status !== "draft") {
      return error("Cannot add to locked/dispatched manifest", "CONFLICT");
    }

    // Update shipment
    const { data, error: dbError } = await supabase
      .from("shipments")
      .update({ manifest_id: manifestId, updated_at: new Date().toISOString() })
      .eq("id", shipmentId)
      .select()
      .single();

    if (dbError) {
      console.error("Assign shipment error:", dbError);
      return error("Failed to assign shipment", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);
    return success(data as Shipment, "Shipment assigned to manifest");
  } catch (err) {
    console.error("Assign shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Remove shipment from manifest
 */
export async function removeShipmentFromManifest(
  shipmentId: string
): Promise<ActionResult<Shipment>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get current manifest
    const { data: shipment } = await supabase
      .from("shipments")
      .select("manifest_id, manifests(status)")
      .eq("id", shipmentId)
      .single();

    if (!shipment?.manifest_id) {
      return error("Shipment not in any manifest", "NOT_FOUND");
    }

    // @ts-expect-error - Supabase types
    if (shipment.manifests?.status === "dispatched") {
      return error("Cannot remove from dispatched manifest", "CONFLICT");
    }

    const { data, error: dbError } = await supabase
      .from("shipments")
      .update({ manifest_id: null, updated_at: new Date().toISOString() })
      .eq("id", shipmentId)
      .select()
      .single();

    if (dbError) {
      return error("Failed to remove shipment", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard/manifests");
    return success(data as Shipment, "Shipment removed from manifest");
  } catch (err) {
    console.error("Remove shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get shipment by tracking/reference ID
 */
export async function getShipmentByReference(
  reference: string
): Promise<ActionResult<Shipment>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("shipments")
      .select(
        `
        *,
        customers(name, phone),
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code),
        manifests(manifest_number, status)
      `
      )
      .eq("reference", reference.toUpperCase())
      .single();

    if (dbError || !data) {
      return error("Shipment not found", "NOT_FOUND");
    }

    return success(data as Shipment);
  } catch (err) {
    console.error("Get shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Search shipments
 */
export async function searchShipments(
  query: string,
  options?: {
    status?: ShipmentStatus;
    limit?: number;
  }
): Promise<ActionResult<Shipment[]>> {
  try {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from("shipments")
      .select(
        `
        *,
        customers(name, phone),
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code)
      `
      )
      .order("created_at", { ascending: false })
      .limit(options?.limit || 50);

    if (query) {
      // Sanitize query to prevent SQL injection via pattern characters
      const sanitizedQuery = query.replace(/[%_\\]/g, "\\$&");
      queryBuilder = queryBuilder.or(
        `reference.ilike.%${sanitizedQuery}%,consignee_name.ilike.%${sanitizedQuery}%,consignee_phone.ilike.%${sanitizedQuery}%`
      );
    }

    if (options?.status) {
      queryBuilder = queryBuilder.eq("status", options.status);
    }

    const { data, error: dbError } = await queryBuilder;

    if (dbError) {
      return error("Search failed", "DATABASE_ERROR");
    }

    return success((data || []) as Shipment[]);
  } catch (err) {
    console.error("Search shipments error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Delete shipment (soft delete via status)
 */
export async function deleteShipment(
  shipmentId: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Check if shipment can be deleted
    const { data: shipment } = await supabase
      .from("shipments")
      .select("status, manifest_id")
      .eq("id", shipmentId)
      .single();

    if (!shipment) {
      return error("Shipment not found", "NOT_FOUND");
    }

    if (shipment.manifest_id) {
      return error("Remove from manifest first", "CONFLICT");
    }

    if (shipment.status === "in_transit" || shipment.status === "delivered") {
      return error("Cannot delete shipped/delivered items", "CONFLICT");
    }

    const { error: dbError } = await supabase
      .from("shipments")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", shipmentId);

    if (dbError) {
      return error("Failed to delete shipment", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/shipments");
    return success(undefined, "Shipment cancelled");
  } catch (err) {
    console.error("Delete shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
