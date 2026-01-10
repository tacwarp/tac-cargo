"use client";

import React from "react";
import {
    Package,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Scale,
    DollarSign,
} from "lucide-react";
import { MetricCardEnhanced } from "@/components/dashboard/metric-card-enhanced";
import { AnalyticsCharts } from "./analytics-charts";

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
    statusDistribution?: Array<{ name: string; value: number; fill: string }>;
    topCustomers?: Array<{ name: string; value: number }>;
}

interface AnalyticsClientProps {
    data: AnalyticsData;
}

export function AnalyticsClient({ data }: AnalyticsClientProps) {
    const { summary, charts } = data;

    const statusDistribution = data.statusDistribution || [
        { name: "Delivered", value: summary.deliveredCount, fill: "hsl(var(--chart-2))" },
        { name: "In Transit", value: Math.max(0, summary.totalShipments - summary.deliveredCount - summary.failedCount), fill: "hsl(var(--chart-3))" },
        { name: "Failed", value: summary.failedCount, fill: "hsl(var(--chart-5))" },
    ];

    const topCustomers = data.topCustomers || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-xl font-semibold text-foreground tracking-tight">Analytics</h1>
                    <p className="text-xs text-muted-foreground mt-1">Performance metrics and volume analysis (Last 30 days)</p>
                </div>
            </div>

            {/* Summary Stats - Enhanced Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <MetricCardEnhanced
                    title="Total Shipments"
                    value={summary.totalShipments.toLocaleString()}
                    icon={<Package className="w-5 h-5" />}
                    color="primary"
                    size="sm"
                />
                <MetricCardEnhanced
                    title="Delivered"
                    value={summary.deliveredCount.toLocaleString()}
                    icon={<CheckCircle className="w-5 h-5" />}
                    color="success"
                    size="sm"
                />
                <MetricCardEnhanced
                    title="Failed"
                    value={summary.failedCount.toLocaleString()}
                    icon={<AlertCircle className="w-5 h-5" />}
                    color={summary.failedCount > 0 ? "destructive" : "default"}
                    size="sm"
                />
                <MetricCardEnhanced
                    title="Delivery Rate"
                    value={`${summary.deliveryRate}%`}
                    icon={<TrendingUp className="w-5 h-5" />}
                    trend={summary.deliveryRate >= 90 ? "up" : summary.deliveryRate >= 70 ? "neutral" : "down"}
                    color={summary.deliveryRate >= 90 ? "success" : summary.deliveryRate >= 70 ? "warning" : "destructive"}
                    size="sm"
                />
                <MetricCardEnhanced
                    title="Total Weight"
                    value={`${(summary.totalWeight / 1000).toFixed(1)}T`}
                    icon={<Scale className="w-5 h-5" />}
                    color="primary"
                    size="sm"
                />
                <MetricCardEnhanced
                    title="Total Pieces"
                    value={summary.totalPieces.toLocaleString()}
                    icon={<Package className="w-5 h-5" />}
                    color="default"
                    size="sm"
                />
                <MetricCardEnhanced
                    title="Revenue"
                    value={`₹${(summary.totalRevenue / 1000).toFixed(1)}K`}
                    icon={<DollarSign className="w-5 h-5" />}
                    color="success"
                    size="sm"
                />
            </div>

            {/* Charts Section */}
            <AnalyticsCharts
                shipmentsByDate={charts.shipmentsByDate}
                revenueByDate={charts.revenueByDate}
                statusDistribution={statusDistribution}
                topCustomers={topCustomers}
                deliveryRate={summary.deliveryRate}
            />
        </div>
    );
}
