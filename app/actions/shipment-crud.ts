"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { ShipmentStatus } from "@/types/database";

/**
 * Cancel a shipment (soft delete)
 */
export async function cancelShipment(shipmentId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { error: updateError } = await supabase
      .from("shipments")
      .update({
        status: "cancelled",
        updated_at: new Date().toISOString(),
      })
      .eq("id", shipmentId);

    if (updateError) {
      console.error("Cancel shipment error:", updateError);
      return error("Failed to cancel shipment", "DATABASE_ERROR");
    }

    // Add tracking event
    await supabase.from("tracking_events").insert({
      shipment_id: shipmentId,
      status: "cancelled",
      description: "Shipment cancelled",
      is_public: true,
    });

    revalidatePath("/dashboard/shipments");
    revalidatePath(`/dashboard/shipments/${shipmentId}`);

    return success(undefined, "Shipment cancelled successfully");
  } catch (err) {
    console.error("Cancel shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update shipment status
 */
export async function updateShipmentStatus(
  shipmentId: string,
  status: ShipmentStatus,
  location?: string,
  description?: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { error: updateError } = await supabase
      .from("shipments")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", shipmentId);

    if (updateError) {
      console.error("Update shipment status error:", updateError);
      return error("Failed to update shipment status", "DATABASE_ERROR");
    }

    // Add tracking event
    await supabase.from("tracking_events").insert({
      shipment_id: shipmentId,
      status,
      location,
      description: description || `Status updated to ${status.replace(/_/g, " ")}`,
      is_public: true,
    });

    revalidatePath("/dashboard/shipments");
    revalidatePath(`/dashboard/shipments/${shipmentId}`);

    return success(undefined, "Shipment status updated");
  } catch (err) {
    console.error("Update shipment status error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update shipment details
 */
export async function updateShipment(
  shipmentId: string,
  data: {
    consignee_name?: string;
    consignee_phone?: string;
    consignee_email?: string;
    consignee_address?: string;
    consignee_city?: string;
    consignee_state?: string;
    consignee_pincode?: string;
    transport_mode?: string;
    payment_mode?: string;
    pieces?: number;
    weight_kg?: number;
    declared_value?: number;
    cod_amount?: number;
    notes?: string;
    special_instructions?: string;
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

    // Remove empty strings
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === "") {
        updateData[key] = null;
      }
    });

    const { error: updateError } = await supabase
      .from("shipments")
      .update(updateData)
      .eq("id", shipmentId);

    if (updateError) {
      console.error("Update shipment error:", updateError);
      return error("Failed to update shipment", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/shipments");
    revalidatePath(`/dashboard/shipments/${shipmentId}`);

    return success(undefined, "Shipment updated successfully");
  } catch (err) {
    console.error("Update shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get shipment by ID
 */
export async function getShipmentById(shipmentId: string): Promise<ActionResult<Record<string, unknown>>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const { data: shipment, error: fetchError } = await supabase
      .from("shipments")
      .select(`
        *,
        customers(id, name, phone, email, address, city, state, pincode, gst_number),
        origin_warehouse:warehouses!origin_warehouse_id(id, name, code, city, state),
        destination_warehouse:warehouses!destination_warehouse_id(id, name, code, city, state),
        tracking_events(id, status, location, description, created_at)
      `)
      .eq("id", shipmentId)
      .single();

    if (fetchError || !shipment) {
      return error("Shipment not found", "NOT_FOUND");
    }

    return success(shipment);
  } catch (err) {
    console.error("Get shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Delete shipment (hard delete - admin only)
 */
export async function deleteShipment(shipmentId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // First delete related tracking events
    await supabase
      .from("tracking_events")
      .delete()
      .eq("shipment_id", shipmentId);

    // Then delete the shipment
    const { error: deleteError } = await supabase
      .from("shipments")
      .delete()
      .eq("id", shipmentId);

    if (deleteError) {
      console.error("Delete shipment error:", deleteError);
      return error("Failed to delete shipment", "DATABASE_ERROR");
    }

    revalidatePath("/dashboard/shipments");

    return success(undefined, "Shipment deleted successfully");
  } catch (err) {
    console.error("Delete shipment error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * List shipments with filters and pagination
 */
export async function listShipments(options?: {
  status?: string;
  customerId?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ActionResult<{ data: Record<string, unknown>[]; count: number }>> {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    const page = options?.page || 1;
    const limit = options?.limit || 50;
    const offset = (page - 1) * limit;

    let query = supabase
      .from("shipments")
      .select(`
        *,
        customers(id, name, phone),
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code)
      `, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (options?.status) {
      query = query.eq("status", options.status);
    }

    if (options?.customerId) {
      query = query.eq("customer_id", options.customerId);
    }

    if (options?.search) {
      query = query.or(`reference.ilike.%${options.search}%,consignee_name.ilike.%${options.search}%`);
    }

    const { data: shipments, error: fetchError, count } = await query;

    if (fetchError) {
      console.error("List shipments error:", fetchError);
      return error("Failed to fetch shipments", "DATABASE_ERROR");
    }

    return success({ data: shipments || [], count: count || 0 });
  } catch (err) {
    console.error("List shipments error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
