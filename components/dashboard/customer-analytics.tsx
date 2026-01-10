"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChartGradient } from "@/components/charts/area-chart-gradient";
import { BarChartHorizontal } from "@/components/charts/bar-chart-horizontal";
import { RadarChartPerformance } from "@/components/charts/radar-chart-performance";
import { cn } from "@/lib/utils";
import { Users, TrendingUp, DollarSign, Star, Award } from "lucide-react";

interface CustomerMetrics {
  totalCustomers: number;
  activeCustomers: number;
  newThisMonth: number;
  avgOrderValue: number;
  repeatRate: number;
}

interface TopCustomer {
  name: string;
  shipments: number;
  revenue: number;
}

interface CustomerAnalyticsProps {
  metrics: CustomerMetrics;
  topCustomers: TopCustomer[];
  shipmentsByMonth?: Array<{ date: string; count: number }>;
}

export function CustomerAnalytics({
  metrics,
  topCustomers,
  shipmentsByMonth = [],
}: CustomerAnalyticsProps) {
  const performanceData = [
    { metric: "Volume", value: Math.min(topCustomers[0]?.shipments || 0, 100) },
    { metric: "Revenue", value: Math.min((topCustomers[0]?.revenue || 0) / 1000, 100) },
    { metric: "Loyalty", value: metrics.repeatRate },
    { metric: "Growth", value: Math.min((metrics.newThisMonth / Math.max(metrics.totalCustomers, 1)) * 100, 100) },
    { metric: "Satisfaction", value: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Customer KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{metrics.totalCustomers}</div>
                <div className="text-xs text-muted-foreground">Total Customers</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-emerald-500">{metrics.activeCustomers}</div>
                <div className="text-xs text-muted-foreground">Active (30 days)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Star className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">+{metrics.newThisMonth}</div>
                <div className="text-xs text-muted-foreground">New This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <DollarSign className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-500">
                  ₹{(metrics.avgOrderValue / 1000).toFixed(1)}K
                </div>
                <div className="text-xs text-muted-foreground">Avg Order Value</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Award className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500">{metrics.repeatRate}%</div>
                <div className="text-xs text-muted-foreground">Repeat Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Activity Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Customer Activity</CardTitle>
            <CardDescription>Shipments by customer over time</CardDescription>
          </CardHeader>
          <CardContent>
            {shipmentsByMonth.length > 0 ? (
              <AreaChartGradient
                data={shipmentsByMonth.map(d => ({ date: d.date, value: d.count }))}
                dataKey="value"
                xAxisKey="date"
                color="hsl(var(--chart-1))"
                height={200}
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                No activity data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Performance Radar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Performance Score</CardTitle>
            <CardDescription>Key customer metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <RadarChartPerformance
              data={performanceData}
              color="hsl(var(--chart-2))"
              height={200}
            />
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Top Customers</CardTitle>
          <CardDescription>By shipment volume</CardDescription>
        </CardHeader>
        <CardContent>
          {topCustomers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BarChartHorizontal
                data={topCustomers.slice(0, 5).map((c, i) => ({
                  name: c.name.length > 20 ? c.name.slice(0, 20) + "..." : c.name,
                  value: c.shipments,
                  fill: `hsl(var(--chart-${(i % 5) + 1}))`,
                }))}
                height={200}
              />
              
              <div className="space-y-3">
                {topCustomers.slice(0, 5).map((customer, i) => (
                  <div
                    key={customer.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          i === 0 && "bg-amber-500",
                          i === 1 && "bg-slate-400",
                          i === 2 && "bg-amber-700",
                          i > 2 && "bg-muted-foreground"
                        )}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {customer.shipments} shipments
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-500">
                        ₹{(customer.revenue / 1000).toFixed(1)}K
                      </div>
                      <div className="text-xs text-muted-foreground">revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No customer data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
