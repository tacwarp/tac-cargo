"use client";

import React from "react";
import Link from "next/link";
import {
    Package,
    Truck,
    AlertCircle,
    DollarSign,
    Clock,
    ArrowUpRight,
    Activity,
    CheckCircle,
    MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "./glass-panel";
import { StatusPipeline } from "@/components/dashboard/status-pipeline";
import type { ShipmentStatus } from "@/types/database";

interface DashboardStats {
    shipments: {
        total: number;
        pending: number;
        inTransit: number;
        delivered: number;
        failed: number;
        today: number;
        delayed: number;
    };
    finance: {
        revenue: number;
        outstanding: number;
    };
    operations: {
        activeManifests: number;
    };
}

interface RecentActivity {
    id: string;
    reference: string;
    status: ShipmentStatus;
    consignee_name: string | null;
    updated_at: string;
}

interface OverviewClientProps {
    stats: DashboardStats;
    recentActivity: RecentActivity[];
}


const statusConfig: Record<ShipmentStatus, { label: string; color: string }> = {
    booked: { label: "Booked", color: "text-muted-foreground" },
    picked_up: { label: "Picked Up", color: "text-primary" },
    at_origin_hub: { label: "At Origin Hub", color: "text-primary" },
    in_transit: { label: "In Transit", color: "text-primary" },
    at_destination_hub: { label: "At Destination Hub", color: "text-primary" },
    out_for_delivery: { label: "Out for Delivery", color: "text-warning" },
    delivered: { label: "Delivered", color: "text-success" },
    exception: { label: "Exception", color: "text-destructive" },
    returned: { label: "Returned", color: "text-warning" },
    cancelled: { label: "Cancelled", color: "text-muted-foreground" },
};

export function OverviewClient({ stats, recentActivity }: OverviewClientProps) {
    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Total Shipments"
                    value={stats.shipments.total}
                    subtitle={`${stats.shipments.today} today`}
                    icon={Package}
                    color="text-foreground"
                    href="/dashboard/shipments"
                />
                <StatCard
                    title="In Transit"
                    value={stats.shipments.inTransit}
                    subtitle={stats.shipments.delayed > 0 ? `${stats.shipments.delayed} delayed` : "On schedule"}
                    icon={Truck}
                    color="text-primary"
                    highlight={stats.shipments.delayed > 0}
                    href="/dashboard/tracking"
                />
                <StatCard
                    title="Revenue"
                    value={`₹${(stats.finance.revenue / 1000).toFixed(1)}K`}
                    subtitle={`₹${(stats.finance.outstanding / 1000).toFixed(1)}K outstanding`}
                    icon={DollarSign}
                    color="text-success"
                    href="/dashboard/payments"
                />
                <StatCard
                    title="Active Manifests"
                    value={stats.operations.activeManifests}
                    subtitle="Open & dispatched"
                    icon={Activity}
                    color="text-warning"
                    href="/dashboard/manifests"
                />
            </div>

            {/* Status Pipeline */}
            <GlassPanel className="p-4">
                <h3 className="text-sm font-medium text-foreground mb-4">Shipment Pipeline</h3>
                <StatusPipeline
                    stages={[
                        { id: "pending", label: "Pending", count: stats.shipments.pending, icon: Clock, color: "text-slate-500 bg-slate-500/10" },
                        { id: "in_transit", label: "In Transit", count: stats.shipments.inTransit, icon: Truck, color: "text-amber-500 bg-amber-500/10" },
                        { id: "out_for_delivery", label: "Out for Delivery", count: 0, icon: MapPin, color: "text-purple-500 bg-purple-500/10" },
                        { id: "delivered", label: "Delivered", count: stats.shipments.delivered, icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
                        { id: "failed", label: "Failed", count: stats.shipments.failed, icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
                    ]}
                />
            </GlassPanel>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <GlassPanel className="lg:col-span-2 p-0">
                    <div className="p-4 border-b border-border flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">Recent Activity</h3>
                        <Link href="/dashboard/shipments" className="text-xs text-primary hover:text-primary/80">
                            View all
                        </Link>
                    </div>
                    <div className="divide-y divide-border">
                        {recentActivity.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">No recent activity</div>
                        ) : (
                            recentActivity.map((item) => {
                                const status = statusConfig[item.status] || statusConfig.booked;
                                return (
                                    <Link
                                        key={item.id}
                                        href={`/dashboard/tracking`}
                                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", status.color.replace("text-", "bg-"))} />
                                            <div>
                                                <div className="font-mono text-sm text-foreground">{item.reference}</div>
                                                <div className="text-xs text-muted-foreground">{item.consignee_name || "—"}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={cn("text-xs", status.color)}>{status.label}</div>
                                            <div className="text-[10px] text-muted-foreground">
                                                {new Date(item.updated_at).toLocaleTimeString("en-IN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                </GlassPanel>

                {/* Quick Actions */}
                <GlassPanel className="p-4">
                    <h3 className="text-sm font-medium text-foreground mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <QuickActionLink href="/dashboard/shipments" label="Create Shipment" icon={Package} />
                        <QuickActionLink href="/dashboard/manifests" label="New Manifest" icon={Truck} />
                        <QuickActionLink href="/dashboard/scanning" label="Scan Barcode" icon={Activity} />
                        <QuickActionLink href="/dashboard/invoices" label="Generate Invoice" icon={DollarSign} />
                        <QuickActionLink href="/dashboard/tracking" label="Track Shipment" icon={Clock} />
                        <QuickActionLink href="/dashboard/exceptions" label="View Exceptions" icon={AlertCircle} />
                    </div>
                </GlassPanel>
            </div>

            {/* Alerts Section */}
            {(stats.shipments.delayed > 0 || stats.shipments.failed > 0) && (
                <GlassPanel className="p-4 border-warning/30 bg-warning/5">
                    <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="w-5 h-5 text-warning" />
                        <h3 className="text-sm font-medium text-foreground">Attention Required</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                        {stats.shipments.delayed > 0 && (
                            <div className="flex items-center justify-between text-foreground">
                                <span>{stats.shipments.delayed} shipments delayed</span>
                                <Link href="/dashboard/tracking" className="text-warning text-xs hover:underline">
                                    View →
                                </Link>
                            </div>
                        )}
                        {stats.shipments.failed > 0 && (
                            <div className="flex items-center justify-between text-foreground">
                                <span>{stats.shipments.failed} failed deliveries</span>
                                <Link href="/dashboard/exceptions" className="text-warning text-xs hover:underline">
                                    View →
                                </Link>
                            </div>
                        )}
                    </div>
                </GlassPanel>
            )}
        </div>
    );
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    highlight,
    href
}: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    highlight?: boolean;
    href: string;
}) {
    return (
        <Link href={href}>
            <GlassPanel className={cn(
                "p-5 hover:border-primary/40 transition-all cursor-pointer group shadow-lg shadow-black/5",
                highlight && "border-warning/30 bg-warning/5"
            )}>
                <div className="flex items-start justify-between mb-3">
                    <div className={cn("p-2.5 rounded-xl transition-colors",
                        highlight ? "bg-warning/20" : "bg-muted group-hover:bg-primary/10"
                    )}>
                        <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", color)} />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className={cn("text-2xl font-bold mb-1 tracking-tight", color)}>{value}</div>
                <div className="text-xs font-medium text-foreground/70">{title}</div>
                <div className="text-[10px] text-muted-foreground mt-1 font-mono uppercase tracking-wider">{subtitle}</div>
            </GlassPanel>
        </Link>
    );
}

function QuickActionLink({
    href,
    label,
    icon: Icon
}: {
    href: string;
    label: string;
    icon: React.ElementType;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
        >
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/20 transition-colors">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
        </Link>
    );
}
