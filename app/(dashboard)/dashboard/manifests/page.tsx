import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { ManifestsClient } from "./_components/manifests-client";
import { normalizeJoinSingle } from "@/lib/utils";

async function getManifests() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("manifests")
        .select(`
            id,
            manifest_number,
            status,
            transport_mode,
            vehicle_number,
            driver_name,
            planned_departure,
            actual_departure,
            total_pieces,
            total_weight,
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code),
            created_at
        `)
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) {
        console.error("Failed to fetch manifests:", (error as { message: string })?.message ?? error);
        return [];
    }

    if (!data) {
        return [];
    }

    return data.map(m => ({
        ...m,
        origin_warehouse: normalizeJoinSingle(m.origin_warehouse),
        destination_warehouse: normalizeJoinSingle(m.destination_warehouse),
    }));
}

async function getUnassignedShipments() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("shipments")
        .select(`
            id,
            reference,
            consignee_name,
            consignee_city,
            pieces,
            weight_kg,
            origin_warehouse:warehouses!origin_warehouse_id(name, code),
            destination_warehouse:warehouses!destination_warehouse_id(name, code)
        `)
        .is("manifest_id", null)
        .in("status", ["pending", "picked_up"])
        .order("created_at", { ascending: false })
        .limit(50);

    return (data || []).map(s => ({
        ...s,
        origin_warehouse: normalizeJoinSingle(s.origin_warehouse),
        destination_warehouse: normalizeJoinSingle(s.destination_warehouse),
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

export default async function ManifestsPage() {
    const [manifests, unassignedShipments, warehouses] = await Promise.all([
        getManifests(),
        getUnassignedShipments(),
        getWarehouses(),
    ]);

    return (
        <>
            <V2Header title="Manifests" section="Ops Control" />
            <main className="flex-1 overflow-x-auto overflow-y-auto p-6" id="main-scroll">
                <ManifestsClient
                    initialManifests={manifests}
                    unassignedShipments={unassignedShipments}
                    warehouses={warehouses}
                />
            </main>
        </>
    );
}
