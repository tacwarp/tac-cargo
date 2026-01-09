"use client";

import {
  BadgePercentIcon,
  ChartNoAxesCombinedIcon,
  CirclePercentIcon,
  DollarSignIcon,
  ShoppingBagIcon,
  TrendingUpIcon,
} from "lucide-react";

import { Bar, BarChart, Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

const salesPlanPercentage = 54;
const totalBars = 24;
const filledBars = Math.round((salesPlanPercentage * totalBars) / 100);

const salesChartData = Array.from({ length: totalBars }, (_, index) => {
  // Each bar represents a different day
  const date = new Date(2025, 5, 1 + index);

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return {
    date: formattedDate,
    sales: index < filledBars ? 315 : 0,
  };
});

const salesChartConfig = {
  sales: {
    label: "Sales",
  },
} satisfies ChartConfig;

const MetricsData = [
  {
    icon: <TrendingUpIcon className="size-5" />,
    title: "Revenue Trend",
    value: "₹11,54,800",
  },
  {
    icon: <BadgePercentIcon className="size-5" />,
    title: "Net Margin",
    value: "18.2%",
  },
  {
    icon: <DollarSignIcon className="size-5" />,
    title: "Net Profit",
    value: "₹17,35,600",
  },
  {
    icon: <ShoppingBagIcon className="size-5" />,
    title: "Total Bookings",
    value: "2,480",
  },
];

const revenueChartData = [
  { month: "january", sales: 340, fill: "var(--chart-1)" },
  { month: "february", sales: 200, fill: "var(--chart-2)" },
  { month: "march", sales: 200, fill: "var(--chart-4)" },
];

const revenueChartConfig = {
  sales: {
    label: "Revenue",
  },
  january: {
    label: "Air",
    color: "var(--chart-1)",
  },
  february: {
    label: "Surface",
    color: "var(--chart-2)",
  },
  march: {
    label: "Express",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const SalesMetricsCard = ({ className }: { className?: string }) => {
  return (
    <Card
      className={cn(
        "glass-card noise-overlay relative overflow-hidden border-none shadow-none",
        className,
      )}
    >
      <CardContent className="space-y-8 pt-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="flex flex-col gap-8 lg:col-span-3">
            <div className="flex flex-col gap-1">
              <span className="text-foreground text-xs font-bold tracking-[0.2em] uppercase">
                Revenue Metrics
              </span>
              <span className="text-muted-foreground text-[10px] font-medium uppercase opacity-60">
                Operational Efficiency Stats
              </span>
            </div>

            <div className="bg-card/80 border-border/60 flex items-center gap-4 rounded-lg border p-4">
              <div className="bg-secondary border-primary/30 text-primary shadow-primary/10 flex size-14 items-center justify-center rounded-md border shadow-lg">
                <ChartNoAxesCombinedIcon className="size-7" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-foreground text-sm font-black tracking-tighter uppercase">
                  TAC Cargo
                </span>
                <span className="text-muted-foreground/60 text-[11px] font-medium tracking-widest uppercase">
                  admin_control@sys.local
                </span>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {MetricsData.map((metric, index) => (
                <div
                  key={index}
                  className="border-border/40 bg-muted/40 hover:bg-primary/[0.05] hover:border-primary/30 group flex items-center gap-4 rounded-md border px-4 py-4 transition-all"
                >
                  <div className="bg-secondary/50 text-primary/60 group-hover:text-primary flex size-10 items-center justify-center rounded-md transition-colors">
                    {metric.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground/50 text-[9px] font-bold tracking-[0.2em] uppercase">
                      {metric.title}
                    </span>
                    <span className="text-kpi text-foreground text-lg font-bold">
                      {metric.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-card/80 border-border/40 noise-overlay gap-4 overflow-hidden border py-4 shadow-inner lg:col-span-2">
            <CardHeader className="gap-1 p-0 px-6 pb-2">
              <CardTitle className="text-muted-foreground/70 text-[10px] font-bold tracking-[0.2em] uppercase">
                Revenue Distribution
              </CardTitle>
            </CardHeader>

            <CardContent className="px-0">
              <ChartContainer
                config={revenueChartConfig}
                className="h-48 w-full"
              >
                <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        className="glass-intense noise-overlay border-white/10"
                      />
                    }
                  />
                  <Pie
                    data={revenueChartData}
                    dataKey="sales"
                    nameKey="month"
                    startAngle={300}
                    endAngle={660}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    stroke="none"
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) - 10}
                                className="fill-foreground text-kpi text-2xl font-black"
                              >
                                ₹25.6L
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground/50 text-[9px] font-black tracking-widest uppercase"
                              >
                                NET PROFIT
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>

            <CardFooter className="justify-between px-6">
              <span className="text-muted-foreground/60 text-[10px] font-bold tracking-widest uppercase">
                Target Variance
              </span>
              <span className="text-kpi text-success shadow-glow-primary/20 text-2xl font-black">
                +56%
              </span>
            </CardFooter>
          </Card>
        </div>

        <Card className="bg-muted/50 border-border/40 relative overflow-hidden rounded-lg border shadow-none">
          <div className="noise-overlay absolute inset-0 opacity-20" />
          <CardContent className="relative z-10 grid gap-8 p-8 lg:grid-cols-5">
            <div className="flex flex-col justify-center gap-4">
              <span className="text-muted-foreground/70 text-[10px] font-bold tracking-[0.2em] uppercase">
                Sales Plan
              </span>
              <span className="text-kpi text-primary text-6xl font-black drop-shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                {salesPlanPercentage}%
              </span>
              <span className="text-muted-foreground/40 text-[9px] leading-relaxed font-medium tracking-widest uppercase">
                Margin yield across aggregate volume
              </span>
            </div>
            <div className="flex flex-col gap-8 text-lg md:col-span-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-foreground mb-2 block text-xs font-bold tracking-widest uppercase">
                    Performance Indicators
                  </span>
                  <span className="text-muted-foreground/60 block max-w-lg text-[10px] leading-relaxed font-medium tracking-tighter uppercase">
                    Detailed analysis of regional shipment vectors and hub-level
                    revenue generation cycles.
                  </span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="group flex cursor-default items-center gap-4">
                  <div className="bg-secondary border-border/30 text-accent/60 group-hover:text-accent rounded-md border p-2 transition-colors">
                    <ChartNoAxesCombinedIcon className="size-4" />
                  </div>
                  <span className="text-muted-foreground/80 group-hover:text-foreground text-[10px] font-bold tracking-widest uppercase transition-colors">
                    Volume Analytics
                  </span>
                </div>
                <div className="group flex cursor-default items-center gap-4">
                  <div className="bg-secondary border-border/30 text-success/60 group-hover:text-success rounded-md border p-2 transition-colors">
                    <CirclePercentIcon className="size-4" />
                  </div>
                  <span className="text-muted-foreground/80 group-hover:text-foreground text-[10px] font-bold tracking-widest uppercase transition-colors">
                    Growth Trajectory
                  </span>
                </div>
              </div>

              <ChartContainer
                config={salesChartConfig}
                className="mt-auto h-12 w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={salesChartData}
                  margin={{
                    left: 0,
                    right: 0,
                  }}
                  maxBarSize={6}
                >
                  <Bar
                    dataKey="sales"
                    fill="var(--primary)"
                    background={{ fill: "hsl(var(--muted))", radius: 2 }}
                    radius={2}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default SalesMetricsCard;
