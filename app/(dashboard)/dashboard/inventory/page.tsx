import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { InventoryClient } from "./_components/inventory-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getWarehouses() {
    const supabase = await createClient();
    
    const { data } = await supabase
        .from("warehouses")
        .select("id, name, code")
        .eq("is_active", true)
        .order("name");

    return data || [];
}

async function getInventorySummary() {
    const supabase = await createClient();
    
    // Get shipment counts by status for inventory view
    const { data: shipments } = await supabase
        .from("shipments")
        .select(`
            id,
            reference,
            status,
            consignee_name,
            consignee_city,
            pieces,
            weight_kg,
            manifest_id,
            created_at,
            origin_warehouse:warehouses!origin_warehouse_id(id, name, code),
            destination_warehouse:warehouses!destination_warehouse_id(id, name, code),
            manifests(manifest_number, status)
        `)
        .in("status", ["pending", "picked_up", "in_transit"])
        .order("created_at", { ascending: false })
        .limit(100);

    return (shipments || []).map(s => ({
        ...s,
        origin_warehouse: normalizeJoinSingle(s.origin_warehouse),
        destination_warehouse: normalizeJoinSingle(s.destination_warehouse),
        manifests: normalizeJoinSingle(s.manifests),
    }));
}

export default async function InventoryPage() {
    const [warehouses, inventory] = await Promise.all([
        getWarehouses(),
        getInventorySummary(),
    ]);

    return (
        <>
            <V2Header title="Inventory" section="Operations" />
            <main className="flex-1 overflow-y-auto p-8 scroll-smooth" id="main-scroll">
                <div className="max-w-[1600px] mx-auto pb-20">
                    <InventoryClient 
                        warehouses={warehouses}
                        initialInventory={inventory}
                    />
                </div>
            </main>
        </>
    );
}
