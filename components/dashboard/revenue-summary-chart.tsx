"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChartGradient } from "@/components/charts/area-chart-gradient";
import { PieChartInteractive } from "@/components/charts/pie-chart-interactive";
import { TrendingUp, DollarSign, CreditCard, Wallet, Banknote } from "lucide-react";

interface RevenueSummaryProps {
  totalReceived: number;
  totalOutstanding: number;
  overdueAmount?: number;
  revenueByDay?: Array<{ date: string; amount: number }>;
  paymentMethodBreakdown?: Array<{ name: string; value: number; fill: string }>;
}

export function RevenueSummaryChart({
  totalReceived,
  totalOutstanding,
  revenueByDay = [],
  paymentMethodBreakdown = [],
}: Omit<RevenueSummaryProps, "overdueAmount">) {
  const collectionRate = totalReceived + totalOutstanding > 0
    ? Math.round((totalReceived / (totalReceived + totalOutstanding)) * 100)
    : 0;

  const defaultPaymentMethods = paymentMethodBreakdown.length > 0 ? paymentMethodBreakdown : [
    { name: "UPI", value: 45, fill: "hsl(var(--chart-1))" },
    { name: "Cash", value: 30, fill: "hsl(var(--chart-2))" },
    { name: "Bank Transfer", value: 15, fill: "hsl(var(--chart-3))" },
    { name: "Card", value: 10, fill: "hsl(var(--chart-4))" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue KPIs */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" />
            Revenue Overview
          </CardTitle>
          <CardDescription>Collection performance and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-emerald-600 font-medium">Collected</span>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                ₹{(totalReceived / 1000).toFixed(1)}K
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-amber-600 font-medium">Outstanding</span>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                ₹{(totalOutstanding / 1000).toFixed(1)}K
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">Collection Rate</span>
              </div>
              <div className="text-2xl font-bold text-primary">
                {collectionRate}%
              </div>
            </div>
          </div>

          {revenueByDay.length > 0 ? (
            <AreaChartGradient
              data={revenueByDay.map(d => ({ date: d.date, value: d.amount }))}
              dataKey="value"
              xAxisKey="date"
              color="hsl(var(--chart-2))"
              height={180}
              valueFormatter={(v) => `₹${(v / 1000).toFixed(1)}K`}
            />
          ) : (
            <div className="h-[180px] flex items-center justify-center text-muted-foreground text-sm">
              <div className="text-center">
                <Banknote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No revenue data available</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Payment Methods</CardTitle>
          <CardDescription>Distribution by payment type</CardDescription>
        </CardHeader>
        <CardContent>
          <PieChartInteractive
            data={defaultPaymentMethods}
            height={200}
            showLegend={false}
            innerRadius={45}
            outerRadius={70}
            labelType="percent"
          />
          
          <div className="space-y-2 mt-4">
            {defaultPaymentMethods.map((method) => (
              <div key={method.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: method.fill }}
                  />
                  <span className="text-muted-foreground">{method.name}</span>
                </div>
                <span className="font-medium">{method.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
