import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShipmentDetailClient } from "./_components/shipment-detail-client";
import { normalizeJoinSingle } from "@/lib/utils";

interface ShipmentDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getShipment(id: string) {
  const supabase = await createClient();
  
  const { data: shipment, error } = await supabase
    .from("shipments")
    .select(`
      *,
      customers(id, name, phone, email, address, city, state, pincode, gst_number),
      origin_warehouse:warehouses!origin_warehouse_id(id, name, code, city, state),
      destination_warehouse:warehouses!destination_warehouse_id(id, name, code, city, state),
      manifests:manifest_id(id, manifest_number, status),
      tracking_events(id, status, location, description, created_at),
      invoices(id, invoice_no, status, total_amount)
    `)
    .eq("id", id)
    .single();

  if (error || !shipment) {
    return null;
  }

  return {
    ...shipment,
    origin_warehouse: normalizeJoinSingle(shipment.origin_warehouse),
    destination_warehouse: normalizeJoinSingle(shipment.destination_warehouse),
    customers: normalizeJoinSingle(shipment.customers),
    manifests: normalizeJoinSingle(shipment.manifests),
  };
}

export default async function ShipmentDetailPage({ params }: ShipmentDetailPageProps) {
  const { id } = await params;
  const shipment = await getShipment(id);

  if (!shipment) {
    notFound();
  }

  return (
    <Suspense fallback={<ShipmentDetailSkeleton />}>
      <ShipmentDetailClient shipment={shipment} />
    </Suspense>
  );
}

function ShipmentDetailSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 bg-muted rounded" />
        <div className="h-24 bg-muted rounded" />
        <div className="h-24 bg-muted rounded" />
        <div className="h-24 bg-muted rounded" />
      </div>
      <div className="h-64 bg-muted rounded" />
    </div>
  );
}
