import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { ShipmentsTableClient } from "./_components/shipments-table-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getShipments() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("shipments")
        .select(`
            id,
            reference,
            status,
            consignee_name,
            consignee_city,
            consignee_state,
            pieces,
            weight_kg,
            transport_mode,
            created_at,
            updated_at,
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code),
            customers(name)
        `)
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        console.error("Failed to fetch shipments:", (error as { message: string })?.message ?? error);
        // Return empty array to keep the page functional even if Supabase/RLS rejects the query
        return [];
    }

    if (!data) {
        return [];
    }

    // Normalize joined relations
    return data.map(s => ({
        ...s,
        origin_warehouse: normalizeJoinSingle(s.origin_warehouse),
        destination_warehouse: normalizeJoinSingle(s.destination_warehouse),
        customers: normalizeJoinSingle(s.customers),
        manifests: null,
    }));
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

async function getCustomers() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("customers")
        .select("id, name, phone")
        .order("name")
        .limit(100);

    return data || [];
}

export default async function ShipmentsPage() {
    const [shipments, warehouses, customers] = await Promise.all([
        getShipments(),
        getWarehouses(),
        getCustomers(),
    ]);

    return (
        <>
            <V2Header title="Shipments" section="Operations" />
            <main className="flex-1 overflow-y-auto p-8 scroll-smooth" id="main-scroll">
                <div className="max-w-[1600px] mx-auto pb-20">
                    <ShipmentsTableClient
                        initialShipments={shipments}
                        warehouses={warehouses}
                        customers={customers}
                    />
                </div>
            </main>
        </>
    );
}
