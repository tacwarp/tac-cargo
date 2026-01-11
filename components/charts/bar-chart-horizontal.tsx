"use client";

import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface BarChartHorizontalProps {
  data: Array<{ name: string; value: number; fill?: string }>;
  dataKey?: string;
  nameKey?: string;
  color?: string;
  height?: number;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export function BarChartHorizontal({
  data,
  dataKey = "value",
  nameKey = "name",
  color = "hsl(var(--chart-1))",
  height = 200,
  valueFormatter = (v) => v.toLocaleString(),
}: BarChartHorizontalProps) {
  const chartConfig = {
    [dataKey]: {
      label: "Value",
      color,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className={`h-[${height}px] w-full`}>
      <BarChart
        accessibilityLayer
        data={data}
        layout="vertical"
        margin={{ left: 0, right: 20, top: 0, bottom: 0 }}
      >
        <YAxis
          dataKey={nameKey}
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={100}
          className="text-[10px] fill-muted-foreground"
        />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={valueFormatter}
          className="text-[10px] fill-muted-foreground"
        />
        <ChartTooltip
          cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
