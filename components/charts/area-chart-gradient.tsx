"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface AreaChartGradientProps {
  data: Array<{ date: string; value: number; label?: string }>;
  dataKey?: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showYAxis?: boolean;
  valueFormatter?: (value: number) => string;
}

export function AreaChartGradient({
  data,
  dataKey = "value",
  xAxisKey = "date",
  color = "hsl(var(--chart-1))",
  height = 200,
  showGrid = true,
  showYAxis = false,
  valueFormatter = (v) => v.toLocaleString(),
}: AreaChartGradientProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey.charAt(0).toUpperCase() + dataKey.slice(1),
      color,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
      >
        <defs>
          <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        {showGrid && <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />}
        <XAxis
          dataKey={xAxisKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => {
            if (typeof value === "string" && value.includes("-")) {
              const date = new Date(value);
              return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
            }
            return value;
          }}
          className="text-[10px] fill-muted-foreground"
        />
        {showYAxis && (
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={valueFormatter}
            className="text-[10px] fill-muted-foreground"
          />
        )}
        <ChartTooltip
          cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
          content={
            <ChartTooltipContent
              indicator="line"
              formatter={(value) => valueFormatter(Number(value))}
            />
          }
        />
        <Area
          dataKey={dataKey}
          type="monotone"
          fill={`url(#fill-${dataKey})`}
          stroke={color}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
