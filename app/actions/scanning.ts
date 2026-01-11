"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type ActionResult, success, error } from "@/types/action-result";
import type { Shipment, ShipmentStatus } from "@/types/database";

type ScanType =
  | "pickup"
  | "warehouse_in"
  | "warehouse_out"
  | "manifest_load"
  | "manifest_unload"
  | "out_for_delivery"
  | "delivered"
  | "failed_delivery"
  | "returned";

interface ScanResult {
  shipment: Shipment;
  scanType: ScanType;
  previousStatus: ShipmentStatus;
  newStatus: ShipmentStatus;
  timestamp: string;
}

/**
 * Map scan types to shipment statuses
 */
const scanToStatusMap: Record<ScanType, ShipmentStatus> = {
  pickup: "picked_up",
  warehouse_in: "in_transit",
  warehouse_out: "in_transit",
  manifest_load: "in_transit",
  manifest_unload: "in_transit",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  failed_delivery: "exception",
  returned: "returned",
};

/**
 * Process a barcode scan
 */
export async function processScan(
  barcode: string,
  scanType: ScanType,
  warehouseId?: string,
  notes?: string
): Promise<ActionResult<ScanResult>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return error("Unauthorized", "UNAUTHORIZED");
    }

    // Parse barcode - could be shipment reference or AWB
    const reference = barcode.toUpperCase().trim();

    // Find shipment
    const { data: shipment } = await supabase
      .from("shipments")
      .select("*")
      .or(`reference.eq.${reference}`)
      .single();

    if (!shipment) {
      // Try finding by invoice AWB
      const { data: invoice } = await supabase
        .from("invoices")
        .select("shipment_id")
        .eq("awb_no", reference)
        .single();

      if (!invoice?.shipment_id) {
        return error(`Shipment not found: ${reference}`, "NOT_FOUND");
      }

      const { data: shipmentByAwb } = await supabase
        .from("shipments")
        .select("*")
        .eq("id", invoice.shipment_id)
        .single();

      if (!shipmentByAwb) {
        return error("Shipment not found", "NOT_FOUND");
      }

      return processShipmentScan(
        supabase,
        user.id,
        shipmentByAwb,
        scanType,
        warehouseId,
        notes
      );
    }

    return processShipmentScan(
      supabase,
      user.id,
      shipment,
      scanType,
      warehouseId,
      notes
    );
  } catch (err) {
    console.error("Process scan error:", err);
    return error("Scan processing failed", "INTERNAL_ERROR");
  }
}

async function processShipmentScan(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  shipment: Shipment,
  scanType: ScanType,
  warehouseId?: string,
  notes?: string
): Promise<ActionResult<ScanResult>> {
  const previousStatus = shipment.status;
  const newStatus = scanToStatusMap[scanType];

  // Update shipment status
  const { error: updateError } = await supabase
    .from("shipments")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", shipment.id);

  if (updateError) {
    return error("Failed to update shipment", "DATABASE_ERROR");
  }

  // Create scan event
  const { error: scanError } = await supabase.from("scan_events").insert({
    shipment_id: shipment.id,
    manifest_id: shipment.manifest_id,
    scan_type: scanType,
    warehouse_id: warehouseId || null,
    scanned_by: userId,
    notes: notes || null,
    organization_id: shipment.organization_id,
  });

  if (scanError) {
    console.error("Failed to create scan event:", scanError);
  }

  // Create tracking event
  await supabase.from("tracking_events").insert({
    shipment_id: shipment.id,
    status: newStatus,
    description: getScanDescription(scanType, notes),
    is_public: true,
    organization_id: shipment.organization_id,
  });

  revalidatePath("/dashboard/scanning");
  revalidatePath("/dashboard/shipments");
  revalidatePath("/dashboard/tracking");

  return success({
    shipment: { ...shipment, status: newStatus },
    scanType,
    previousStatus,
    newStatus,
    timestamp: new Date().toISOString(),
  });
}

function getScanDescription(scanType: ScanType, notes?: string): string {
  const descriptions: Record<ScanType, string> = {
    pickup: "Package picked up",
    warehouse_in: "Arrived at warehouse",
    warehouse_out: "Departed from warehouse",
    manifest_load: "Loaded onto manifest",
    manifest_unload: "Unloaded from manifest",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered successfully",
    failed_delivery: "Delivery attempt failed",
    returned: "Returned to sender",
  };
  return notes ? `${descriptions[scanType]} - ${notes}` : descriptions[scanType];
}

/**
 * Quick lookup by barcode (no status change)
 */
export async function lookupByBarcode(
  barcode: string
): Promise<ActionResult<Shipment & { tracking_events?: unknown[] }>> {
  try {
    const supabase = await createClient();

    const reference = barcode.toUpperCase().trim();

    const { data: shipment } = await supabase
      .from("shipments")
      .select(
        `
        *,
        customers(name, phone),
        origin_warehouse:warehouses!origin_warehouse_id(name, code),
        destination_warehouse:warehouses!destination_warehouse_id(name, code),
        manifests(manifest_number, status),
        tracking_events(status, description, created_at, is_public)
      `
      )
      .eq("reference", reference)
      .single();

    if (!shipment) {
      // Try AWB lookup
      const { data: invoice } = await supabase
        .from("invoices")
        .select("shipment_id")
        .eq("awb_no", reference)
        .single();

      if (invoice?.shipment_id) {
        const { data: shipmentByAwb } = await supabase
          .from("shipments")
          .select(
            `
            *,
            customers(name, phone),
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code),
            manifests(manifest_number, status),
            tracking_events(status, description, created_at, is_public)
          `
          )
          .eq("id", invoice.shipment_id)
          .single();

        if (shipmentByAwb) {
          return success(shipmentByAwb as Shipment & { tracking_events?: unknown[] });
        }
      }

      return error("Shipment not found", "NOT_FOUND");
    }

    return success(shipment as Shipment & { tracking_events?: unknown[] });
  } catch (err) {
    console.error("Lookup error:", err);
    return error("Lookup failed", "INTERNAL_ERROR");
  }
}

/**
 * Bulk scan for manifest loading
 */
export async function bulkScanToManifest(
  manifestId: string,
  barcodes: string[]
): Promise<ActionResult<{ success: number; failed: number; errors: string[] }>> {
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
      .select("status")
      .eq("id", manifestId)
      .single();

    if (!manifest) {
      return error("Manifest not found", "NOT_FOUND");
    }

    if (manifest.status !== "open" && manifest.status !== "draft") {
      return error("Manifest is locked", "CONFLICT");
    }

    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const barcode of barcodes) {
      const result = await processScan(barcode, "manifest_load");
      if (result.success) {
        // Also assign to manifest
        await supabase
          .from("shipments")
          .update({ manifest_id: manifestId })
          .eq("id", result.data.shipment.id);
        successCount++;
      } else {
        failedCount++;
        errors.push(`${barcode}: ${result.error}`);
      }
    }

    revalidatePath("/dashboard/manifests");
    revalidatePath(`/dashboard/manifests/${manifestId}`);

    return success({
      success: successCount,
      failed: failedCount,
      errors,
    });
  } catch (err) {
    console.error("Bulk scan error:", err);
    return error("Bulk scan failed", "INTERNAL_ERROR");
  }
}

/**
 * Get recent scans for a warehouse
 */
export async function getRecentScans(
  warehouseId?: string,
  limit = 50
): Promise<ActionResult<unknown[]>> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("scan_events")
      .select(
        `
        *,
        shipments(reference, consignee_name, status),
        profiles(full_name)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (warehouseId) {
      query = query.eq("warehouse_id", warehouseId);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
      return error("Failed to fetch scans", "DATABASE_ERROR");
    }

    return success(data || []);
  } catch (err) {
    console.error("Get recent scans error:", err);
    return error("Internal server error", "INTERNAL_ERROR");
  }
}
