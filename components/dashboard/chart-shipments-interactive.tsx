"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { IconTrendingUp } from "@tabler/icons-react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

interface ShipmentDataPoint {
  date: string;
  shipments: number;
  delivered: number;
}

interface ChartShipmentsInteractiveProps {
  data?: ShipmentDataPoint[];
  title?: string;
  description?: string;
}

const chartConfig = {
  shipments: {
    label: "Total Shipments",
    color: "var(--primary)",
  },
  delivered: {
    label: "Delivered",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Generate sample data for demo
function generateSampleData(): ShipmentDataPoint[] {
  const data: ShipmentDataPoint[] = [];
  const now = new Date();
  
  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const baseShipments = 50 + Math.floor(Math.random() * 100);
    const delivered = Math.floor(baseShipments * (0.7 + Math.random() * 0.25));
    
    data.push({
      date: date.toISOString().split("T")[0],
      shipments: baseShipments,
      delivered: delivered,
    });
  }
  
  return data;
}

export function ChartShipmentsInteractive({
  data,
  title = "Shipment Activity",
  description = "Daily shipment volume and delivery metrics",
}: ChartShipmentsInteractiveProps) {
  const [timeRange, setTimeRange] = React.useState("30d");
  const chartData = React.useMemo(() => data || generateSampleData(), [data]);

  const filteredData = React.useMemo(() => {
    const now = new Date();
    let daysToSubtract = 30;
    
    if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    
    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [chartData, timeRange]);

  const totals = React.useMemo(() => {
    const totalShipments = filteredData.reduce((sum, d) => sum + d.shipments, 0);
    const totalDelivered = filteredData.reduce((sum, d) => sum + d.delivered, 0);
    const deliveryRate = totalShipments > 0 
      ? Math.round((totalDelivered / totalShipments) * 100) 
      : 0;
    
    return { totalShipments, totalDelivered, deliveryRate };
  }, [filteredData]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{description}</span>
          <span className="@[540px]/card:hidden">Shipment metrics</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(v: string) => v && setTimeRange(v)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-3 @[600px]/card:flex"
          >
            <ToggleGroupItem value="90d" className="text-xs">90 days</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="text-xs">30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d" className="text-xs">7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-32 @[600px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">90 days</SelectItem>
              <SelectItem value="30d" className="rounded-lg">30 days</SelectItem>
              <SelectItem value="7d" className="rounded-lg">7 days</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="flex items-center gap-4 mb-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">{totals.totalShipments.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">shipments</span>
          </div>
          <Badge variant="outline" className="gap-1">
            <IconTrendingUp className="size-3" />
            {totals.deliveryRate}% delivered
          </Badge>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillShipments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-shipments)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-shipments)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-delivered)" stopOpacity={0.6} />
                <stop offset="95%" stopColor="var(--color-delivered)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
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
              type="natural"
              fill="url(#fillDelivered)"
              stroke="var(--color-delivered)"
              stackId="a"
            />
            <Area
              dataKey="shipments"
              type="natural"
              fill="url(#fillShipments)"
              stroke="var(--color-shipments)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
