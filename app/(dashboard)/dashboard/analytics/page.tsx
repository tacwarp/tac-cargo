import React from "react";
import { createClient } from "@/lib/supabase/server";
import { V2Header } from "../_components/v2-header";
import { AnalyticsClient } from "./_components/analytics-client";

async function getAnalyticsData() {
    const supabase = await createClient();
    
    // Get shipments by date for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: shipments } = await supabase
        .from("shipments")
        .select("created_at, status, weight_kg, pieces")
        .gte("created_at", thirtyDaysAgo.toISOString());

    // Get invoices for revenue data
    const { data: invoices } = await supabase
        .from("invoices")
        .select("total_amount, status, created_at")
        .gte("created_at", thirtyDaysAgo.toISOString());

    // Get delivery stats
    const deliveredCount = (shipments || []).filter(s => s.status === "delivered").length;
    const failedCount = (shipments || []).filter(s => s.status === "failed").length;
    const totalCount = (shipments || []).length;

    // Calculate totals
    const totalWeight = (shipments || []).reduce((sum, s) => sum + (s.weight_kg || 0), 0);
    const totalPieces = (shipments || []).reduce((sum, s) => sum + (s.pieces || 0), 0);
    const totalRevenue = (invoices || []).filter(i => i.status === "paid").reduce((sum, i) => sum + i.total_amount, 0);

    // Group by date for charts
    const shipmentsByDate: Record<string, number> = {};
    const revenueByDate: Record<string, number> = {};

    (shipments || []).forEach(s => {
        const date = new Date(s.created_at).toISOString().split("T")[0];
        shipmentsByDate[date] = (shipmentsByDate[date] || 0) + 1;
    });

    (invoices || []).filter(i => i.status === "paid").forEach(i => {
        const date = new Date(i.created_at).toISOString().split("T")[0];
        revenueByDate[date] = (revenueByDate[date] || 0) + i.total_amount;
    });

    return {
        summary: {
            totalShipments: totalCount,
            deliveredCount,
            failedCount,
            deliveryRate: totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 0,
            totalWeight,
            totalPieces,
            totalRevenue,
        },
        charts: {
            shipmentsByDate: Object.entries(shipmentsByDate).map(([date, count]) => ({ date, count })),
            revenueByDate: Object.entries(revenueByDate).map(([date, amount]) => ({ date, amount })),
        },
    };
}

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    return (
        <>
            <V2Header title="Analytics" section="Main Deck" />
            <main className="flex-1 overflow-y-auto p-8 scroll-smooth" id="main-scroll">
                <div className="max-w-[1600px] mx-auto pb-20">
                    <AnalyticsClient data={data} />
                </div>
            </main>
        </>
    );
}
