"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface RadarChartPerformanceProps {
  data: Array<{ metric: string; value: number; fullMark?: number }>;
  color?: string;
  fillOpacity?: number;
  height?: number;
}

export function RadarChartPerformance({
  data,
  color = "hsl(var(--chart-1))",
  fillOpacity = 0.3,
  height = 250,
}: RadarChartPerformanceProps) {
  const chartConfig = {
    value: {
      label: "Performance",
      color,
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className={`mx-auto h-[${height}px] w-full`}>
      <RadarChart data={data}>
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <PolarAngleAxis
          dataKey="metric"
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
        />
        <PolarGrid className="stroke-muted" />
        <Radar
          dataKey="value"
          fill={color}
          fillOpacity={fillOpacity}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3, fill: color }}
        />
      </RadarChart>
    </ChartContainer>
  );
}
