import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { ExceptionsClient } from "./_components/exceptions-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getAvailableShipments() {
    const supabase = await createClient();
    
    // Get shipments that can be marked as exceptions (in transit, out for delivery, picked up)
    const { data } = await supabase
        .from("shipments")
        .select("id, reference, consignee_name, consignee_city, status")
        .in("status", ["in_transit", "out_for_delivery", "picked_up", "pending"])
        .order("created_at", { ascending: false })
        .limit(100);

    return data || [];
}

async function getExceptions() {
    const supabase = await createClient();
    
    // Get failed and delayed shipments as "exceptions"
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Failed deliveries
    const { data: failedShipments } = await supabase
        .from("shipments")
        .select(`
            id,
            reference,
            status,
            consignee_name,
            consignee_city,
            updated_at,
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code)
        `)
        .eq("status", "failed")
        .order("updated_at", { ascending: false })
        .limit(20);

    // Delayed (in transit > 3 days)
    const { data: delayedShipments } = await supabase
        .from("shipments")
        .select(`
            id,
            reference,
            status,
            consignee_name,
            consignee_city,
            updated_at,
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code)
        `)
        .eq("status", "in_transit")
        .lt("updated_at", threeDaysAgo.toISOString())
        .order("updated_at", { ascending: true })
        .limit(20);

    // Normalize and combine into exceptions with type
    type RawShipment = NonNullable<typeof failedShipments>[number];
    const normalizeShipment = (s: RawShipment) => ({
        id: s.id,
        reference: s.reference,
        status: s.status,
        consignee_name: s.consignee_name,
        consignee_city: s.consignee_city,
        updated_at: s.updated_at,
        origin_warehouse: normalizeJoinSingle(s.origin_warehouse),
        destination_warehouse: normalizeJoinSingle(s.destination_warehouse),
    });
    
    const exceptions = [
        ...(failedShipments || []).map(s => ({ ...normalizeShipment(s), exception_type: "failed" as const })),
        ...(delayedShipments || []).map(s => ({ ...normalizeShipment(s), exception_type: "delayed" as const })),
    ].sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return exceptions;
}

export default async function ExceptionsPage() {
    const [exceptions, availableShipments] = await Promise.all([
        getExceptions(),
        getAvailableShipments(),
    ]);

    return (
        <>
            <V2Header title="Exceptions" section="Ops Control" />
            <main className="flex-1 overflow-y-auto p-6 scroll-smooth" id="main-scroll">
                <div className="max-w-6xl mx-auto">
                    <ExceptionsClient 
                        initialExceptions={exceptions} 
                        availableShipments={availableShipments}
                    />
                </div>
            </main>
        </>
    );
}
