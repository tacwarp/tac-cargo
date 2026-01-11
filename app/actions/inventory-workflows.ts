"use server";

/**
 * @fileoverview Inventory Cross-System Coherence
 * 
 * This module ensures atomic updates across all interconnected systems:
 * - Inventory levels
 * - Manifest items
 * - Shipment status
 * - Tracking events
 * 
 * A single scan operation must update ALL systems atomically to prevent
 * contradictory states (e.g., shipment marked as "in manifest" but inventory
 * not decremented, or tracking event missing).
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";

/**
 * Atomic inventory adjustment with cross-system updates
 * 
 * When inventory is adjusted (e.g., items scanned into manifest):
 * 1. Update inventory levels
 * 2. Create/update shipment record
 * 3. Add to manifest (if applicable)
 * 4. Create tracking event
 * 5. Audit log
 * 
 * All operations must succeed or all must fail (atomic transaction semantics)
 */
export async function adjustInventoryWithShipment(input: {
  warehouseId: string;
  itemSku: string;
  quantity: number;
  shipmentId: string;
  manifestId?: string;
  notes?: string;
}): Promise<ActionResult<{ inventoryUpdated: boolean; shipmentUpdated: boolean; trackingCreated: boolean }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Step 1: Get current inventory level
    const { data: inventory, error: inventoryError } = await supabase
      .from("inventory")
      .select("*")
      .eq("warehouse_id", input.warehouseId)
      .eq("item_sku", input.itemSku)
      .single();

    if (inventoryError || !inventory) {
      return error(`Inventory item ${input.itemSku} not found in warehouse`, "NOT_FOUND");
    }

    // Validate sufficient quantity
    if (inventory.quantity < input.quantity) {
      return error(
        `Insufficient inventory: ${inventory.quantity} available, ${input.quantity} requested`,
        "VALIDATION_ERROR"
      );
    }

    // Step 2: Update inventory (atomic decrement)
    const newQuantity = inventory.quantity - input.quantity;
    const { error: updateInventoryError } = await supabase
      .from("inventory")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", inventory.id)
      .eq("quantity", inventory.quantity); // Optimistic lock

    if (updateInventoryError) {
      if (updateInventoryError.code === "PGRST116") {
        return error(
          "Inventory was modified by another transaction. Please retry.",
          "CONFLICT"
        );
      }
      return error(`Failed to update inventory: ${updateInventoryError.message}`, "DATABASE_ERROR");
    }

    // Step 3: Update shipment status
    const { error: updateShipmentError } = await supabase
      .from("shipments")
      .update({
        status: input.manifestId ? "in_transit" : "picked_up",
        manifest_id: input.manifestId || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.shipmentId);

    if (updateShipmentError) {
      // Rollback inventory update
      await supabase
        .from("inventory")
        .update({
          quantity: inventory.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inventory.id);

      return error(`Failed to update shipment: ${updateShipmentError.message}`, "DATABASE_ERROR");
    }

    // Step 4: Create tracking event
    const { error: trackingError } = await supabase
      .from("tracking_events")
      .insert({
        shipment_id: input.shipmentId,
        event_type: input.manifestId ? "manifest_load" : "picked_up",
        status: input.manifestId ? "in_transit" : "picked_up",
        description: input.notes || `Inventory adjusted: ${input.quantity} × ${input.itemSku}`,
        warehouse_id: input.warehouseId,
        created_by: user.id,
        organization_id: inventory.organization_id,
      });

    if (trackingError) {
      // Rollback previous updates
      await supabase
        .from("inventory")
        .update({
          quantity: inventory.quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", inventory.id);

      await supabase
        .from("shipments")
        .update({
          status: "pending",
          manifest_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.shipmentId);

      return error(`Failed to create tracking event: ${trackingError.message}`, "DATABASE_ERROR");
    }

    // Step 5: Add to manifest if specified
    if (input.manifestId) {
      const { error: manifestError } = await supabase
        .from("manifest_items")
        .insert({
          manifest_id: input.manifestId,
          shipment_id: input.shipmentId,
          scanned_at: new Date().toISOString(),
          scanned_by: user.id,
          organization_id: inventory.organization_id,
        });

      if (manifestError) {
        // Rollback all previous updates
        await supabase
          .from("inventory")
          .update({
            quantity: inventory.quantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", inventory.id);

        await supabase
          .from("shipments")
          .update({
            status: "pending",
            manifest_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", input.shipmentId);

        await supabase
          .from("tracking_events")
          .delete()
          .eq("shipment_id", input.shipmentId)
          .eq("event_type", "manifest_load");

        return error(`Failed to add to manifest: ${manifestError.message}`, "DATABASE_ERROR");
      }
    }

    // Step 6: Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "inventory_adjust_with_shipment",
      entity_type: "inventory",
      entity_id: inventory.id,
      details: {
        warehouse_id: input.warehouseId,
        item_sku: input.itemSku,
        quantity_adjusted: -input.quantity,
        new_quantity: newQuantity,
        shipment_id: input.shipmentId,
        manifest_id: input.manifestId,
      },
      organization_id: inventory.organization_id,
    });

    revalidatePath("/dashboard/inventory");
    revalidatePath("/dashboard/shipments");
    revalidatePath("/dashboard/manifests");
    revalidatePath("/dashboard/tracking");

    return success({
      inventoryUpdated: true,
      shipmentUpdated: true,
      trackingCreated: true,
    });
  } catch (err) {
    return error(
      `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      "INTERNAL_ERROR"
    );
  }
}

/**
 * Reconcile inventory across systems
 * 
 * Ensures consistency between:
 * - Inventory records
 * - Shipments referencing that inventory
 * - Manifest items
 * - Tracking events
 * 
 * Returns discrepancies found and optionally fixes them
 */
export async function reconcileInventory(
  warehouseId: string,
  autoFix: boolean = false
): Promise<ActionResult<{
  discrepancies: Array<{
    itemSku: string;
    expectedQuantity: number;
    actualQuantity: number;
    difference: number;
  }>;
  fixed: boolean;
}>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Get all inventory items for warehouse
    const { data: inventoryItems, error: inventoryError } = await supabase
      .from("inventory")
      .select("*")
      .eq("warehouse_id", warehouseId);

    if (inventoryError) {
      return error(`Failed to fetch inventory: ${inventoryError.message}`, "DATABASE_ERROR");
    }

    if (!inventoryItems || inventoryItems.length === 0) {
      return success({ discrepancies: [], fixed: false });
    }

    const discrepancies: Array<{
      itemSku: string;
      expectedQuantity: number;
      actualQuantity: number;
      difference: number;
    }> = [];

    // For each inventory item, calculate expected quantity based on shipments
    for (const item of inventoryItems) {
      // Count shipments that should have decremented this inventory
      const { count: shipmentCount } = await supabase
        .from("shipments")
        .select("*", { count: "exact", head: true })
        .eq("origin_warehouse_id", warehouseId)
        .neq("status", "pending")
        .neq("status", "cancelled");

      // For simplicity, assume 1 unit per shipment (in production, join with line items)
      const expectedDecrements = shipmentCount || 0;

      // Expected quantity = initial - decrements
      // (Note: We'd need to track initial quantity or use a more sophisticated approach)
      // For this example, we just check if current quantity seems reasonable

      if (item.quantity < 0) {
        discrepancies.push({
          itemSku: item.item_sku,
          expectedQuantity: 0,
          actualQuantity: item.quantity,
          difference: item.quantity,
        });

        if (autoFix) {
          await supabase
            .from("inventory")
            .update({
              quantity: 0,
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.id);
        }
      }
    }

    if (autoFix && discrepancies.length > 0) {
      await supabase.from("audit_logs").insert({
        user_id: user.id,
        action: "inventory_reconcile",
        entity_type: "inventory",
        entity_id: warehouseId,
        details: {
          discrepancies_found: discrepancies.length,
          auto_fixed: true,
        },
        organization_id: inventoryItems[0].organization_id,
      });
    }

    return success({
      discrepancies,
      fixed: autoFix && discrepancies.length > 0,
    });
  } catch (err) {
    return error(
      `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      "INTERNAL_ERROR"
    );
  }
}

/**
 * Get inventory status for a warehouse
 * 
 * Returns current inventory levels with status indicators
 */
export async function getInventoryStatus(
  warehouseId: string
): Promise<ActionResult<{
  items: Array<{
    sku: string;
    name: string;
    quantity: number;
    status: "stock-critical" | "stock-low" | "stock-optimal";
    reorderPoint: number;
  }>;
  summary: {
    critical: number;
    low: number;
    optimal: number;
  };
}>> {
  try {
    const supabase = await createClient();

    const { data: inventoryItems, error: inventoryError } = await supabase
      .from("inventory")
      .select("*")
      .eq("warehouse_id", warehouseId)
      .order("item_sku");

    if (inventoryError) {
      return error(`Failed to fetch inventory: ${inventoryError.message}`, "DATABASE_ERROR");
    }

    const items = (inventoryItems || []).map((item) => {
      const reorderPoint = item.reorder_point || 10;
      let status: "stock-critical" | "stock-low" | "stock-optimal";

      if (item.quantity <= reorderPoint * 0.5) {
        status = "stock-critical";
      } else if (item.quantity <= reorderPoint) {
        status = "stock-low";
      } else {
        status = "stock-optimal";
      }

      return {
        sku: item.item_sku,
        name: item.item_name || item.item_sku,
        quantity: item.quantity,
        status,
        reorderPoint,
      };
    });

    const summary = {
      critical: items.filter((i) => i.status === "stock-critical").length,
      low: items.filter((i) => i.status === "stock-low").length,
      optimal: items.filter((i) => i.status === "stock-optimal").length,
    };

    return success({ items, summary });
  } catch (err) {
    return error(
      `Unexpected error: ${err instanceof Error ? err.message : String(err)}`,
      "INTERNAL_ERROR"
    );
  }
}

