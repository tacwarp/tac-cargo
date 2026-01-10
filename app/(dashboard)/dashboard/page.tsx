import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "./_components/v2-header";
import { MissionControl } from "./_components/mission-control";

async function getDashboardStats() {
    const supabase = await createClient();

    // Shipment counts by status
    const statuses = ["booked", "picked_up", "in_transit", "out_for_delivery", "delivered", "exception"] as const;
    const shipmentCounts: Record<string, number> = {};

    for (const status of statuses) {
        const { count } = await supabase
            .from("shipments")
            .select("id", { count: "exact", head: true })
            .eq("status", status);
        shipmentCounts[status] = count || 0;
    }

    // Today's shipments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayCount } = await supabase
        .from("shipments")
        .select("id", { count: "exact", head: true })
        .gte("created_at", today.toISOString());

    // Revenue (from paid invoices)
    const { data: paidInvoices } = await supabase
        .from("invoices")
        .select("total_amount")
        .eq("status", "paid");
    const totalRevenue = (paidInvoices || []).reduce((sum, i) => sum + i.total_amount, 0);

    // Outstanding
    const { data: outstandingInvoices } = await supabase
        .from("invoices")
        .select("balance_due")
        .gt("balance_due", 0);
    const totalOutstanding = (outstandingInvoices || []).reduce((sum, i) => sum + i.balance_due, 0);

    // Active manifests
    const { count: activeManifests } = await supabase
        .from("manifests")
        .select("id", { count: "exact", head: true })
        .in("status", ["draft", "finalized", "dispatched"]);

    // Delayed shipments
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const { count: delayedCount } = await supabase
        .from("shipments")
        .select("id", { count: "exact", head: true })
        .eq("status", "in_transit")
        .lt("updated_at", threeDaysAgo.toISOString());

    return {
        shipments: {
            total: Object.values(shipmentCounts).reduce((a, b) => a + b, 0),
            pending: shipmentCounts.booked,
            inTransit: shipmentCounts.in_transit,
            delivered: shipmentCounts.delivered,
            failed: shipmentCounts.exception,
            today: todayCount || 0,
            delayed: delayedCount || 0,
        },
        finance: {
            revenue: totalRevenue,
            outstanding: totalOutstanding,
        },
        operations: {
            activeManifests: activeManifests || 0,
        },
    };
}

async function getRecentActivity() {
    const supabase = await createClient();

    const { data: recentShipments } = await supabase
        .from("shipments")
        .select("id, reference, status, consignee_name, updated_at")
        .order("updated_at", { ascending: false })
        .limit(10);

    return recentShipments || [];
}

export default async function OverviewPage() {
    const [stats, recentActivity, shipmentTrend] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
        getShipmentTrend(),
    ]);

    return (
        <>
            <V2Header title="Mission Control" section="Main Deck" />
            <main className="flex-1 overflow-y-auto p-8 scroll-smooth" id="main-scroll">
                <div className="max-w-[1600px] mx-auto pb-20">
                    <MissionControl 
                        stats={stats} 
                        recentActivity={recentActivity}
                        shipmentTrend={shipmentTrend}
                    />
                </div>
            </main>
        </>
    );
}

async function getShipmentTrend() {
    const supabase = await createClient();
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data } = await supabase
        .from("shipments")
        .select("created_at")
        .gte("created_at", sevenDaysAgo.toISOString());
    
    // Group by date
    const grouped: Record<string, number> = {};
    (data || []).forEach(s => {
        const date = new Date(s.created_at).toISOString().split("T")[0];
        grouped[date] = (grouped[date] || 0) + 1;
    });
    
    // Fill in missing dates
    const result: Array<{ date: string; count: number }> = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split("T")[0];
        result.push({ date: dateStr, count: grouped[dateStr] || 0 });
    }
    
    return result;
}
