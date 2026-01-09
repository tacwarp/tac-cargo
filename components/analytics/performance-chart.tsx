"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Data mapped to Revenue (desktop) and Expenses (mobile) concept
const chartData = [
  { date: "Oct 12", revenue: 280, expenses: 250 },
  { date: "Oct 15", revenue: 180, expenses: 240 },
  { date: "Oct 18", revenue: 120, expenses: 260 },
  { date: "Oct 21", revenue: 290, expenses: 210 },
  { date: "Oct 24", revenue: 270, expenses: 230 },
  { date: "Oct 27", revenue: 240, expenses: 220 },
  { date: "Oct 30", revenue: 310, expenses: 210 },
  { date: "Nov 02", revenue: 260, expenses: 190 },
  { date: "Nov 05", revenue: 150, expenses: 200 },
  { date: "Nov 08", revenue: 250, expenses: 210 },
  { date: "Nov 11", revenue: 300, expenses: 210 },
  { date: "Nov 14", revenue: 280, expenses: 240 },
  { date: "Nov 17", revenue: 320, expenses: 260 },
];

const chartConfig = {
  views: {
    label: "Total Value",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-2)", // Using chart-2 for Revenue
  },
  expenses: {
    label: "Expenses",
    color: "var(--chart-1)", // Using chart-1 for Expenses (Operational Costs)
  },
} satisfies ChartConfig;

export function PerformanceChart() {
  const [activeChart, setActiveChart] =
    React.useState<"revenue" | "expenses">("revenue");

  const total = React.useMemo(
    () => ({
      revenue: chartData.reduce((acc, curr) => acc + curr.revenue, 0),
      expenses: chartData.reduce((acc, curr) => acc + curr.expenses, 0),
    }),
    [],
  );

  return (
    <div className="bg-card/50 overflow-hidden rounded-[32px] border border-border shadow-2xl backdrop-blur-xl text-card-foreground">
      <div className="flex flex-col items-stretch border-b border-border sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-6 pb-4 sm:py-6">
          <CardTitle className="font-display text-lg tracking-tight text-foreground">
            Performance Overview
          </CardTitle>
          <CardDescription className="text-muted-foreground/60 text-xs font-bold tracking-wider uppercase">
            Operational costs vs Revenue
          </CardDescription>
        </div>
        <div className="flex">
          {["revenue", "expenses"].map((key) => {
            const chart = key as "revenue" | "expenses";
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="group relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-border px-6 py-4 text-left transition-colors even:border-l hover:bg-muted/50 data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase transition-colors group-hover:text-foreground">
                  {chartConfig[chart].label}
                </span>
                <span className="font-mono text-xl font-bold text-foreground sm:text-2xl">
                  ${total[key as keyof typeof total].toLocaleString()}
                </span>
                {/* Active Indicator Line */}
                {activeChart === chart && (
                  <div className="bg-primary absolute top-0 right-0 left-0 h-[2px] shadow-[0_0_10px_var(--primary)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="px-2 pt-6 pb-6 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartConfig[activeChart].color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor={chartConfig[activeChart].color}
                  stopOpacity={0.3}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 10,
                fontFamily: "monospace",
              }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] border-border bg-card/95 text-foreground backdrop-blur-xl"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              fill="url(#barGradient)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
