"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChartGradient } from "@/components/charts/area-chart-gradient";
import { BarChartHorizontal } from "@/components/charts/bar-chart-horizontal";
import { PieChartInteractive } from "@/components/charts/pie-chart-interactive";
import { RadialChartProgress } from "@/components/charts/radial-chart-progress";
import { LineChartMultiple } from "@/components/charts/line-chart-multiple";

interface AnalyticsChartsProps {
  shipmentsByDate: Array<{ date: string; count: number }>;
  revenueByDate: Array<{ date: string; amount: number }>;
  statusDistribution: Array<{ name: string; value: number; fill: string }>;
  topCustomers: Array<{ name: string; value: number }>;
  deliveryRate: number;
  summary: {
    totalShipments: number;
    deliveredCount: number;
    failedCount: number;
  };
}

export function AnalyticsCharts({
  shipmentsByDate,
  revenueByDate,
  statusDistribution,
  topCustomers,
  deliveryRate,
}: Omit<AnalyticsChartsProps, "summary">) {
  const shipmentsData = shipmentsByDate.map((d) => ({
    date: d.date,
    value: d.count,
  }));

  const revenueData = revenueByDate.map((d) => ({
    date: d.date,
    value: d.amount,
  }));

  const combinedTrendData = shipmentsByDate.map((s) => {
    const revenueItem = revenueByDate.find((r) => r.date === s.date);
    return {
      date: s.date,
      shipments: s.count,
      revenue: revenueItem ? revenueItem.amount / 1000 : 0,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Shipments Volume - Area Chart */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Shipments Volume</CardTitle>
          <CardDescription>Daily shipment count over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {shipmentsData.length > 0 ? (
            <AreaChartGradient
              data={shipmentsData}
              dataKey="value"
              xAxisKey="date"
              color="hsl(var(--chart-1))"
              height={200}
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delivery Success Rate - Radial Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Delivery Success</CardTitle>
          <CardDescription>Overall delivery success rate</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <RadialChartProgress
            value={deliveryRate}
            max={100}
            label="Delivered"
            sublabel="success rate"
            color={deliveryRate >= 90 ? "hsl(var(--chart-2))" : deliveryRate >= 70 ? "hsl(var(--chart-3))" : "hsl(var(--chart-5))"}
            size={180}
          />
        </CardContent>
      </Card>

      {/* Revenue Trend - Area Chart */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Revenue Trend</CardTitle>
          <CardDescription>Daily revenue over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length > 0 ? (
            <AreaChartGradient
              data={revenueData}
              dataKey="value"
              xAxisKey="date"
              color="hsl(var(--chart-2))"
              height={200}
              valueFormatter={(v) => `₹${(v / 1000).toFixed(1)}K`}
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Distribution - Pie Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Status Distribution</CardTitle>
          <CardDescription>Shipments by current status</CardDescription>
        </CardHeader>
        <CardContent>
          {statusDistribution.length > 0 ? (
            <PieChartInteractive
              data={statusDistribution}
              height={220}
              showLegend={false}
              innerRadius={50}
              outerRadius={80}
            />
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Combined Trend - Line Chart */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Performance Trend</CardTitle>
          <CardDescription>Shipments vs Revenue comparison</CardDescription>
        </CardHeader>
        <CardContent>
          {combinedTrendData.length > 0 ? (
            <LineChartMultiple
              data={combinedTrendData}
              lines={[
                { dataKey: "shipments", label: "Shipments", color: "hsl(var(--chart-1))" },
                { dataKey: "revenue", label: "Revenue (K)", color: "hsl(var(--chart-2))", dashed: true },
              ]}
              xAxisKey="date"
              height={200}
              showLegend={true}
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Customers - Horizontal Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Customers</CardTitle>
          <CardDescription>By shipment volume</CardDescription>
        </CardHeader>
        <CardContent>
          {topCustomers.length > 0 ? (
            <BarChartHorizontal
              data={topCustomers.slice(0, 5).map((c, i) => ({
                name: c.name.length > 15 ? c.name.slice(0, 15) + "..." : c.name,
                value: c.value,
                fill: `hsl(var(--chart-${(i % 5) + 1}))`,
              }))}
              height={200}
            />
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
