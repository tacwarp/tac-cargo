"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const chartData = [
  { date: "2024-12-01", shipments: 186, delivered: 165 },
  { date: "2024-12-02", shipments: 205, delivered: 189 },
  { date: "2024-12-03", shipments: 237, delivered: 221 },
  { date: "2024-12-04", shipments: 273, delivered: 250 },
  { date: "2024-12-05", shipments: 209, delivered: 198 },
  { date: "2024-12-06", shipments: 214, delivered: 205 },
  { date: "2024-12-07", shipments: 198, delivered: 187 },
  { date: "2024-12-08", shipments: 245, delivered: 230 },
  { date: "2024-12-09", shipments: 289, delivered: 275 },
  { date: "2024-12-10", shipments: 312, delivered: 298 },
  { date: "2024-12-11", shipments: 278, delivered: 265 },
  { date: "2024-12-12", shipments: 342, delivered: 320 },
  { date: "2024-12-13", shipments: 367, delivered: 348 },
  { date: "2024-12-14", shipments: 298, delivered: 285 },
  { date: "2024-12-15", shipments: 256, delivered: 245 },
  { date: "2024-12-16", shipments: 289, delivered: 275 },
  { date: "2024-12-17", shipments: 334, delivered: 318 },
  { date: "2024-12-18", shipments: 378, delivered: 362 },
  { date: "2024-12-19", shipments: 412, delivered: 395 },
  { date: "2024-12-20", shipments: 389, delivered: 372 },
  { date: "2024-12-21", shipments: 356, delivered: 340 },
  { date: "2024-12-22", shipments: 298, delivered: 285 },
  { date: "2024-12-23", shipments: 267, delivered: 255 },
  { date: "2024-12-24", shipments: 189, delivered: 178 },
  { date: "2024-12-25", shipments: 145, delivered: 138 },
  { date: "2024-12-26", shipments: 234, delivered: 220 },
  { date: "2024-12-27", shipments: 312, delivered: 298 },
  { date: "2024-12-28", shipments: 378, delivered: 360 },
  { date: "2024-12-29", shipments: 423, delivered: 405 },
  { date: "2024-12-30", shipments: 456, delivered: 438 },
];

const chartConfig = {
  shipments: {
    label: "Shipments",
    color: "var(--chart-1)",
  },
  delivered: {
    label: "Delivered",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ShipmentTrendsChartProps {
  className?: string;
}

export function ShipmentTrendsChart({ className }: ShipmentTrendsChartProps) {
  const [timeRange, setTimeRange] = React.useState("30d");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredData = React.useMemo(() => {
    // Use current date instead of hardcoded reference date
    const referenceDate = new Date();
    let daysToSubtract = 30;
    if (timeRange === "7d") {
      daysToSubtract = 7;
    } else if (timeRange === "14d") {
      daysToSubtract = 14;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [timeRange]);

  if (!mounted) {
    return (
      <Card
        className={cn(
          "depth-surface noise-overlay overflow-hidden border-none",
          className,
        )}
      >
        <CardHeader className="border-border/30 flex items-center gap-2 space-y-0 border-b px-6 py-4 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-1 h-3 w-48" />
          </div>
          <Skeleton className="h-8 w-[130px]" />
        </CardHeader>
        <CardContent className="px-4 pt-6 pb-4 sm:px-6">
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "depth-surface noise-overlay overflow-hidden border-none",
        className,
      )}
    >
      <CardHeader className="border-border/30 flex items-center gap-2 space-y-0 border-b px-6 py-4 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <h3 className="text-foreground text-xs font-bold tracking-[0.2em] uppercase">
            Shipment Trends
          </h3>
          <p className="text-muted-foreground/60 text-[10px] font-medium tracking-wide uppercase">
            Volume analysis for the selected period
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="bg-muted/50 border-border/40 h-8 w-[130px] text-[10px] font-bold tracking-wide uppercase"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="glass-intense border-border/40">
            <SelectItem value="7d" className="text-xs">
              Last 7 days
            </SelectItem>
            <SelectItem value="14d" className="text-xs">
              Last 14 days
            </SelectItem>
            <SelectItem value="30d" className="text-xs">
              Last 30 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-4 pt-6 pb-4 sm:px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart data={filteredData} margin={{ left: 0, right: 0 }}>
            <defs>
              <linearGradient id="fillShipments" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-shipments)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-shipments)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <linearGradient id="fillDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-delivered)"
                  stopOpacity={0.6}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-delivered)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
              strokeOpacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              tick={{
                fontSize: 10,
                fill: "var(--muted-foreground)",
                opacity: 0.6,
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
              cursor={{
                stroke: "var(--primary)",
                strokeWidth: 1,
                strokeOpacity: 0.3,
              }}
              content={
                <ChartTooltipContent
                  className="glass-intense border-border/40 noise-overlay"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="delivered"
              type="monotone"
              fill="url(#fillDelivered)"
              stroke="var(--color-delivered)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="shipments"
              type="monotone"
              fill="url(#fillShipments)"
              stroke="var(--color-shipments)"
              strokeWidth={2}
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
