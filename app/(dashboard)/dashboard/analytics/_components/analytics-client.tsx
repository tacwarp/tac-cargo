"use client";

import React from "react";
import {
    Package,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Scale,
    DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassPanel } from "../../_components/glass-panel";

interface AnalyticsData {
    summary: {
        totalShipments: number;
        deliveredCount: number;
        failedCount: number;
        deliveryRate: number;
        totalWeight: number;
        totalPieces: number;
        totalRevenue: number;
    };
    charts: {
        shipmentsByDate: Array<{ date: string; count: number }>;
        revenueByDate: Array<{ date: string; amount: number }>;
    };
}

interface AnalyticsClientProps {
    data: AnalyticsData;
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
    const { summary, charts } = data;

    // Get max values for chart scaling
    const maxShipments = Math.max(...charts.shipmentsByDate.map(d => d.count), 1);
    const maxRevenue = Math.max(...charts.revenueByDate.map(d => d.amount), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-semibold text-foreground tracking-tight">Analytics</h1>
                    <p className="text-xs text-muted-foreground mt-1">Performance metrics and volume analysis (Last 30 days)</p>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <StatCard
                    label="Total Shipments"
                    value={summary.totalShipments}
                    icon={Package}
                    color="text-foreground"
                />
                <StatCard
                    label="Delivered"
                    value={summary.deliveredCount}
                    icon={CheckCircle}
                    color="text-success"
                />
                <StatCard
                    label="Failed"
                    value={summary.failedCount}
                    icon={AlertCircle}
                    color="text-destructive"
                    highlight={summary.failedCount > 0}
                />
                <StatCard
                    label="Delivery Rate"
                    value={`${summary.deliveryRate}%`}
                    icon={TrendingUp}
                    color={summary.deliveryRate >= 90 ? "text-primary" : summary.deliveryRate >= 70 ? "text-warning" : "text-destructive"}
                />
                <StatCard
                    label="Total Weight"
                    value={`${(summary.totalWeight / 1000).toFixed(1)}T`}
                    icon={Scale}
                    color="text-primary"
                />
                <StatCard
                    label="Total Pieces"
                    value={summary.totalPieces}
                    icon={Package}
                    color="text-primary"
                />
                <StatCard
                    label="Revenue"
                    value={`₹${(summary.totalRevenue / 1000).toFixed(1)}K`}
                    icon={DollarSign}
                    color="text-success"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Shipments Chart */}
                <GlassPanel className="p-6">
                    <h3 className="text-sm font-medium text-foreground mb-4">Shipments Volume</h3>
                    <div className="h-48 flex items-end gap-1">
                        {charts.shipmentsByDate.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                                No data available
                            </div>
                        ) : (
                            charts.shipmentsByDate.slice(-30).map((item, idx) => {
                                const height = (item.count / maxShipments) * 100;
                                return (
                                    <div
                                        key={idx}
                                        className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t group relative"
                                        style={{ height: `${Math.max(height, 2)}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-card border border-border px-2 py-1 rounded text-[10px] text-foreground whitespace-nowrap z-10">
                                            {item.count} shipments
                                            <br />
                                            {new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                        <span>30 days ago</span>
                        <span>Today</span>
                    </div>
                </GlassPanel>

                {/* Revenue Chart */}
                <GlassPanel className="p-6">
                    <h3 className="text-sm font-medium text-foreground mb-4">Revenue</h3>
                    <div className="h-48 flex items-end gap-1">
                        {charts.revenueByDate.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                                No data available
                            </div>
                        ) : (
                            charts.revenueByDate.slice(-30).map((item, idx) => {
                                const height = (item.amount / maxRevenue) * 100;
                                return (
                                    <div
                                        key={idx}
                                        className="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t group relative"
                                        style={{ height: `${Math.max(height, 2)}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-card border border-border px-2 py-1 rounded text-[10px] text-foreground whitespace-nowrap z-10">
                                            ₹{item.amount.toLocaleString("en-IN")}
                                            <br />
                                            {new Date(item.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                        <span>30 days ago</span>
                        <span>Today</span>
                    </div>
                </GlassPanel>
            </div>

            {/* Performance Metrics */}
            <GlassPanel className="p-6">
                <h3 className="text-sm font-medium text-foreground mb-4">Performance Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PerformanceMetric
                        label="Delivery Success Rate"
                        value={summary.deliveryRate}
                        target={95}
                        unit="%"
                    />
                    <PerformanceMetric
                        label="Avg Daily Shipments"
                        value={Math.round(summary.totalShipments / 30)}
                        target={10}
                        unit=""
                    />
                    <PerformanceMetric
                        label="Avg Daily Revenue"
                        value={Math.round(summary.totalRevenue / 30 / 1000)}
                        target={50}
                        unit="K"
                        prefix="₹"
                    />
                </div>
            </GlassPanel>
        </div>
    );
}

function StatCard({
    label,
    value,
    icon: Icon,
    color,
    highlight
}: {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    highlight?: boolean;
}) {
    return (
        <GlassPanel className={cn(
            "p-4",
            highlight && "border-destructive/30 bg-destructive/5"
        )}>
            <div className="flex items-center gap-2 mb-2">
                <Icon className={cn("w-4 h-4", color)} />
            </div>
            <div className={cn("text-xl font-bold", color)}>{value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{label}</div>
        </GlassPanel>
    );
}

function PerformanceMetric({
    label,
    value,
    target,
    unit,
    prefix = ""
}: {
    label: string;
    value: number;
    target: number;
    unit: string;
    prefix?: string;
}) {
    const percentage = Math.min((value / target) * 100, 100);
    const isGood = value >= target;

    return (
        <div>
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className={cn(
                    "text-lg font-bold",
                    isGood ? "text-success" : "text-warning"
                )}>
                    {prefix}{value}{unit}
                </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all",
                        isGood ? "bg-success" : "bg-warning"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>0</span>
                <span>Target: {prefix}{target}{unit}</span>
            </div>
        </div>
    );
}
