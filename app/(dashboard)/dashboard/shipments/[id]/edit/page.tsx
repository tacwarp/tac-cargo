import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ShipmentEditClient } from "./_components/shipment-edit-client";
import { normalizeJoinSingle } from "@/lib/utils";

interface ShipmentEditPageProps {
  params: Promise<{ id: string }>;
}

async function getShipment(id: string) {
  const supabase = await createClient();
  
  const { data: shipment, error } = await supabase
    .from("shipments")
    .select(`
      *,
      customers(id, name, phone, email),
      origin_warehouse:warehouses!origin_warehouse_id(id, name, code),
      destination_warehouse:warehouses!destination_warehouse_id(id, name, code)
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
  };
}

async function getWarehouses() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("warehouses")
    .select("id, name, code")
    .eq("is_active", true)
    .order("name");
  return data || [];
}

export default async function ShipmentEditPage({ params }: ShipmentEditPageProps) {
  const { id } = await params;
  const [shipment, warehouses] = await Promise.all([
    getShipment(id),
    getWarehouses(),
  ]);

  if (!shipment) {
    notFound();
  }

  if (shipment.status === "cancelled" || shipment.status === "delivered") {
    notFound();
  }

  return (
    <Suspense fallback={<EditSkeleton />}>
      <ShipmentEditClient shipment={shipment} warehouses={warehouses} />
    </Suspense>
  );
}

function EditSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="space-y-4">
        <div className="h-12 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
        <div className="h-12 bg-muted rounded" />
      </div>
    </div>
  );
}
