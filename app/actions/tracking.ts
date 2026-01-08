"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { ShipmentStatus, TrackingEvent } from "@/types/database";

interface TrackingEventData {
  id: string;
  status: string;
  location: string | null;
  description: string | null;
  is_public: boolean;
  created_at: string;
}

interface TrackingInfo {
  shipment: {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    consignee_city: string | null;
    origin: string;
    destination: string;
  };
  events: TrackingEventData[];
  estimatedDelivery?: string;
}

/**
 * Get tracking information for a shipment (public)
 */
export async function getTrackingInfo(
  reference: string
): Promise<ActionResult<TrackingInfo>> {
  try {
    const supabase = await createClient();

    const { data: shipment } = await supabase
      .from("shipments")
      .select(
        `
        id,
        reference,
        status,
        consignee_name,
        consignee_city,
        origin_warehouse:warehouses!origin_warehouse_id(name),
        destination_warehouse:warehouses!destination_warehouse_id(name),
        tracking_events(
          id,
          status,
          location,
          description,
          is_public,
          created_at
        )
      `
      )
      .eq("reference", reference.toUpperCase())
      .single();

    if (!shipment) {
      return error("Shipment not found", "NOT_FOUND");
    }

    // Filter to public events only
    const rawEvents = (shipment.tracking_events || []) as TrackingEventData[];
    const publicEvents = rawEvents
      .filter((e) => e.is_public)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Handle Supabase join - could be array or object
    const originWarehouse = shipment.origin_warehouse as { name: string } | { name: string }[] | null;
    const destWarehouse = shipment.destination_warehouse as { name: string } | { name: string }[] | null;
    const originName = Array.isArray(originWarehouse) ? originWarehouse[0]?.name : originWarehouse?.name;
    const destName = Array.isArray(destWarehouse) ? destWarehouse[0]?.name : destWarehouse?.name;

    return success({
      shipment: {
        id: shipment.id,
        reference: shipment.reference,
        status: shipment.status,
        consignee_name: shipment.consignee_name,
        consignee_city: shipment.consignee_city,
        origin: originName || "Unknown",
        destination: destName || "Unknown",
      },
      events: publicEvents,
    });
  } catch (err) {
    console.error("Get tracking info error:", err);
    return error("Failed to get tracking information", "INTERNAL_ERROR");
  }
}

/**
 * Add tracking event (internal)
 */
export async function addTrackingEvent(
  shipmentId: string,
  status: ShipmentStatus,
  description: string,
  options?: {
    location?: string;
    isPublic?: boolean;
  }
): Promise<ActionResult<TrackingEvent>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get shipment for organization
    const { data: shipment } = await supabase
      .from("shipments")
      .select("organization_id")
      .eq("id", shipmentId)
      .single();

    if (!shipment) {
      return error("Shipment not found", "NOT_FOUND");
    }

    const { data, error: dbError } = await supabase
      .from("tracking_events")
      .insert({
        shipment_id: shipmentId,
        status,
        description,
        location: options?.location || null,
        is_public: options?.isPublic ?? true,
        organization_id: shipment.organization_id,
      })
      .select()
      .single();

    if (dbError) {
      return error("Failed to add tracking event", "DATABASE_ERROR");
    }

    // Update shipment status
    await supabase
      .from("shipments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", shipmentId);

    revalidatePath("/dashboard/tracking");
    revalidatePath(`/dashboard/shipments/${shipmentId}`);
    return success(data as TrackingEvent);
  } catch (err) {
    console.error("Add tracking event error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get all tracking events for a shipment (internal view)
 */
export async function getShipmentTrackingHistory(
  shipmentId: string
): Promise<ActionResult<TrackingEvent[]>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("shipment_id", shipmentId)
      .order("created_at", { ascending: false });

    if (dbError) {
      return error("Failed to fetch tracking history", "DATABASE_ERROR");
    }

    return success((data || []) as TrackingEvent[]);
  } catch (err) {
    console.error("Get tracking history error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get shipments by status (for tracking dashboard)
 */
export async function getShipmentsByStatus(
  status?: ShipmentStatus,
  options?: { limit?: number }
): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("shipments")
      .select(
        `
        id,
        reference,
        status,
        consignee_name,
        consignee_city,
        created_at,
        updated_at,
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code),
        manifests(manifest_number)
      `
      )
      .order("updated_at", { ascending: false })
      .limit(options?.limit || 100);

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return error("Failed to fetch shipments", "DATABASE_ERROR");
    }

    return success(data || []);
  } catch (err) {
    console.error("Get shipments by status error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get delayed shipments
 */
export async function getDelayedShipments(): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    // Shipments in transit for more than 3 days
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const { data, error: dbError } = await supabase
      .from("shipments")
      .select(
        `
        id,
        reference,
        status,
        consignee_name,
        consignee_city,
        created_at,
        updated_at,
        origin_warehouse:warehouses!origin_warehouse_id(name),
        destination_warehouse:warehouses!destination_warehouse_id(name)
      `
      )
      .eq("status", "in_transit")
      .lt("updated_at", threeDaysAgo.toISOString())
      .order("updated_at", { ascending: true });

    if (dbError) {
      return error("Failed to fetch delayed shipments", "DATABASE_ERROR");
    }

    return success(data || []);
  } catch (err) {
    console.error("Get delayed shipments error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Mark shipment as delivered
 */
export async function markAsDelivered(
  shipmentId: string,
  notes?: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Update shipment
    const { error: updateError } = await supabase
      .from("shipments")
      .update({ status: "delivered", updated_at: new Date().toISOString() })
      .eq("id", shipmentId);

    if (updateError) {
      return error("Failed to update shipment", "DATABASE_ERROR");
    }

    // Add tracking event
    await addTrackingEvent(shipmentId, "delivered", notes || "Delivered successfully");

    revalidatePath("/dashboard/tracking");
    revalidatePath("/dashboard/shipments");
    return success(undefined, "Marked as delivered");
  } catch (err) {
    console.error("Mark as delivered error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get tracking dashboard stats
 */
export async function getTrackingStats(): Promise<
  ActionResult<{
    pending: number;
    inTransit: number;
    outForDelivery: number;
    delivered: number;
    delayed: number;
    failed: number;
  }>
> {
  try {
    const supabase = await createClient();

    const statuses = [
      "pending",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "failed",
    ] as const;

    const counts: Record<string, number> = {};

    for (const status of statuses) {
      const { count } = await supabase
        .from("shipments")
        .select("id", { count: "exact", head: true })
        .eq("status", status);
      counts[status] = count || 0;
    }

    // Get delayed count
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const { count: delayedCount } = await supabase
      .from("shipments")
      .select("id", { count: "exact", head: true })
      .eq("status", "in_transit")
      .lt("updated_at", threeDaysAgo.toISOString());

    return success({
      pending: counts.pending,
      inTransit: counts.in_transit,
      outForDelivery: counts.out_for_delivery,
      delivered: counts.delivered,
      delayed: delayedCount || 0,
      failed: counts.failed,
    });
  } catch (err) {
    console.error("Get tracking stats error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
