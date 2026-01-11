"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface LineChartMultipleProps {
  data: Array<Record<string, string | number>>;
  lines: Array<{
    dataKey: string;
    label: string;
    color: string;
    dashed?: boolean;
  }>;
  xAxisKey?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  valueFormatter?: (value: number) => string;
}

export function LineChartMultiple({
  data,
  lines,
  xAxisKey = "date",
  height = 200,
  showLegend = true,
  showGrid = true,
  valueFormatter = (v) => v.toLocaleString(),
}: LineChartMultipleProps) {
  const chartConfig = lines.reduce((acc, line) => {
    acc[line.dataKey] = {
      label: line.label,
      color: line.color,
    };
    return acc;
  }, {} as ChartConfig);

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <LineChart
        accessibilityLayer
        data={data}
        margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
      >
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
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={valueFormatter}
          className="text-[10px] fill-muted-foreground"
        />
        <ChartTooltip
          cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
          content={<ChartTooltipContent indicator="line" />}
        />
        {showLegend && <ChartLegend content={<ChartLegendContent />} />}
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            dataKey={line.dataKey}
            type="monotone"
            stroke={line.color}
            strokeWidth={2}
            strokeDasharray={line.dashed ? "5 5" : undefined}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}
