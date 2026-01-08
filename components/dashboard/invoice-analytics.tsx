"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  RiMoneyRupeeCircleLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiAlertLine,
} from "@remixicon/react";

interface InvoiceAnalyticsProps {
  data: {
    totalRevenue: number;
    outstanding: number;
    paidCount: number;
    overdueCount: number;
    monthlyData: Array<{ month: string; revenue: number }>;
  };
}

export function InvoiceAnalytics({ data }: InvoiceAnalyticsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(data.totalRevenue),
      icon: RiMoneyRupeeCircleLine,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Outstanding",
      value: formatCurrency(data.outstanding),
      icon: RiTimeLine,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Paid Invoices",
      value: data.paidCount.toString(),
      icon: RiCheckboxCircleLine,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Overdue",
      value: data.overdueCount.toString(),
      icon: RiAlertLine,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold tracking-tight ${stat.color}`}
              >
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.monthlyData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: "var(--foreground)" }}
                />
                <Bar
                  dataKey="revenue"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default InvoiceAnalytics;
