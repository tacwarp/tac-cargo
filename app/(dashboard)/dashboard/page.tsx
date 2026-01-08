import React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { V2Header } from "./_components/v2-header";
import { OverviewClient } from "./_components/overview-client";

async function getDashboardStats() {
    const supabase = await createClient();

    // Shipment counts by status
    const statuses = ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed"] as const;
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
        .in("status", ["open", "locked", "dispatched"]);

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
            pending: shipmentCounts.pending,
            inTransit: shipmentCounts.in_transit,
            delivered: shipmentCounts.delivered,
            failed: shipmentCounts.failed,
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
    const [stats, recentActivity] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(),
    ]);

    return (
        <>
            <V2Header title="Overview" section="Main Deck" />
            <main className="flex-1 overflow-y-auto p-8 scroll-smooth" id="main-scroll">
                <div className="max-w-[1600px] mx-auto pb-20">
                    {/* Page Header */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                                Mission Control
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Real-time status of global logistics operations.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href="/dashboard/shipments"
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-medium hover:opacity-90 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> New Shipment
                            </Link>
                        </div>
                    </div>

                    <OverviewClient stats={stats} recentActivity={recentActivity} />
                </div>
            </main>
        </>
    );
}
