"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { InventoryItem } from "@/types/database";

interface InventorySearchResult {
  shipment: {
    id: string;
    reference: string;
    status: string;
    consignee_name: string | null;
    consignee_city: string | null;
  };
  location: {
    warehouse: string | null;
    locationCode: string | null;
  };
  manifest: {
    manifestNumber: string | null;
    status: string | null;
  } | null;
}

/**
 * Search inventory by tracking ID, customer, or location
 */
export async function searchInventory(
  query: string,
  options?: {
    warehouseId?: string;
    status?: string;
    limit?: number;
  }
): Promise<ActionResult<InventorySearchResult[]>> {
  try {
    const supabase = await createClient();

    let queryBuilder = supabase
      .from("shipments")
      .select(
        `
        id,
        reference,
        status,
        consignee_name,
        consignee_city,
        manifest_id,
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code),
        manifests(manifest_number, status),
        inventory_items(warehouse_id, location_code, status, warehouses(name))
      `
      )
      .order("updated_at", { ascending: false })
      .limit(options?.limit || 50);

    if (query) {
      queryBuilder = queryBuilder.or(
        `reference.ilike.%${query}%,consignee_name.ilike.%${query}%,consignee_phone.ilike.%${query}%`
      );
    }

    if (options?.status) {
      queryBuilder = queryBuilder.eq("status", options.status);
    }

    const { data, error: dbError } = await queryBuilder;

    if (dbError) {
      return error("Search failed", "DATABASE_ERROR");
    }

    const results: InventorySearchResult[] = (data || []).map((item) => {
      const itemAny = item as unknown as { inventory_items?: Array<{ warehouse_id: string; location_code: string; warehouses?: { name: string } }>; manifests?: { manifest_number: string; status: string } };
      const inventoryItem = itemAny.inventory_items?.[0];
      const manifest = itemAny.manifests;
      
      return {
        shipment: {
          id: item.id,
          reference: item.reference,
          status: item.status,
          consignee_name: item.consignee_name,
          consignee_city: item.consignee_city,
        },
        location: {
          warehouse: inventoryItem?.warehouses?.name || null,
          locationCode: inventoryItem?.location_code || null,
        },
        manifest: manifest
          ? {
              manifestNumber: manifest.manifest_number,
              status: manifest.status,
            }
          : null,
      };
    });

    return success(results);
  } catch (err) {
    console.error("Search inventory error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get shipment location
 */
export async function getShipmentLocation(
  shipmentId: string
): Promise<ActionResult<InventorySearchResult>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("shipments")
      .select(
        `
        id,
        reference,
        status,
        consignee_name,
        consignee_city,
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code),
        manifests(manifest_number, status),
        inventory_items(warehouse_id, location_code, status, warehouses(name))
      `
      )
      .eq("id", shipmentId)
      .single();

    if (dbError || !data) {
      return error("Shipment not found", "NOT_FOUND");
    }

    const dataAny = data as unknown as { inventory_items?: Array<{ warehouse_id: string; location_code: string; warehouses?: { name: string } }>; manifests?: { manifest_number: string; status: string } };
    const inventoryItem = dataAny.inventory_items?.[0];
    const manifest = dataAny.manifests;

    return success({
      shipment: {
        id: data.id,
        reference: data.reference,
        status: data.status,
        consignee_name: data.consignee_name,
        consignee_city: data.consignee_city,
      },
      location: {
        warehouse: inventoryItem?.warehouses?.name || null,
        locationCode: inventoryItem?.location_code || null,
      },
      manifest: manifest
        ? {
            manifestNumber: manifest.manifest_number,
            status: manifest.status,
          }
        : null,
    });
  } catch (err) {
    console.error("Get shipment location error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Update inventory location
 */
export async function updateInventoryLocation(
  shipmentId: string,
  warehouseId: string,
  locationCode?: string
): Promise<ActionResult<InventoryItem>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get shipment organization
    const { data: shipment } = await supabase
      .from("shipments")
      .select("organization_id")
      .eq("id", shipmentId)
      .single();

    if (!shipment) {
      return error("Shipment not found", "NOT_FOUND");
    }

    // Upsert inventory item
    const { data, error: dbError } = await supabase
      .from("inventory_items")
      .upsert(
        {
          shipment_id: shipmentId,
          warehouse_id: warehouseId,
          location_code: locationCode || null,
          status: "in_warehouse",
          organization_id: shipment.organization_id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "shipment_id" }
      )
      .select()
      .single();

    if (dbError) {
      return error("Failed to update location", "DATABASE_ERROR");
    }

    // Log adjustment
    await supabase.from("inventory_adjustments").insert({
      inventory_item_id: data.id,
      adjustment_type: "location_change",
      notes: `Moved to ${locationCode || "default location"}`,
      adjusted_by: user.id,
      organization_id: shipment.organization_id,
    });

    revalidatePath("/dashboard/inventory");
    return success(data as InventoryItem, "Location updated");
  } catch (err) {
    console.error("Update inventory location error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get warehouse inventory summary
 */
export async function getWarehouseInventory(
  warehouseId: string
): Promise<ActionResult<{ total: number; byStatus: Record<string, number> }>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("inventory_items")
      .select("status")
      .eq("warehouse_id", warehouseId);

    if (dbError) {
      return error("Failed to fetch inventory", "DATABASE_ERROR");
    }

    const byStatus: Record<string, number> = {};
    for (const item of data || []) {
      byStatus[item.status] = (byStatus[item.status] || 0) + 1;
    }

    return success({
      total: data?.length || 0,
      byStatus,
    });
  } catch (err) {
    console.error("Get warehouse inventory error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}

/**
 * Get items at a specific location
 */
export async function getItemsAtLocation(
  warehouseId: string,
  locationCode: string
): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    const { data, error: dbError } = await supabase
      .from("inventory_items")
      .select(
        `
        *,
        shipments(reference, consignee_name, status)
      `
      )
      .eq("warehouse_id", warehouseId)
      .eq("location_code", locationCode);

    if (dbError) {
      return error("Failed to fetch items", "DATABASE_ERROR");
    }

    return success(data || []);
  } catch (err) {
    console.error("Get items at location error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
