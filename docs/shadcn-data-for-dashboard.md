here is the entire shadcn ui compone data that we will be using in refactoring our entire dashboard, the dashboard need to be extremely consistent and we can also explore shadcnui npx shadcn@latest add dashboard-01 and charts: "use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
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
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
and "use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
  { date: "2024-04-09", desktop: 59, mobile: 110 },
  { date: "2024-04-10", desktop: 261, mobile: 190 },
  { date: "2024-04-11", desktop: 327, mobile: 350 },
  { date: "2024-04-12", desktop: 292, mobile: 210 },
  { date: "2024-04-13", desktop: 342, mobile: 380 },
  { date: "2024-04-14", desktop: 137, mobile: 220 },
  { date: "2024-04-15", desktop: 120, mobile: 170 },
  { date: "2024-04-16", desktop: 138, mobile: 190 },
  { date: "2024-04-17", desktop: 446, mobile: 360 },
  { date: "2024-04-18", desktop: 364, mobile: 410 },
  { date: "2024-04-19", desktop: 243, mobile: 180 },
  { date: "2024-04-20", desktop: 89, mobile: 150 },
  { date: "2024-04-21", desktop: 137, mobile: 200 },
  { date: "2024-04-22", desktop: 224, mobile: 170 },
  { date: "2024-04-23", desktop: 138, mobile: 230 },
  { date: "2024-04-24", desktop: 387, mobile: 290 },
  { date: "2024-04-25", desktop: 215, mobile: 250 },
  { date: "2024-04-26", desktop: 75, mobile: 130 },
  { date: "2024-04-27", desktop: 383, mobile: 420 },
  { date: "2024-04-28", desktop: 122, mobile: 180 },
  { date: "2024-04-29", desktop: 315, mobile: 240 },
  { date: "2024-04-30", desktop: 454, mobile: 380 },
  { date: "2024-05-01", desktop: 165, mobile: 220 },
  { date: "2024-05-02", desktop: 293, mobile: 310 },
  { date: "2024-05-03", desktop: 247, mobile: 190 },
  { date: "2024-05-04", desktop: 385, mobile: 420 },
  { date: "2024-05-05", desktop: 481, mobile: 390 },
  { date: "2024-05-06", desktop: 498, mobile: 520 },
  { date: "2024-05-07", desktop: 388, mobile: 300 },
  { date: "2024-05-08", desktop: 149, mobile: 210 },
  { date: "2024-05-09", desktop: 227, mobile: 180 },
  { date: "2024-05-10", desktop: 293, mobile: 330 },
  { date: "2024-05-11", desktop: 335, mobile: 270 },
  { date: "2024-05-12", desktop: 197, mobile: 240 },
  { date: "2024-05-13", desktop: 197, mobile: 160 },
  { date: "2024-05-14", desktop: 448, mobile: 490 },
  { date: "2024-05-15", desktop: 473, mobile: 380 },
  { date: "2024-05-16", desktop: 338, mobile: 400 },
  { date: "2024-05-17", desktop: 499, mobile: 420 },
  { date: "2024-05-18", desktop: 315, mobile: 350 },
  { date: "2024-05-19", desktop: 235, mobile: 180 },
  { date: "2024-05-20", desktop: 177, mobile: 230 },
  { date: "2024-05-21", desktop: 82, mobile: 140 },
  { date: "2024-05-22", desktop: 81, mobile: 120 },
  { date: "2024-05-23", desktop: 252, mobile: 290 },
  { date: "2024-05-24", desktop: 294, mobile: 220 },
  { date: "2024-05-25", desktop: 201, mobile: 250 },
  { date: "2024-05-26", desktop: 213, mobile: 170 },
  { date: "2024-05-27", desktop: 420, mobile: 460 },
  { date: "2024-05-28", desktop: 233, mobile: 190 },
  { date: "2024-05-29", desktop: 78, mobile: 130 },
  { date: "2024-05-30", desktop: 340, mobile: 280 },
  { date: "2024-05-31", desktop: 178, mobile: 230 },
  { date: "2024-06-01", desktop: 178, mobile: 200 },
  { date: "2024-06-02", desktop: 470, mobile: 410 },
  { date: "2024-06-03", desktop: 103, mobile: 160 },
  { date: "2024-06-04", desktop: 439, mobile: 380 },
  { date: "2024-06-05", desktop: 88, mobile: 140 },
  { date: "2024-06-06", desktop: 294, mobile: 250 },
  { date: "2024-06-07", desktop: 323, mobile: 370 },
  { date: "2024-06-08", desktop: 385, mobile: 320 },
  { date: "2024-06-09", desktop: 438, mobile: 480 },
  { date: "2024-06-10", desktop: 155, mobile: 200 },
  { date: "2024-06-11", desktop: 92, mobile: 150 },
  { date: "2024-06-12", desktop: 492, mobile: 420 },
  { date: "2024-06-13", desktop: 81, mobile: 130 },
  { date: "2024-06-14", desktop: 426, mobile: 380 },
  { date: "2024-06-15", desktop: 307, mobile: 350 },
  { date: "2024-06-16", desktop: 371, mobile: 310 },
  { date: "2024-06-17", desktop: 475, mobile: 520 },
  { date: "2024-06-18", desktop: 107, mobile: 170 },
  { date: "2024-06-19", desktop: 341, mobile: 290 },
  { date: "2024-06-20", desktop: 408, mobile: 450 },
  { date: "2024-06-21", desktop: 169, mobile: 210 },
  { date: "2024-06-22", desktop: 317, mobile: 270 },
  { date: "2024-06-23", desktop: 480, mobile: 530 },
  { date: "2024-06-24", desktop: 132, mobile: 180 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-27", desktop: 448, mobile: 490 },
  { date: "2024-06-28", desktop: 149, mobile: 200 },
  { date: "2024-06-29", desktop: 103, mobile: 160 },
  { date: "2024-06-30", desktop: 446, mobile: 400 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function ChartBarInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop")

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["desktop", "mobile"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={var(--color-${activeChart})} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
and "use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart with a custom label"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig

export function ChartBarLabelCustom() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Custom Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="desktop" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="desktop"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="desktop"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
and "use client"

import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A pie chart with a label list"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartPieLabelList() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Pie Chart - Label List</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={chartData} dataKey="visitors">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
and "use client"

import { TrendingUp } from "lucide-react"
import { PolarGrid, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A radial chart with a grid"

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function ChartRadialGrid() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Grid</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="visitors" />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
and "use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A stacked bar chart with a legend"
export const iframeHeight = "600px"
export const containerClassName =
  "[&>div]:w-full [&>div]:max-w-md flex items-center justify-center min-h-svh"

const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  { date: "2024-07-17", running: 520, swimming: 120 },
  { date: "2024-07-18", running: 140, swimming: 550 },
  { date: "2024-07-19", running: 600, swimming: 350 },
  { date: "2024-07-20", running: 480, swimming: 400 },
]

const chartConfig = {
  running: {
    label: "Running",
    color: "var(--chart-1)",
  },
  swimming: {
    label: "Swimming",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartTooltipIndicatorLine() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tooltip - Line Indicator</CardTitle>
        <CardDescription>Tooltip with line indicator.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
            />
            <Bar
              dataKey="running"
              stackId="a"
              fill="var(--color-running)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill="var(--color-swimming)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
and ---
title: Alert Dialog
description: A modal dialog that interrupts the user with important content and expects a response.
featured: true
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/alert-dialog
  api: https://www.radix-ui.com/docs/primitives/components/alert-dialog#api-reference
---

<ComponentPreview
  name="alert-dialog-demo"
  title="An alert dialog with cancel and continue buttons."
  description="An alert dialog with cancel and continue buttons."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add alert-dialog
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-alert-dialog
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="alert-dialog" title="components/ui/alert-dialog.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
```

```tsx showLineNumbers
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
and ---
title: Accordion
description: A vertically stacked set of interactive headings that each reveal a section of content.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/accordion
  api: https://www.radix-ui.com/docs/primitives/components/accordion#api-reference
---

<ComponentPreview
  name="accordion-demo"
  className="[&_.preview>[data-orientation=vertical]]:sm:max-w-[80%] **:[.preview]:min-h-[400px]"
  description="An accordion with three items"
  align="start"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>

<TabsContent value="cli">

```bash
npx shadcn@latest add accordion
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-accordion
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="accordion" title="components/ui/accordion.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
```

```tsx showLineNumbers
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```
and ---
title: Alert
description: Displays a callout for user attention.
component: true
---

<ComponentPreview
  name="alert-demo"
  title="An alert with an icon, title and description."
  description="An alert with an icon, title and description. The title says 'Heads up!' and the description is 'You can add components to your app using the cli.'."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add alert
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="alert" title="components/ui/alert.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
```

```tsx showLineNumbers
<Alert variant="default | destructive">
  <Terminal />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components and dependencies to your app using the cli.
  </AlertDescription>
</Alert>
```
and ---
title: Aspect Ratio
description: Displays content within a desired ratio.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/aspect-ratio
  api: https://www.radix-ui.com/docs/primitives/components/aspect-ratio#api-reference
---

<ComponentPreview
  name="aspect-ratio-demo"
  title="Aspect Ratio"
  description="A component that displays an image with a 16:9 aspect ratio."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add aspect-ratio
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-aspect-ratio
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="aspect-ratio" title="components/ui/aspect-ratio.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { AspectRatio } from "@/components/ui/aspect-ratio"
```

```tsx showLineNumbers
<AspectRatio ratio={16 / 9}>
  <Image src="..." alt="Image" className="rounded-md object-cover" />
</AspectRatio>
```
and ---
title: Avatar
description: An image element with a fallback for representing the user.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/avatar
  api: https://www.radix-ui.com/docs/primitives/components/avatar#api-reference
---

<ComponentPreview
  name="avatar-demo"
  title="Avatar"
  description="An avatar with a fallback."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add avatar
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-avatar
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="avatar" title="components/ui/avatar.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
```

```tsx showLineNumbers
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```
and ---
title: Badge
description: Displays a badge or a component that looks like a badge.
component: true
---

<ComponentPreview
  name="badge-demo"
  title="Badge"
  description="A default badge"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add badge
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="badge" title="components/ui/badge.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Badge } from "@/components/ui/badge"
```

```tsx
<Badge variant="default | outline | secondary | destructive">Badge</Badge>
```

### Link

You can use the asChild prop to make another component look like a badge. Here's an example of a link that looks like a badge.

```tsx showLineNumbers
import Link from "next/link"

import { Badge } from "@/components/ui/badge"

export function LinkAsBadge() {
  return (
    <Badge asChild>
      <Link href="/">Badge</Link>
    </Badge>
  )
}
```
and ---
title: Breadcrumb
description: Displays the path to the current resource using a hierarchy of links.
component: true
---

<ComponentPreview
  name="breadcrumb-demo"
  className="[&_.preview]:p-2"
  description="A breadcrumb with a collapsible dropdown."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add breadcrumb
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="breadcrumb" title="components/ui/breadcrumb.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
```

```tsx showLineNumbers
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Examples

### Custom separator

Use a custom component as children for <BreadcrumbSeparator /> to create a custom separator.

<ComponentPreview
  name="breadcrumb-separator"
  description="A breadcrumb with a custom separator"
/>

```tsx showLineNumbers {1,10-12}
import { SlashIcon } from "lucide-react"

...

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <SlashIcon />
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbLink href="/components">Components</BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### Dropdown

You can compose <BreadcrumbItem /> with a <DropdownMenu /> to create a dropdown in the breadcrumb.

<ComponentPreview
  name="breadcrumb-dropdown"
  className="[&_.preview]:p-2"
  description="A breadcrumb with a dropdown."
/>

```tsx showLineNumbers {1-6,11-21}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

...

<BreadcrumbItem>
  <DropdownMenu>
    <DropdownMenuTrigger>
      Components
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem>Documentation</DropdownMenuItem>
      <DropdownMenuItem>Themes</DropdownMenuItem>
      <DropdownMenuItem>GitHub</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</BreadcrumbItem>
```

---

### Collapsed

We provide a <BreadcrumbEllipsis /> component to show a collapsed state when the breadcrumb is too long.

<ComponentPreview
  name="breadcrumb-ellipsis"
  className="[&_.preview]:p-2"
  description="A breadcrumb showing a collapsed state."
/>

```tsx showLineNumbers {1,9}
import { BreadcrumbEllipsis } from "@/components/ui/breadcrumb"

...

<Breadcrumb>
  <BreadcrumbList>
    {/* ... */}
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    {/* ... */}
  </BreadcrumbList>
</Breadcrumb>
```

---

### Link component

To use a custom link component from your routing library, you can use the asChild prop on <BreadcrumbLink />.

<ComponentPreview
  name="breadcrumb-link"
  description="A breadcrumb with a custom Link component"
/>

```tsx showLineNumbers {1,8-10}
import Link from "next/link"

...

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink asChild>
        <Link href="/">Home</Link>
      </BreadcrumbLink>
    </BreadcrumbItem>
    {/* ... */}
  </BreadcrumbList>
</Breadcrumb>
```

---

### Responsive

Here's an example of a responsive breadcrumb that composes <BreadcrumbItem /> with <BreadcrumbEllipsis />, <DropdownMenu />, and <Drawer />.

It displays a dropdown on desktop and a drawer on mobile.

<ComponentPreview
  name="breadcrumb-responsive"
  className="[&_.preview]:p-2"
  description="A responsive breadcrumb. It displays a dropdown on desktop and a drawer on mobile."
/>
and ---
title: Button Group
description: A container that groups related buttons together with consistent styling.
component: true
---

<ComponentPreview name="button-group-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add button-group
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-slot
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="button-group" title="components/ui/button-group.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
```

```tsx
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## Accessibility

- The ButtonGroup component has the role attribute set to group.
- Use <Kbd>Tab</Kbd> to navigate between the buttons in the group.
- Use aria-label or aria-labelledby to label the button group.

```tsx showLineNumbers
<ButtonGroup aria-label="Button group">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## ButtonGroup vs ToggleGroup

- Use the ButtonGroup component when you want to group buttons that perform an action.
- Use the ToggleGroup component when you want to group buttons that toggle a state.

## Examples

### Orientation

Set the orientation prop to change the button group layout.

<ComponentPreview name="button-group-orientation" />

### Size

Control the size of buttons using the size prop on individual buttons.

<ComponentPreview name="button-group-size" />

### Nested

Nest <ButtonGroup> components to create button groups with spacing.

<ComponentPreview name="button-group-nested" />

### Separator

The ButtonGroupSeparator component visually divides buttons within a group.

Buttons with variant outline do not need a separator since they have a border. For other variants, a separator is recommended to improve the visual hierarchy.

<ComponentPreview name="button-group-separator" />

### Split

Create a split button group by adding two buttons separated by a ButtonGroupSeparator.

<ComponentPreview name="button-group-split" />

### Input

Wrap an Input component with buttons.

<ComponentPreview name="button-group-input" />

### Input Group

Wrap an InputGroup component to create complex input layouts.

<ComponentPreview name="button-group-input-group" />

### Dropdown Menu

Create a split button group with a DropdownMenu component.

<ComponentPreview name="button-group-dropdown" />

### Select

Pair with a Select component.

<ComponentPreview name="button-group-select" />

### Popover

Use with a Popover component.

<ComponentPreview name="button-group-popover" />

## API Reference

### ButtonGroup

The ButtonGroup component is a container that groups related buttons together with consistent styling.

| Prop          | Type                         | Default        |
| ------------- | ---------------------------- | -------------- |
| orientation | "horizontal" \| "vertical" | "horizontal" |

```tsx
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

Nest multiple button groups to create complex layouts with spacing. See the [nested](#nested) example for more details.

```tsx
<ButtonGroup>
  <ButtonGroup />
  <ButtonGroup />
</ButtonGroup>
```

### ButtonGroupSeparator

The ButtonGroupSeparator component visually divides buttons within a group.

| Prop          | Type                         | Default      |
| ------------- | ---------------------------- | ------------ |
| orientation | "horizontal" \| "vertical" | "vertical" |

```tsx
<ButtonGroup>
  <Button>Button 1</Button>
  <ButtonGroupSeparator />
  <Button>Button 2</Button>
</ButtonGroup>
```

### ButtonGroupText

Use this component to display text within a button group.

| Prop      | Type      | Default |
| --------- | --------- | ------- |
| asChild | boolean | false |

```tsx
<ButtonGroup>
  <ButtonGroupText>Text</ButtonGroupText>
  <Button>Button</Button>
</ButtonGroup>
```

Use the asChild prop to render a custom component as the text, for example a label.

```tsx showLineNumbers
import { ButtonGroupText } from "@/components/ui/button-group"
import { Label } from "@/components/ui/label"

export function ButtonGroupTextDemo() {
  return (
    <ButtonGroup>
      <ButtonGroupText asChild>
        <Label htmlFor="name">Text</Label>
      </ButtonGroupText>
      <Input placeholder="Type something here..." id="name" />
    </ButtonGroup>
  )
}
```
and ---
title: Calendar
description: A date field component that allows users to enter and edit date.
component: true
links:
  doc: https://react-day-picker.js.org
---

<ComponentPreview
  name="calendar-demo"
  title="Calendar"
  description="A calendar showing the current date."
/>

## Blocks

We have built a collection of 30+ calendar blocks that you can use to build your own calendar components.

See all calendar blocks in the [Blocks Library](/blocks/calendar) page.

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add calendar
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install react-day-picker date-fns
```

<Step>Add the Button component to your project.</Step>

The Calendar component uses the Button component. Make sure you have it installed in your project.

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="calendar" title="components/ui/calendar.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Calendar } from "@/components/ui/calendar"
```

```tsx showLineNumbers
const [date, setDate] = React.useState<Date | undefined>(new Date())

return (
  <Calendar
    mode="single"
    selected={date}
    onSelect={setDate}
    className="rounded-lg border"
  />
)
```

See the [React DayPicker](https://react-day-picker.js.org) documentation for more information.

## About

The Calendar component is built on top of [React DayPicker](https://react-day-picker.js.org).

## Customization

See the [React DayPicker](https://react-day-picker.js.org/docs/customization) documentation for more information on how to customize the Calendar component.

## Date Picker

You can use the <Calendar> component to build a date picker. See the [Date Picker](/docs/components/date-picker) page for more information.

## Persian / Hijri / Jalali Calendar

To use the Persian calendar, edit components/ui/calendar.tsx and replace react-day-picker with react-day-picker/persian.

```diff
- import { DayPicker } from "react-day-picker"
+ import { DayPicker } from "react-day-picker/persian"
```

<ComponentPreview
  name="calendar-hijri"
  title="Persian / Hijri / Jalali Calendar"
  description="A Persian calendar."
/>

## Selected Date (With TimeZone)

The Calendar component accepts a timeZone prop to ensure dates are displayed and selected in the user's local timezone.

```tsx showLineNumbers
export function CalendarWithTimezone() {
  const [date, setDate] = React.useState<Date | undefined>(undefined)
  const [timeZone, setTimeZone] = React.useState<string | undefined>(undefined)

  React.useEffect(() => {
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }, [])

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      timeZone={timeZone}
    />
  )
}
```

**Note:** If you notice a selected date offset (for example, selecting the 20th highlights the 19th), make sure the timeZone prop is set to the user's local timezone.

**Why client-side?** The timezone is detected using Intl.DateTimeFormat().resolvedOptions().timeZone inside a useEffect to ensure compatibility with server-side rendering. Detecting the timezone during render would cause hydration mismatches, as the server and client may be in different timezones.

## Examples

### Range Calendar

<ComponentPreview
  name="calendar-05"
  title="Range Calendar"
  description="A calendar showing the current date and range selection."
  className="**:[.preview]:h-auto lg:**:[.preview]:h-[450px]"
/>

### Month and Year Selector

<ComponentPreview
  name="calendar-13"
  title="Month and Year Selector"
  description="A calendar with month and year dropdowns."
/>

### Date of Birth Picker

<ComponentPreview
  name="calendar-22"
  title="Date of Birth Picker"
  description="A calendar with date of birth picker."
/>

### Date and Time Picker

<ComponentPreview
  name="calendar-24"
  title="Date and Time Picker"
  description="A calendar with date and time picker."
/>

### Natural Language Picker

This component uses the chrono-node library to parse natural language dates.

<ComponentPreview
  name="calendar-29"
  title="Natural Language Picker"
  description="A calendar with natural language picker."
/>

### Custom Cell Size

<ComponentPreview
  name="calendar-18"
  title="Custom Cell Size"
  description="A calendar with custom cell size that's responsive."
  className="**:[.preview]:h-[560px]"
/>

You can customize the size of calendar cells using the --cell-size CSS variable. You can also make it responsive by using breakpoint-specific values:

```tsx showLineNumbers
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
/>
```

Or use fixed values:

```tsx showLineNumbers
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border [--cell-size:2.75rem] md:[--cell-size:3rem]"
/>
```

## Upgrade Guide

### Tailwind v4

If you're already using Tailwind v4, you can upgrade to the latest version of the Calendar component by running the following command:

```bash
npx shadcn@latest add calendar
```

When you're prompted to overwrite the existing Calendar component, select Yes. **If you have made any changes to the Calendar component, you will need to merge your changes with the new version.**

This will update the Calendar component and react-day-picker to the latest version.

Next, follow the [React DayPicker](https://daypicker.dev/upgrading) upgrade guide to upgrade your existing components to the latest version.

#### Installing Blocks

After upgrading the Calendar component, you can install the new blocks by running the shadcn@latest add command.

```bash
npx shadcn@latest add calendar-02
```

This will install the latest version of the calendar blocks.

### Tailwind v3

If you're using Tailwind v3, you can upgrade to the latest version of the Calendar by copying the following code to your calendar.tsx file.

<CodeCollapsibleWrapper>

```tsx showLineNumbers title="components/ui/calendar.tsx"
"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.rawrtl:**:[.rdp-button\_next>svg]:rotate-180,
        String.rawrtl:**:[.rdp-button\_previous>svg]:rotate-180,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
            : "[&:first-child[data-selected=true]_button]:rounded-l-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
```

</CodeCollapsibleWrapper>

**If you have made any changes to the Calendar component, you will need to merge your changes with the new version.**

Then follow the [React DayPicker](https://daypicker.dev/upgrading) upgrade guide to upgrade your dependencies and existing components to the latest version.

#### Installing Blocks

After upgrading the Calendar component, you can install the new blocks by running the shadcn@latest add command.

```bash
npx shadcn@latest add calendar-02
```

This will install the latest version of the calendar blocks.

## Changelog

### 2025-10-26 Fixed day radius with week numbers

We have fixed an issue where the selected day's left border radius was not applied correctly when week numbers were displayed. The fix ensures that when showWeekNumber is enabled, the first day (which is the second child due to the week number column) correctly receives the rounded left border.

To apply this fix, edit components/ui/calendar.tsx and update the day class in classNames:

```tsx showLineNumbers title="components/ui/calendar.tsx" {5-7}
classNames={{
  // ... other classNames
  day: cn(
    "relative w-full h-full p-0 text-center [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none",
    props.showWeekNumber
      ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-md"
      : "[&:first-child[data-selected=true]_button]:rounded-l-md",
    defaultClassNames.day
  ),
  // ... other classNames
}}
```
and ---
title: Chart
description: Beautiful charts. Built using Recharts. Copy and paste into your apps.
component: true
---

<Callout>

**Note:** We're working on upgrading to Recharts v3. In the meantime, if you'd like to start testing v3, see the code in the comment [here](https://github.com/shadcn-ui/ui/issues/7669#issuecomment-2998299159). We'll have an official release soon.

</Callout>

<ComponentPreview
  name="chart-bar-interactive"
  className="theme-blue [&_.preview]:h-auto [&_.preview]:p-0 [&_.preview]:lg:min-h-[404px] [&_.preview>div]:w-full [&_.preview>div]:border-none [&_.preview>div]:shadow-none"
  hideCode
/>

Introducing **Charts**. A collection of chart components that you can copy and paste into your apps.

Charts are designed to look great out of the box. They work well with the other components and are fully customizable to fit your project.

[Browse the Charts Library](/charts).

## Component

We use [Recharts](https://recharts.org/) under the hood.

We designed the chart component with composition in mind. **You build your charts using Recharts components and only bring in custom components, such as ChartTooltip, when and where you need it**.

```tsx showLineNumbers /ChartContainer/ /ChartTooltipContent/
import { Bar, BarChart } from "recharts"

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

export function MyChart() {
  return (
    <ChartContainer>
      <BarChart data={data}>
        <Bar dataKey="value" />
        <ChartTooltip content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  )
}
```

We do not wrap Recharts. This means you're not locked into an abstraction. When a new Recharts version is released, you can follow the official upgrade path to upgrade your charts.

**The components are yours**.

## Installation

<Callout className="mt-4">

**Note:** If you are using charts with **React 19** or the **Next.js 15**, see the note [here](/docs/react-19#recharts).

</Callout>

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

<Steps>

<Step>Run the following command to install chart.tsx</Step>

```bash
npx shadcn@latest add chart
```

<Step>Add the following colors to your CSS file</Step>

```css title="app/globals.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
  }

  .dark {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
  }
}
```

</Steps>

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install recharts
```

<Step>Copy and paste the following code into components/ui/chart.tsx.</Step>

<ComponentSource name="chart" title="components/ui/chart.tsx" />

<Step>Add the following colors to your CSS file</Step>

```css title="app/globals.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
    --chart-3: oklch(0.398 0.07 227.392);
    --chart-4: oklch(0.828 0.189 84.429);
    --chart-5: oklch(0.769 0.188 70.08);
  }

  .dark {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
    --chart-3: oklch(0.769 0.188 70.08);
    --chart-4: oklch(0.627 0.265 303.9);
    --chart-5: oklch(0.645 0.246 16.439);
  }
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Your First Chart

Let's build your first chart. We'll build a bar chart, add a grid, axis, tooltip and legend.

<Steps>

<Step>Start by defining your data</Step>

The following data represents the number of desktop and mobile users for each month.

<Callout className="mt-4">

**Note:** Your data can be in any shape. You are not limited to the shape of the data below. Use the dataKey prop to map your data to the chart.

</Callout>

```tsx title="components/example-chart.tsx" showLineNumbers
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]
```

<Step>Define your chart config</Step>

The chart config holds configuration for the chart. This is where you place human-readable strings, such as labels, icons and color tokens for theming.

```tsx title="components/example-chart.tsx" showLineNumbers
import { type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig
```

<Step>Build your chart</Step>

You can now build your chart using Recharts components.

<Callout className="mt-4 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:border-amber-950">

**Important:** Remember to set a min-h-[VALUE] on the ChartContainer component. This is required for the chart to be responsive.

</Callout>

<ComponentSource name="chart-bar-demo" title="components/example-chart.tsx" />

<ComponentPreview
  name="chart-bar-demo"
  className="[&_.preview]:min-h-[250px] [&_.preview]:p-4"
/>

</Steps>

### Add a Grid

Let's add a grid to the chart.

<Steps>

<Step>Import the CartesianGrid component.</Step>

```tsx /CartesianGrid/
import { Bar, BarChart, CartesianGrid } from "recharts"
```

<Step>Add the CartesianGrid component to your chart.</Step>

```tsx showLineNumbers {3}
<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

<ComponentPreview
  name="chart-bar-demo-grid"
  className="[&_.preview]:min-h-[250px] [&_.preview]:p-4"
/>

</Steps>

### Add an Axis

To add an x-axis to the chart, we'll use the XAxis component.

<Steps>

<Step>Import the XAxis component.</Step>

```tsx /XAxis/
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
```

<Step>Add the XAxis component to your chart.</Step>

```tsx showLineNumbers {4-10}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

<ComponentPreview
  name="chart-bar-demo-axis"
  className="[&_.preview]:min-h-[250px] [&_.preview]:p-4"
/>

</Steps>

### Add Tooltip

So far we've only used components from Recharts. They look great out of the box thanks to some customization in the chart component.

To add a tooltip, we'll use the custom ChartTooltip and ChartTooltipContent components from chart.

<Steps>

<Step>Import the ChartTooltip and ChartTooltipContent components.</Step>

```tsx
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

<Step>Add the components to your chart.</Step>

```tsx showLineNumbers {11}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

<ComponentPreview
  name="chart-bar-demo-tooltip"
  className="[&_.preview]:min-h-[250px] [&_.preview]:p-4"
/>

Hover to see the tooltips. Easy, right? Two components, and we've got a beautiful tooltip.

</Steps>

### Add Legend

We'll do the same for the legend. We'll use the ChartLegend and ChartLegendContent components from chart.

<Steps>

<Step>Import the ChartLegend and ChartLegendContent components.</Step>

```tsx
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
```

<Step>Add the components to your chart.</Step>

```tsx showLineNumbers {12}
<ChartContainer config={chartConfig} className="h-[200px] w-full">
  <BarChart accessibilityLayer data={chartData}>
    <CartesianGrid vertical={false} />
    <XAxis
      dataKey="month"
      tickLine={false}
      tickMargin={10}
      axisLine={false}
      tickFormatter={(value) => value.slice(0, 3)}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
  </BarChart>
</ChartContainer>
```

<ComponentPreview
  name="chart-bar-demo-legend"
  className="[&_.preview]:min-h-[250px] [&_.preview]:p-4"
/>

</Steps>

Done. You've built your first chart! What's next?

- [Themes and Colors](/docs/components/chart#theming)
- [Tooltip](/docs/components/chart#tooltip)
- [Legend](/docs/components/chart#legend)

## Chart Config

The chart config is where you define the labels, icons and colors for a chart.

It is intentionally decoupled from chart data.

This allows you to share config and color tokens between charts. It can also work independently for cases where your data or color tokens live remotely or in a different format.

```tsx showLineNumbers /ChartConfig/
import { Monitor } from "lucide-react"

import { type ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    // A color like 'hsl(220, 98%, 61%)' or 'var(--color-name)'
    color: "#2563eb",
    // OR a theme object with 'light' and 'dark' keys
    theme: {
      light: "#2563eb",
      dark: "#dc2626",
    },
  },
} satisfies ChartConfig
```

## Theming

Charts have built-in support for theming. You can use css variables (recommended) or color values in any color format, such as hex, hsl or oklch.

### CSS Variables

<Steps>

<Step>Define your colors in your css file</Step>

```css {6-7,14-15} title="app/globals.css" showLineNumbers
@layer base {
  :root {
    --chart-1: oklch(0.646 0.222 41.116);
    --chart-2: oklch(0.6 0.118 184.704);
  }

  .dark: {
    --chart-1: oklch(0.488 0.243 264.376);
    --chart-2: oklch(0.696 0.17 162.48);
  }
}
```

<Step>Add the color to your chartConfig</Step>

```tsx {4,8} showLineNumbers
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig
```

</Steps>

### hex, hsl or oklch

You can also define your colors directly in the chart config. Use the color format you prefer.

```tsx showLineNumbers
const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
} satisfies ChartConfig
```

### Using Colors

To use the theme colors in your chart, reference the colors using the format var(--color-KEY).

#### Components

```tsx
<Bar dataKey="desktop" fill="var(--color-desktop)" />
```

#### Chart Data

```tsx showLineNumbers
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]
```

#### Tailwind

```tsx
<LabelList className="fill-[--color-desktop]" />
```

## Tooltip

A chart tooltip contains a label, name, indicator and value. You can use a combination of these to customize your tooltip.

<ComponentPreview
  name="chart-tooltip-demo"
  className="[&_.preview]:py-0"
  hideCode
/>

You can turn on/off any of these using the hideLabel, hideIndicator props and customize the indicator style using the indicator prop.

Use labelKey and nameKey to use a custom key for the tooltip label and name.

Chart comes with the <ChartTooltip> and <ChartTooltipContent> components. You can use these two components to add custom tooltips to your chart.

```tsx
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
```

```tsx
<ChartTooltip content={<ChartTooltipContent />} />
```

### Props

Use the following props to customize the tooltip.

| Prop            | Type                     | Description                                  |
| :-------------- | :----------------------- | :------------------------------------------- |
| labelKey      | string                   | The config or data key to use for the label. |
| nameKey       | string                   | The config or data key to use for the name.  |
| indicator     | dot line or dashed | The indicator style for the tooltip.         |
| hideLabel     | boolean                  | Whether to hide the label.                   |
| hideIndicator | boolean                  | Whether to hide the indicator.               |

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for tooltip label and names, use the labelKey and nameKey props.

```tsx showLineNumbers /browser/
const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: {
    label: "Total Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
```

```tsx
<ChartTooltip
  content={<ChartTooltipContent labelKey="visitors" nameKey="browser" />}
/>
```

This will use Total Visitors for label and Chrome and Safari for the tooltip names.

## Legend

You can use the custom <ChartLegend> and <ChartLegendContent> components to add a legend to your chart.

```tsx
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
```

```tsx
<ChartLegend content={<ChartLegendContent />} />
```

### Colors

Colors are automatically referenced from the chart config.

### Custom

To use a custom key for legend names, use the nameKey prop.

```tsx showLineNumbers /browser/
const chartData = [
  { browser: "chrome", visitors: 187, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
]

const chartConfig = {
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig
```

```tsx
<ChartLegend content={<ChartLegendContent nameKey="browser" />} />
```

This will use Chrome and Safari for the legend names.

## Accessibility

You can turn on the accessibilityLayer prop to add an accessible layer to your chart.

This prop adds keyboard access and screen reader support to your charts.

```tsx
<LineChart accessibilityLayer />
```
and ---
title: Checkbox
description: A control that allows the user to toggle between checked and not checked.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/checkbox
  api: https://www.radix-ui.com/docs/primitives/components/checkbox#api-reference
---

<ComponentPreview name="checkbox-demo" description="A checkbox" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add checkbox
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-checkbox
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="checkbox" title="components/ui/checkbox.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Checkbox } from "@/components/ui/checkbox"
```

```tsx
<Checkbox />
```
and ---
title: Collapsible
description: An interactive component which expands/collapses a panel.
component: true
featured: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/collapsible
  api: https://www.radix-ui.com/docs/primitives/components/collapsible#api-reference
---

<ComponentPreview
  name="collapsible-demo"
  description="A collapsible component."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add collapsible
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-collapsible
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="collapsible" title="components/ui/collapsible.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
```

```tsx showLineNumbers
<Collapsible>
  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
  <CollapsibleContent>
    Yes. Free to use for personal and commercial projects. No attribution
    required.
  </CollapsibleContent>
</Collapsible>
```
and ---
title: Combobox
description: Autocomplete input and command palette with a list of suggestions.
component: true
---

<ComponentPreview
  name="combobox-demo"
  description="A combobox with a list of frameworks."
/>

## Installation

The Combobox is built using a composition of the <Popover /> and the <Command /> components.

See installation instructions for the [Popover](/docs/components/popover#installation) and the [Command](/docs/components/command#installation) components.

## Usage

<CodeCollapsibleWrapper>

```tsx showLineNumbers title="components/example-combobox.tsx"
"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "next.js",
    label: "Next.js",
  },
  {
    value: "sveltekit",
    label: "SvelteKit",
  },
  {
    value: "nuxt.js",
    label: "Nuxt.js",
  },
  {
    value: "remix",
    label: "Remix",
  },
  {
    value: "astro",
    label: "Astro",
  },
]

export function ExampleCombobox() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : "Select framework..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
```

</CodeCollapsibleWrapper>

## Examples

### Combobox

<ComponentPreview
  name="combobox-demo"
  description="A combobox with a list of frameworks."
/>

### Popover

<ComponentPreview name="combobox-popover" />

### Dropdown menu

<ComponentPreview
  name="combobox-dropdown-menu"
  description="A combobox in a dropdown menu"
/>

### Responsive

You can create a responsive combobox by using the <Popover /> on desktop and the <Drawer /> components on mobile.

<ComponentPreview name="combobox-responsive" />
and ---
title: Command
description: Fast, composable, unstyled command menu for React.
component: true
links:
  doc: https://cmdk.paco.me
---

<ComponentPreview
  name="command-demo"
  align="start"
  className="[&_.preview>div]:max-w-[450px]"
  description="A command menu"
/>

## About

The <Command /> component uses the [cmdk](https://cmdk.paco.me) component by [pacocoursey](https://twitter.com/pacocoursey).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add command
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install cmdk
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="command" title="components/ui/command.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
```

```tsx showLineNumbers
<Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>Profile</CommandItem>
      <CommandItem>Billing</CommandItem>
      <CommandItem>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Examples

### Dialog

<ComponentPreview
  name="command-dialog"
  description="A command menu in a dialog"
/>

To show the command menu in a dialog, use the <CommandDialog /> component.

```tsx showLineNumbers title="components/example-command-menu.tsx"
export function CommandMenu() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
```

### Combobox

You can use the <Command /> component as a combobox. See the [Combobox](/docs/components/combobox) page for more information.
and ---
title: Context Menu
description: Displays a menu to the user — such as a set of actions or functions — triggered by a button.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/context-menu
  api: https://www.radix-ui.com/docs/primitives/components/context-menu#api-reference
---

<ComponentPreview
  name="context-menu-demo"
  description="A context menu with sub menu items."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add context-menu
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-context-menu
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="context-menu" title="components/ui/context-menu.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
```

```tsx showLineNumbers
<ContextMenu>
  <ContextMenuTrigger>Right click</ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Profile</ContextMenuItem>
    <ContextMenuItem>Billing</ContextMenuItem>
    <ContextMenuItem>Team</ContextMenuItem>
    <ContextMenuItem>Subscription</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```
and ---
title: Data Table
description: Powerful table and datagrids built using TanStack Table.
component: true
links:
  doc: https://tanstack.com/table/v8/docs/introduction
---

<ComponentPreview name="data-table-demo" className="[&_.preview]:items-start" />

## Introduction

Every data table or datagrid I've created has been unique. They all behave differently, have specific sorting and filtering requirements, and work with different data sources.

It doesn't make sense to combine all of these variations into a single component. If we do that, we'll lose the flexibility that [headless UI](https://tanstack.com/table/v8/docs/introduction#what-is-headless-ui) provides.

So instead of a data-table component, I thought it would be more helpful to provide a guide on how to build your own.

We'll start with the basic <Table /> component and build a complex data table from scratch.

<Callout className="mt-4">

**Tip:** If you find yourself using the same table in multiple places in your app, you can always extract it into a reusable component.

</Callout>

## Table of Contents

This guide will show you how to use [TanStack Table](https://tanstack.com/table) and the <Table /> component to build your own custom data table. We'll cover the following topics:

- [Basic Table](#basic-table)
- [Row Actions](#row-actions)
- [Pagination](#pagination)
- [Sorting](#sorting)
- [Filtering](#filtering)
- [Visibility](#visibility)
- [Row Selection](#row-selection)
- [Reusable Components](#reusable-components)

## Installation

1. Add the <Table /> component to your project:

```bash
npx shadcn@latest add table
```

2. Add tanstack/react-table dependency:

```bash
npm install @tanstack/react-table
```

## Prerequisites

We are going to build a table to show recent payments. Here's what our data looks like:

```tsx showLineNumbers
type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]
```

## Project Structure

Start by creating the following file structure:

```txt
app
└── payments
    ├── columns.tsx
    ├── data-table.tsx
    └── page.tsx
```

I'm using a Next.js example here but this works for any other React framework.

- columns.tsx (client component) will contain our column definitions.
- data-table.tsx (client component) will contain our <DataTable /> component.
- page.tsx (server component) is where we'll fetch data and render our table.

## Basic Table

Let's start by building a basic table.

<Steps>

### Column Definitions

First, we'll define our columns.

```tsx showLineNumbers title="app/payments/columns.tsx" {3,14-27}
"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
```

<Callout className="mt-4">

**Note:** Columns are where you define the core of what your table
will look like. They define the data that will be displayed, how it will be
formatted, sorted and filtered.

</Callout>

### <DataTable /> component

Next, we'll create a <DataTable /> component to render our table.

```tsx showLineNumbers title="app/payments/data-table.tsx"
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

<Callout>

**Tip**: If you find yourself using <DataTable /> in multiple places, this is the component you could make reusable by extracting it to components/ui/data-table.tsx.

<DataTable columns={columns} data={data} /> 

</Callout>

### Render the table

Finally, we'll render our table in our page component.

```tsx showLineNumbers title="app/payments/page.tsx" {22}
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

</Steps>

## Cell Formatting

Let's format the amount cell to display the dollar amount. We'll also align the cell to the right.

<Steps>

### Update columns definition

Update the header and cell definitions for amount as follows:

```tsx showLineNumbers title="app/payments/columns.tsx" {4-15}
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]
```

You can use the same approach to format other cells and headers.

</Steps>

## Row Actions

Let's add row actions to our table. We'll use a <Dropdown /> component for this.

<Steps>

### Update columns definition

Update our columns definition to add a new actions column. The actions cell returns a <Dropdown /> component.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,6-14,18-45}
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Payment>[] = [
  // ...
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  // ...
]
```

You can access the row data using row.original in the cell function. Use this to handle actions for your row eg. use the id to make a DELETE call to your API.

</Steps>

## Pagination

Next, we'll add pagination to our table.

<Steps>

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" {5,17}
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // ...
}
```

This will automatically paginate your rows into pages of 10. See the [pagination docs](https://tanstack.com/table/v8/docs/api/features/pagination) for more information on customizing page size and implementing manual pagination.

### Add pagination controls

We can add pagination controls to our table using the <Button /> component and the table.previousPage(), table.nextPage() API methods.

```tsx showLineNumbers title="app/payments/data-table.tsx" {1,15,21-39}
import { Button } from "@/components/ui/button"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          { // .... }
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

See [Reusable Components](#reusable-components) section for a more advanced pagination component.

</Steps>

## Sorting

Let's make the email column sortable.

<Steps>

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" showLineNumbers {3,6,10,18,25-28}
"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

### Make header cell sortable

We can now update the email header cell to add sorting controls.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,9-19}
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]
```

This will automatically sort the table (asc and desc) when the user toggles on the header cell.

</Steps>

## Filtering

Let's add a search input to filter emails in our table.

<Steps>

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" {6,10,17,24-26,35-36,39,45-54}
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

Filtering is now enabled for the email column. You can add filters to other columns as well. See the [filtering docs](https://tanstack.com/table/v8/docs/guide/filters) for more information on customizing filters.

</Steps>

## Visibility

Adding column visibility is fairly simple using @tanstack/react-table visibility API.

<Steps>

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" {8,18-23,33-34,45,49,64-91}
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

This adds a dropdown menu that you can use to toggle column visibility.

</Steps>

## Row Selection

Next, we're going to add row selection to our table.

<Steps>

### Update column definitions

```tsx showLineNumbers title="app/payments/columns.tsx" {6,9-27}
"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
```

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" {11,23,28}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table />
      </div>
    </div>
  )
}
```

This adds a checkbox to each row and a checkbox in the header to select all rows.

### Show selected rows

You can show the number of selected rows using the table.getFilteredSelectedRowModel() API.

```tsx
<div className="text-muted-foreground flex-1 text-sm">
  {table.getFilteredSelectedRowModel().rows.length} of{" "}
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

</Steps>

## Reusable Components

Here are some components you can use to build your data tables. This is from the [Tasks](/examples/tasks) demo.

### Column header

Make any column header sortable and hideable.

<ComponentSource
  src="/app/(app)/examples/tasks/components/data-table-column-header.tsx"
  title="components/data-table-column-header.tsx"
/>

```tsx showLineNumbers {5}
export const columns = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
]
```

### Pagination

Add pagination controls to your table including page size and selection count.

<ComponentSource src="/app/(app)/examples/tasks/components/data-table-pagination.tsx" />

```tsx
<DataTablePagination table={table} />
```

### Column toggle

A component to toggle column visibility.

<ComponentSource src="/app/(app)/examples/tasks/components/data-table-view-options.tsx" />

```tsx
<DataTableViewOptions table={table} />
```
and ---
title: Date Picker
description: A date picker component with range and presets.
component: true
---

<ComponentPreview
  name="calendar-22"
  title="Date of Birth Picker"
  description="A calendar with date of birth picker."
/>

## Installation

The Date Picker is built using a composition of the <Popover /> and the <Calendar /> components.

See installation instructions for the [Popover](/docs/components/popover#installation) and the [Calendar](/docs/components/calendar#installation) components.

## Usage

```tsx showLineNumbers title="components/example-date-picker.tsx"
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
        >
          <CalendarIcon />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}
```

See the [React DayPicker](https://react-day-picker.js.org) documentation for more information.

## Examples

### Date of Birth Picker

<ComponentPreview
  name="calendar-22"
  title="Date of Birth Picker"
  description="A calendar with date of birth picker."
/>

### Picker with Input

<ComponentPreview
  name="calendar-28"
  title="Picker with Input"
  description="A calendar with input and picker."
/>

### Date and Time Picker

<ComponentPreview
  name="calendar-24"
  title="Date and Time Picker"
  description="A calendar with date and time picker."
/>

### Natural Language Picker

This component uses the chrono-node library to parse natural language dates.

<ComponentPreview
  name="calendar-29"
  title="Natural Language Picker"
  description="A calendar with natural language picker."
/>
and ---
title: Dialog
description: A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.
featured: true
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/dialog
  api: https://www.radix-ui.com/docs/primitives/components/dialog#api-reference
---

<ComponentPreview
  name="dialog-demo"
  description="A dialog for editing profile details."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add dialog
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-dialog
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="dialog" title="components/ui/dialog.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
```

```tsx showLineNumbers
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Examples

### Custom close button

<ComponentPreview name="dialog-close-button" />

## Notes

To use the Dialog component from within a Context Menu or Dropdown Menu, you must encase the Context Menu or
Dropdown Menu component in the Dialog component.

```tsx showLineNumbers title="components/example-dialog-context-menu.tsx" {1, 26}
<Dialog>
  <ContextMenu>
    <ContextMenuTrigger>Right click</ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuItem>Open</ContextMenuItem>
      <ContextMenuItem>Download</ContextMenuItem>
      <DialogTrigger asChild>
        <ContextMenuItem>
          <span>Delete</span>
        </ContextMenuItem>
      </DialogTrigger>
    </ContextMenuContent>
  </ContextMenu>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you absolutely sure?</DialogTitle>
      <DialogDescription>
        This action cannot be undone. Are you sure you want to permanently
        delete this file from our servers?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button type="submit">Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```
and ---
title: Drawer
description: A drawer component for React.
component: true
links:
  doc: https://vaul.emilkowal.ski/getting-started
---

<ComponentPreview name="drawer-demo" description="A drawer component." />

## About

Drawer is built on top of [Vaul](https://github.com/emilkowalski/vaul) by [emilkowalski](https://twitter.com/emilkowalski).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add drawer
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install vaul
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="drawer" title="components/ui/drawer.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
```

```tsx showLineNumbers
<Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

## Examples

### Responsive Dialog

You can combine the Dialog and Drawer components to create a responsive dialog. This renders a Dialog component on desktop and a Drawer on mobile.

<ComponentPreview name="drawer-dialog" />
and ---
title: Empty
description: Use the Empty component to display an empty state.
component: true
---

<ComponentPreview name="empty-demo" className="[&_.preview]:p-0" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add empty
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="empty" title="components/ui/empty.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
```

```tsx
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Icon />
    </EmptyMedia>
    <EmptyTitle>No data</EmptyTitle>
    <EmptyDescription>No data found</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>Add data</Button>
  </EmptyContent>
</Empty>
```

## Examples

### Outline

Use the border utility class to create an outline empty state.

<ComponentPreview
  name="empty-outline"
  className="[&_.preview]:p-6 md:[&_.preview]:p-10"
/>

### Background

Use the bg-* and bg-gradient-* utilities to add a background to the empty state.

<ComponentPreview name="empty-background" className="[&_.preview]:p-0" />

### Avatar

Use the EmptyMedia component to display an avatar in the empty state.

<ComponentPreview name="empty-avatar" className="[&_.preview]:p-0" />

### Avatar Group

Use the EmptyMedia component to display an avatar group in the empty state.

<ComponentPreview name="empty-avatar-group" className="[&_.preview]:p-0" />

### InputGroup

You can add an InputGroup component to the EmptyContent component.

<ComponentPreview name="empty-input-group" className="[&_.preview]:p-0" />

## API Reference

### Empty

The main component of the empty state. Wraps the EmptyHeader and EmptyContent components.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<Empty>
  <EmptyHeader />
  <EmptyContent />
</Empty>
```

### EmptyHeader

The EmptyHeader component wraps the empty media, title, and description.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<EmptyHeader>
  <EmptyMedia />
  <EmptyTitle />
  <EmptyDescription />
</EmptyHeader>
```

### EmptyMedia

Use the EmptyMedia component to display the media of the empty state such as an icon or an image. You can also use it to display other components such as an avatar.

| Prop        | Type                  | Default   |
| ----------- | --------------------- | --------- |
| variant   | "default" \| "icon" | default |
| className | string              |           |

```tsx
<EmptyMedia variant="icon">
  <Icon />
</EmptyMedia>
```

```tsx
<EmptyMedia>
  <Avatar>
    <AvatarImage src="..." />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
</EmptyMedia>
```

### EmptyTitle

Use the EmptyTitle component to display the title of the empty state.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<EmptyTitle>No data</EmptyTitle>
```

### EmptyDescription

Use the EmptyDescription component to display the description of the empty state.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<EmptyDescription>You do not have any notifications.</EmptyDescription>
```

### EmptyContent

Use the EmptyContent component to display the content of the empty state such as a button, input or a link.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<EmptyContent>
  <Button>Add Project</Button>
</EmptyContent>
```
and ---
title: Field
description: Combine labels, controls, and help text to compose accessible form fields and grouped inputs.
component: true
---

<ComponentPreview
  name="field-demo"
  className="[&_.preview]:h-[800px] [&_.preview]:p-6 md:[&_.preview]:h-[850px]"
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add field
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="field" title="components/ui/field.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"
```

```tsx showLineNumbers
<FieldSet>
  <FieldLegend>Profile</FieldLegend>
  <FieldDescription>This appears on invoices and emails.</FieldDescription>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">Full name</FieldLabel>
      <Input id="name" autoComplete="off" placeholder="Evil Rabbit" />
      <FieldDescription>This appears on invoices and emails.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel htmlFor="username">Username</FieldLabel>
      <Input id="username" autoComplete="off" aria-invalid />
      <FieldError>Choose another username.</FieldError>
    </Field>
    <Field orientation="horizontal">
      <Switch id="newsletter" />
      <FieldLabel htmlFor="newsletter">Subscribe to the newsletter</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

## Anatomy

The Field family is designed for composing accessible forms. A typical field is structured as follows:

```tsx showLineNumbers
<Field>
  <FieldLabel htmlFor="input-id">Label</FieldLabel>
  {/* Input, Select, Switch, etc. */}
  <FieldDescription>Optional helper text.</FieldDescription>
  <FieldError>Validation message.</FieldError>
</Field>
```

- Field is the core wrapper for a single field.
- FieldContent is a flex column that groups label and description. Not required if you have no description.
- Wrap related fields with FieldGroup, and use FieldSet with FieldLegend for semantic grouping.

## Form

See the [Form](/docs/forms) documentation for building forms with the Field component and [React Hook Form](/docs/forms/react-hook-form) or [Tanstack Form](/docs/forms/tanstack-form).

## Examples

### Input

<ComponentPreview name="field-input" className="!mb-4 [&_.preview]:p-6" />

### Textarea

<ComponentPreview name="field-textarea" className="!mb-4 [&_.preview]:p-6" />

### Select

<ComponentPreview name="field-select" className="!mb-4 [&_.preview]:p-6" />

### Slider

<ComponentPreview name="field-slider" className="!mb-4 [&_.preview]:p-6" />

### Fieldset

<ComponentPreview name="field-fieldset" className="!mb-4 [&_.preview]:p-6" />

### Checkbox

<ComponentPreview name="field-checkbox" className="!mb-4 [&_.preview]:p-6" />

### Radio

<ComponentPreview name="field-radio" className="!mb-4 [&_.preview]:p-6" />

### Switch

<ComponentPreview name="field-switch" className="!mb-4 [&_.preview]:p-6" />

### Choice Card

Wrap Field components inside FieldLabel to create selectable field groups. This works with RadioItem, Checkbox and Switch components.

<ComponentPreview name="field-choice-card" className="!mb-4 [&_.preview]:p-6" />

### Field Group

Stack Field components with FieldGroup. Add FieldSeparator to divide them.

<ComponentPreview name="field-group" className="!mb-4 [&_.preview]:p-6" />

## Responsive Layout

- **Vertical fields:** Default orientation stacks label, control, and helper text—ideal for mobile-first layouts.
- **Horizontal fields:** Set orientation="horizontal" on Field to align the label and control side-by-side. Pair with FieldContent to keep descriptions aligned.
- **Responsive fields:** Set orientation="responsive" for automatic column layouts inside container-aware parents. Apply @container/field-group classes on FieldGroup to switch orientations at specific breakpoints.

<ComponentPreview
  name="field-responsive"
  className="!mb-4 [&_.preview]:h-[650px] [&_.preview]:p-6 [&_.preview]:md:h-[500px] [&_.preview]:md:p-10"
/>

## Validation and Errors

- Add data-invalid to Field to switch the entire block into an error state.
- Add aria-invalid on the input itself for assistive technologies.
- Render FieldError immediately after the control or inside FieldContent to keep error messages aligned with the field.

```tsx showLineNumbers /data-invalid/ /aria-invalid/
<Field data-invalid>
  <FieldLabel htmlFor="email">Email</FieldLabel>
  <Input id="email" type="email" aria-invalid />
  <FieldError>Enter a valid email address.</FieldError>
</Field>
```

## Accessibility

- FieldSet and FieldLegend keep related controls grouped for keyboard and assistive tech users.
- Field outputs role="group" so nested controls inherit labeling from FieldLabel and FieldLegend when combined.
- Apply FieldSeparator sparingly to ensure screen readers encounter clear section boundaries.

## API Reference

### FieldSet

Container that renders a semantic fieldset with spacing presets.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<FieldSet>
  <FieldLegend>Delivery</FieldLegend>
  <FieldGroup>{/* Fields */}</FieldGroup>
</FieldSet>
```

### FieldLegend

Legend element for a FieldSet. Switch to the label variant to align with label sizing.

| Prop        | Type                  | Default    |
| ----------- | --------------------- | ---------- |
| variant   | "legend" \| "label" | "legend" |
| className | string              |            |

```tsx
<FieldLegend variant="label">Notification Preferences</FieldLegend>
```

The FieldLegend has two variants: legend and label. The label variant applies label sizing and alignment. Handy if you have nested FieldSet.

### FieldGroup

Layout wrapper that stacks Field components and enables container queries for responsive orientations.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<FieldGroup className="@container/field-group flex flex-col gap-6">
  <Field>{/* ... */}</Field>
  <Field>{/* ... */}</Field>
</FieldGroup>
```

### Field

The core wrapper for a single field. Provides orientation control, invalid state styling, and spacing.

| Prop           | Type                                         | Default      |
| -------------- | -------------------------------------------- | ------------ |
| orientation  | "vertical" \| "horizontal" \| "responsive" | "vertical" |
| className    | string                                     |              |
| data-invalid | boolean                                    |              |

```tsx
<Field orientation="horizontal">
  <FieldLabel htmlFor="remember">Remember me</FieldLabel>
  <Switch id="remember" />
</Field>
```

### FieldContent

Flex column that groups control and descriptions when the label sits beside the control. Not required if you have no description.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<Field>
  <Checkbox id="notifications" />
  <FieldContent>
    <FieldLabel htmlFor="notifications">Notifications</FieldLabel>
    <FieldDescription>Email, SMS, and push options.</FieldDescription>
  </FieldContent>
</Field>
```

### FieldLabel

Label styled for both direct inputs and nested Field children.

| Prop        | Type      | Default |
| ----------- | --------- | ------- |
| className | string  |         |
| asChild   | boolean | false |

```tsx
<FieldLabel htmlFor="email">Email</FieldLabel>
```

### FieldTitle

Renders a title with label styling inside FieldContent.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<FieldContent>
  <FieldTitle>Enable Touch ID</FieldTitle>
  <FieldDescription>Unlock your device faster.</FieldDescription>
</FieldContent>
```

### FieldDescription

Helper text slot that automatically balances long lines in horizontal layouts.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<FieldDescription>We never share your email with anyone.</FieldDescription>
```

### FieldSeparator

Visual divider to separate sections inside a FieldGroup. Accepts optional inline content.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<FieldSeparator>Or continue with</FieldSeparator>
```

### FieldError

Accessible error container that accepts children or an errors array (e.g., from react-hook-form).

| Prop        | Type                                       | Default |
| ----------- | ------------------------------------------ | ------- |
| errors    | Array<{ message?: string } \| undefined> |         |
| className | string                                   |         |

```tsx
<FieldError errors={errors.username} />
```

When the errors array contains multiple messages, the component renders a list automatically.

FieldError also accepts issues produced by any validator that implements [Standard Schema](https://standardschema.dev/), including Zod, Valibot, and ArkType. Pass the issues array from the schema result directly to render a unified error list across libraries.
and ---
title: Hover Card
description: For sighted users to preview content available behind a link.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/hover-card
  api: https://www.radix-ui.com/docs/primitives/components/hover-card#api-reference
---

<ComponentPreview name="hover-card-demo" description="A hover card component" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add hover-card
```

</TabsContent>

<TabsContent value="manual">

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-hover-card
```

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="hover-card" title="components/ui/hover-card.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
```

```tsx showLineNumbers
<HoverCard>
  <HoverCardTrigger>Hover</HoverCardTrigger>
  <HoverCardContent>
    The React Framework – created and maintained by @vercel.
  </HoverCardContent>
</HoverCard>
```
and ---
title: Input Group
description: Display additional information or actions to an input or textarea.
component: true
---

import { IconInfoCircle } from "@tabler/icons-react"

<ComponentPreview name="input-group-demo" className="[&_.preview]:p-4" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add input-group
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="input-group" title="components/ui/input-group.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
```

```tsx showLineNumbers
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
  <InputGroupAddon align="inline-end">
    <InputGroupButton>Search</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## Examples

### Icon

<ComponentPreview name="input-group-icon" className="[&_.preview]:p-4" />

### Text

Display additional text information alongside inputs.

<ComponentPreview name="input-group-text" className="[&_.preview]:p-4" />

### Button

Add buttons to perform actions within the input group.

<ComponentPreview name="input-group-button" className="[&_.preview]:p-4" />

### Tooltip

Add tooltips to provide additional context or help.

<ComponentPreview name="input-group-tooltip" className="[&_.preview]:p-4" />

### Textarea

Input groups also work with textarea components. Use block-start or block-end for alignment.

<ComponentPreview name="input-group-textarea" className="[&_.preview]:p-4" />

### Spinner

Show loading indicators while processing input.

<ComponentPreview name="input-group-spinner" className="[&_.preview]:p-4" />

### Label

Add labels within input groups to improve accessibility.

<ComponentPreview name="input-group-label" className="[&_.preview]:p-4" />

### Dropdown

Pair input groups with dropdown menus for complex interactions.

<ComponentPreview name="input-group-dropdown" className="[&_.preview]:p-4" />

### Button Group

Wrap input groups with button groups to create prefixes and suffixes.

<ComponentPreview
  name="input-group-button-group"
  className="[&_.preview]:p-4"
/>

### Custom Input

Add the data-slot="input-group-control" attribute to your custom input for automatic behavior and focus state handling.

No style is applied to the custom input. Apply your own styles using the className prop.

<ComponentPreview
  name="input-group-custom"
  className="!mb-4 [&_.preview]:p-4"
/>

```tsx showLineNumbers
import { InputGroup, InputGroupAddon } from "@/component/ui/input-group"
import TextareaAutosize from "react-textarea-autosize"

export function InputGroupCustom() {
  return (
    <InputGroup>
      <TextareaAutosize
        data-slot="input-group-control"
        className="dark:bg-input/30 flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none"
        placeholder="Autoresize textarea..."
      />
      <InputGroupAddon align="block-end">how</InputGroupAddon>
    </InputGroup>
  )
}
```

## API Reference

### InputGroup

The main component that wraps inputs and addons.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<InputGroup>
  <InputGroupInput />
  <InputGroupAddon />
</InputGroup>
```

### InputGroupAddon

Displays icons, text, buttons, or other content alongside inputs.

<Callout icon={<IconInfoCircle />} title="Focus Navigation">
  For proper focus navigation, the InputGroupAddon component should be placed
  after the input. Set the align prop to position the addon.
</Callout>

| Prop        | Type                                                             | Default          |
| ----------- | ---------------------------------------------------------------- | ---------------- |
| align     | "inline-start" \| "inline-end" \| "block-start" \| "block-end" | "inline-start" |
| className | string                                                         |                  |

```tsx
<InputGroupAddon align="inline-end">
  <SearchIcon />
</InputGroupAddon>
```

**For <InputGroupInput />, use the inline-start or inline-end alignment. For <InputGroupTextarea />, use the block-start or block-end alignment.**

The InputGroupAddon component can have multiple InputGroupButton components and icons.

```tsx
<InputGroupAddon>
  <InputGroupButton>Button</InputGroupButton>
  <InputGroupButton>Button</InputGroupButton>
</InputGroupAddon>
```

### InputGroupButton

Displays buttons within input groups.

| Prop        | Type                                                                          | Default   |
| ----------- | ----------------------------------------------------------------------------- | --------- |
| size      | "xs" \| "icon-xs" \| "sm" \| "icon-sm"                                      | "xs"    |
| variant   | "default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link" | "ghost" |
| className | string                                                                      |           |

```tsx
<InputGroupButton>Button</InputGroupButton>
<InputGroupButton size="icon-xs" aria-label="Copy">
  <CopyIcon />
</InputGroupButton>
```

### InputGroupInput

Replacement for <Input /> when building input groups. This component has the input group styles pre-applied and uses the unified data-slot="input-group-control" for focus state handling.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

All other props are passed through to the underlying <Input /> component.

```tsx
<InputGroup>
  <InputGroupInput placeholder="Enter text..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

### InputGroupTextarea

Replacement for <Textarea /> when building input groups. This component has the textarea group styles pre-applied and uses the unified data-slot="input-group-control" for focus state handling.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

All other props are passed through to the underlying <Textarea /> component.

```tsx
<InputGroup>
  <InputGroupTextarea placeholder="Enter message..." />
  <InputGroupAddon align="block-end">
    <InputGroupButton>Send</InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

## Changelog

### 2025-10-06 InputGroup 

Add the min-w-0 class to the InputGroup component. See [diff](https://github.com/shadcn-ui/ui/pull/8341/files#diff-0e2ee95d0050ca4c5d82339df86c54e14a6739dc4638fdda0eec8f73aebc2da9).
and ---
title: Input
description: Displays a form input field or a component that looks like an input field.
component: true
---

<ComponentPreview
  name="input-demo"
  className="[&_input]:max-w-xs"
  description="A form input component."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add input
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="input" title="components/ui/input.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Input } from "@/components/ui/input"
```

```tsx
<Input />
```

## Examples

### Default

<ComponentPreview
  name="input-demo"
  className="[&_input]:max-w-xs"
  description="A form input component."
/>

### File

<ComponentPreview
  name="input-file"
  className="[&_input]:max-w-xs"
  description="A file input component."
/>

### Disabled

<ComponentPreview
  name="input-disabled"
  className="[&_input]:max-w-xs"
  description="A disabled input component."
/>

### With Label

<ComponentPreview
  name="input-with-label"
  className="[&_input]:max-w-xs"
  description="An input component with a label."
/>

### With Button

<ComponentPreview
  name="input-with-button"
  className="[&_input]:max-w-xs"
  description="An input component with a button."
/>

## Changelog

### 2025-09-18 Remove flex class

Edit input.tsx and remove the flex class from the input component. This is no longer needed.
and ---
title: Item
description: A versatile component that you can use to display any content.
component: true
---

The Item component is a straightforward flex container that can house nearly any type of content. Use it to display a title, description, and actions. Group it with the ItemGroup component to create a list of items.

You can pretty much achieve the same result with the div element and some classes, but **I've built this so many times** that I decided to create a component for it. Now I use it all the time.

<ComponentPreview name="item-demo" className="[&_.preview]:p-4" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add item
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="item" title="components/ui/item.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
```

```tsx showLineNumbers
<Item>
  <ItemHeader>Item Header</ItemHeader>
  <ItemMedia />
  <ItemContent>
    <ItemTitle>Item</ItemTitle>
    <ItemDescription>Item</ItemDescription>
  </ItemContent>
  <ItemActions />
  <ItemFooter>Item Footer</ItemFooter>
</Item>
```

## Item vs Field

Use Field if you need to display a form input such as a checkbox, input, radio, or select.

If you only need to display content such as a title, description, and actions, use Item.

## Examples

### Variants

<ComponentPreview name="item-variant" className="[&_.preview]:p-4" />

### Size

The Item component has different sizes for different use cases. For example, you can use the sm size for a compact item or the default size for a standard item.

<ComponentPreview name="item-size" className="[&_.preview]:p-4" />

### Icon

<ComponentPreview name="item-icon" className="[&_.preview]:p-4" />

### Avatar

<ComponentPreview name="item-avatar" className="[&_.preview]:p-4" />

### Image

<ComponentPreview name="item-image" className="[&_.preview]:p-4" />

### Group

<ComponentPreview name="item-group" className="[&_.preview]:p-4" />

### Header

<ComponentPreview name="item-header" className="[&_.preview]:p-4" />

### Link

To render an item as a link, use the asChild prop. The hover and focus states will be applied to the anchor element.

<ComponentPreview name="item-link" className="[&_.preview]:p-4" />

```tsx showLineNumbers
<Item asChild>
  <a href="/dashboard">
    <ItemMedia />
    <ItemContent>
      <ItemTitle>Dashboard</ItemTitle>
      <ItemDescription>Overview of your account and activity.</ItemDescription>
    </ItemContent>
    <ItemActions />
  </a>
</Item>
```

### Dropdown

<ComponentPreview name="item-dropdown" className="[&_.preview]:p-4" />

## API Reference

### Item

The main component for displaying content with media, title, description, and actions.

| Prop      | Type                                | Default     |
| --------- | ----------------------------------- | ----------- |
| variant | "default" \| "outline" \| "muted" | "default" |
| size    | "default" \| "sm"                 | "default" |
| asChild | boolean                           | false     |

```tsx
<Item size="" variant="">
  <ItemMedia />
  <ItemContent>
    <ItemTitle>Item</ItemTitle>
    <ItemDescription>Item</ItemDescription>
  </ItemContent>
  <ItemActions />
</Item>
```

You can use the asChild prop to render a custom component as the item, for example a link. The hover and focus states will be applied to the custom component.

```tsx showLineNumbers
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

export function ItemLink() {
  return (
    <Item asChild>
      <a href="/dashboard">
        <ItemMedia variant="icon">
          <Home />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Dashboard</ItemTitle>
          <ItemDescription>
            Overview of your account and activity.
          </ItemDescription>
        </ItemContent>
      </a>
    </Item>
  )
}
```

### ItemGroup

The ItemGroup component is a container that groups related items together with consistent styling.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<ItemGroup>
  <Item />
  <Item />
</ItemGroup>
```

### ItemSeparator

The ItemSeparator component is a separator that separates items in the item group.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<ItemGroup>
  <Item />
  <ItemSeparator />
  <Item />
</ItemGroup>
```

### ItemMedia

Use the ItemMedia component to display media content such as icons, images, or avatars.

| Prop        | Type                             | Default     |
| ----------- | -------------------------------- | ----------- |
| variant   | "default" \| "icon" \| "image" | "default" |
| className | string                         |             |

```tsx
<ItemMedia variant="icon">
  <Icon />
</ItemMedia>
```

```tsx
<ItemMedia variant="image">
  <img src="..." alt="..." />
</ItemMedia>
```

### ItemContent

The ItemContent component wraps the title and description of the item.

You can skip ItemContent if you only need a title.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<ItemContent>
  <ItemTitle>Item</ItemTitle>
  <ItemDescription>Item</ItemDescription>
</ItemContent>
```

### ItemTitle

Use the ItemTitle component to display the title of the item.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<ItemTitle>Item Title</ItemTitle>
```

### ItemDescription

Use the ItemDescription component to display the description of the item.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<ItemDescription>Item description</ItemDescription>
```

### ItemActions

Use the ItemActions component to display action buttons or other interactive elements.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<ItemActions>
  <Button>Action</Button>
  <Button>Action</Button>
</ItemActions>
```

### ItemHeader

Use the ItemHeader component to display a header in the item.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<ItemHeader>Item Header</ItemHeader>
```

### ItemFooter

Use the ItemFooter component to display a footer in the item.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string |         |

```tsx
<ItemFooter>Item Footer</ItemFooter>
```
and ---
title: Pagination
description: Pagination with page navigation, next and previous links.
component: true
---

<ComponentPreview
  name="pagination-demo"
  description="A pagination with previous and next links."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add pagination
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="pagination" title="components/ui/pagination.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
```

```tsx showLineNumbers
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

### Next.js

By default the <PaginationLink /> component will render an <a /> tag.

To use the Next.js <Link /> component, make the following updates to pagination.tsx.

```diff showLineNumbers /typeof Link/ {1}
+ import Link from "next/link"

- type PaginationLinkProps = ... & React.ComponentProps<"a">
+ type PaginationLinkProps = ... & React.ComponentProps<typeof Link>

const PaginationLink = ({...props }: ) => (
  <PaginationItem>
-   <a>
+   <Link>
      // ...
-   </a>
+   </Link>
  </PaginationItem>
)

```

<Callout className="mt-6">

**Note:** We are making updates to the cli to automatically do this for you.

</Callout>
and ---
title: Popover
description: Displays rich content in a portal, triggered by a button.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/popover
  api: https://www.radix-ui.com/docs/primitives/components/popover#api-reference
---

<ComponentPreview
  name="popover-demo"
  description="A popover component with a form."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add popover
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-popover
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="popover" title="components/ui/popover.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
```

```tsx showLineNumbers
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Place content for the popover here.</PopoverContent>
</Popover>
```
and ---
title: Progress
description: Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/progress
  api: https://www.radix-ui.com/docs/primitives/components/progress#api-reference
---

<ComponentPreview
  name="progress-demo"
  description="A progress bar component."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add progress
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-progress
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="progress" title="components/ui/progress.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Progress } from "@/components/ui/progress"
```

```tsx showLineNumbers
<Progress value={33} />
```
and ---
title: Radio Group
description: A set of checkable buttons—known as radio buttons—where no more than one of the buttons can be checked at a time.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/radio-group
  api: https://www.radix-ui.com/docs/primitives/components/radio-group#api-reference
---

<ComponentPreview
  name="radio-group-demo"
  description="A radio group with 3 items."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add radio-group
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-radio-group
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="radio-group" title="components/ui/radio-group.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
```

```tsx showLineNumbers
<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>
```
and ---
title: Resizable
description: Accessible resizable panel groups and layouts with keyboard support.
component: true
links:
  doc: https://github.com/bvaughn/react-resizable-panels
  api: https://github.com/bvaughn/react-resizable-panels/tree/main/packages/react-resizable-panels
---

<ComponentPreview
  name="resizable-demo"
  description="A group of resizable horizontal and vertical panels."
/>

## About

The Resizable component is built on top of [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) by [bvaughn](https://github.com/bvaughn).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add resizable
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install react-resizable-panels
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="resizable" title="components/ui/resizable.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
```

```tsx showLineNumbers
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel>One</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Two</ResizablePanel>
</ResizablePanelGroup>
```

## Examples

### Vertical

Use the direction prop to set the direction of the resizable panels.

<ComponentPreview
  name="resizable-vertical"
  description="A group of resizable vertical panels."
/>

```tsx showLineNumbers {9}
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Example() {
  return (
    <ResizablePanelGroup direction="vertical">
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}
```

### Handle

You can set or hide the handle by using the withHandle prop on the ResizableHandle component.

<ComponentPreview
  name="resizable-handle"
  description="A group of resizable panels with a handle."
/>

```tsx showLineNumbers {11}
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Example() {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>
  )
}
```
and ---
title: Scroll Area
description: Augments native scroll functionality for custom, cross-browser styling.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/scroll-area
  api: https://www.radix-ui.com/docs/primitives/components/scroll-area#api-reference
---

<ComponentPreview
  name="scroll-area-demo"
  description="A scroll area component."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add scroll-area
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-scroll-area
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="scroll-area" title="components/ui/scroll-area.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { ScrollArea } from "@/components/ui/scroll-area"
```

```tsx showLineNumbers
<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
  Jokester began sneaking into the castle in the middle of the night and leaving
  jokes all over the place: under the king's pillow, in his soup, even in the
  royal toilet. The king was furious, but he couldn't seem to stop Jokester. And
  then, one day, the people of the kingdom discovered that the jokes left by
  Jokester were so funny that they couldn't help but laugh. And once they
  started laughing, they couldn't stop.
</ScrollArea>
```

## Examples

### Horizontal Scrolling

<ComponentPreview name="scroll-area-horizontal-demo" />
and ---
title: Select
description: Displays a list of options for the user to pick from—triggered by a button.
component: true
featured: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/select
  api: https://www.radix-ui.com/docs/primitives/components/select#api-reference
---

<ComponentPreview
  name="select-demo"
  description="A select component with a list of options."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add select
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-select
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="select" title="components/ui/select.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
```

```tsx showLineNumbers
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
```

## Examples

### Scrollable

<ComponentPreview
  name="select-scrollable"
  description="A select component with a scrollable list of options."
/>
and ---
title: Separator
description: Visually or semantically separates content.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/separator
  api: https://www.radix-ui.com/docs/primitives/components/separator#api-reference
---

<ComponentPreview name="separator-demo" description="A separator component." />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add separator
```

</TabsContent>

<TabsContent value="manual">

<Steps>
<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-separator
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="separator" title="components/ui/separator.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Separator } from "@/components/ui/separator"
```

```tsx showLineNumbers
<Separator />
```
and ---
title: Sheet
description: Extends the Dialog component to display content that complements the main content of the screen.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/dialog
  api: https://www.radix-ui.com/docs/primitives/components/dialog#api-reference
---

<ComponentPreview name="sheet-demo" description="A sheet component." />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add sheet
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-dialog
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="sheet" title="components/ui/sheet.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

### Usage

```tsx showLineNumbers
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
```

```tsx showLineNumbers
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```

## Examples

### Side

Use the side property to <SheetContent /> to indicate the edge of the screen where the component will appear. The values can be top, right, bottom or left.

### Size

You can adjust the size of the sheet using CSS classes:

```tsx showLineNumbers {3}
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent className="w-[400px] sm:w-[540px]">
    <SheetHeader>
      <SheetTitle>Are you absolutely sure?</SheetTitle>
      <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```
and ---
title: Skeleton
description: Use to show a placeholder while content is loading.
component: true
---

<ComponentPreview name="skeleton-demo" description="A skeleton component." />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add skeleton
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="skeleton" title="components/ui/skeleton.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Skeleton } from "@/components/ui/skeleton"
```

```tsx
<Skeleton className="h-[20px] w-[100px] rounded-full" />
```

## Examples

### Card

<ComponentPreview
  name="skeleton-card"
  description="A card with skeleton showing a loading state."
/>
and ---
title: Slider
description: An input where the user selects a value from within a given range.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/slider
  api: https://www.radix-ui.com/docs/primitives/components/slider#api-reference
---

<ComponentPreview name="slider-demo" description="A slider component." />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add slider
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-slider
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="slider" title="components/ui/slider.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Slider } from "@/components/ui/slider"
```

```tsx
<Slider defaultValue={[33]} max={100} step={1} />
```
and ---
title: Sonner
description: An opinionated toast component for React.
component: true
links:
  doc: https://sonner.emilkowal.ski
---

<ComponentPreview name="sonner-demo" />

## About

Sonner is built and maintained by [emilkowalski](https://twitter.com/emilkowalski).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

<Steps>

<Step>Run the following command:</Step>

```bash
npx shadcn@latest add sonner
```

<Step>Add the Toaster component</Step>

```tsx title="app/layout.tsx" {1,9}
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

</Steps>

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install sonner next-themes
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="sonner" title="components/ui/sonner.tsx" />

<Step>Add the Toaster component</Step>

```tsx showLineNumbers title="app/layout.tsx" {1,8}
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { toast } from "sonner"
```

```tsx
toast("Event has been created.")
```

## Examples

<ComponentPreview name="sonner-types" />

## Changelog

### 2025-10-13 Icons

We've updated the Sonner component to use icons from lucide. Update your sonner.tsx file to use the new icons.

```tsx showLineNumbers title="components/ui/sonner.tsx" {3-9,20-26}
"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
```
and ---
title: Spinner
description: An indicator that can be used to show a loading state.
component: true
---

<ComponentPreview name="spinner-demo" className="[&_.preview]:p-6" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add spinner
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="spinner" title="components/ui/spinner.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Spinner } from "@/components/ui/spinner"
```

```tsx
<Spinner />
```

## Customization

You can replace the default spinner icon with any other icon by editing the Spinner component.

<ComponentPreview name="spinner-custom" />

```tsx showLineNumbers title="components/ui/spinner.tsx"
import { LoaderIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
```

## Examples

### Size

Use the size-* utility class to change the size of the spinner.

<ComponentPreview name="spinner-size" />

### Color

Use the text- utility class to change the color of the spinner.

<ComponentPreview name="spinner-color" />

### Button

Add a spinner to a button to indicate a loading state. The <Button /> will handle the spacing between the spinner and the text.

<ComponentPreview name="spinner-button" />

### Badge

You can also use a spinner inside a badge.

<ComponentPreview name="spinner-badge" />

### Input Group

Input Group can have spinners inside <InputGroupAddon>.

<ComponentPreview name="spinner-input-group" />

### Empty

<ComponentPreview name="spinner-empty" />

### Item

Use the spinner inside <ItemMedia> to indicate a loading state.

<ComponentPreview name="spinner-item" />

## API Reference

### Spinner

Use the Spinner component to display a spinner.

| Prop        | Type     | Default |
| ----------- | -------- | ------- |
| className | string | ``      |

```tsx
<Spinner />
```
and ---
title: Table
description: A responsive table component.
component: true
---

<ComponentPreview name="table-demo" description="A table component." />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add table
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="table" title="components/ui/table.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
```

```tsx showLineNumbers
<Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Data Table

You can use the <Table /> component to build more complex data tables. Combine it with [@tanstack/react-table](https://tanstack.com/table/v8) to create tables with sorting, filtering and pagination.

See the [Data Table](/docs/components/data-table) documentation for more information.

You can also see an example of a data table in the [Tasks](/examples/tasks) demo.
and ---
title: Tabs
description: A set of layered sections of content—known as tab panels—that are displayed one at a time.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/tabs
  api: https://www.radix-ui.com/docs/primitives/components/tabs#api-reference
---

<ComponentPreview
  name="tabs-demo"
  description="A tabs component with two forms."
/>

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add tabs
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-tabs
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="tabs" title="components/ui/tabs.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
```

```tsx showLineNumbers
<Tabs defaultValue="account" className="w-[400px]">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Make changes to your account here.</TabsContent>
  <TabsContent value="password">Change your password here.</TabsContent>
</Tabs>
```
and ---
title: Textarea
description: Displays a form textarea or a component that looks like a textarea.
component: true
---

<ComponentPreview name="textarea-demo" description="A textarea" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add textarea
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="textarea" title="components/ui/textarea.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Textarea } from "@/components/ui/textarea"
```

```tsx
<Textarea />
```

## Examples

### Default

<ComponentPreview name="textarea-demo" description="A textarea" />

### Disabled

<ComponentPreview name="textarea-disabled" description="A disabled textarea" />

### With Label

<ComponentPreview
  name="textarea-with-label"
  className="[&_div.grid]:w-full"
  description="A textarea with a label"
/>

### With Text

<ComponentPreview
  name="textarea-with-text"
  description="A textarea with text"
/>

### With Button

<ComponentPreview
  name="textarea-with-button"
  description="A textarea with a button"
/>
and ---
title: Toggle Group
description: A set of two-state buttons that can be toggled on or off.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/toggle-group
  api: https://www.radix-ui.com/docs/primitives/components/toggle-group#api-reference
---

<ComponentPreview name="toggle-group-spacing" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add toggle-group
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-toggle-group
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="toggle-group" title="components/ui/toggle-group.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
```

```tsx
<ToggleGroup type="single">
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
  <ToggleGroupItem value="c">C</ToggleGroupItem>
</ToggleGroup>
```

## Examples

### Outline

<ComponentPreview
  name="toggle-group-outline"
  description="A toggle group using the outline variant."
/>

### Single

<ComponentPreview
  name="toggle-group-single"
  description="A toggle group with single selection."
/>

### Small

<ComponentPreview
  name="toggle-group-sm"
  description="A toggle group using the small size."
/>

### Large

<ComponentPreview
  name="toggle-group-lg"
  description="A toggle group using the large size."
/>

### Disabled

<ComponentPreview
  name="toggle-group-disabled"
  description="A disabled toggle group."
/>

### Spacing

Use spacing={2} to add spacing between toggle group items.

<ComponentPreview
  name="toggle-group-spacing"
  description="A toggle group with spacing."
/>

## API Reference

### ToggleGroup

The main component that wraps toggle group items.

| Prop        | Type                        | Default     |
| ----------- | --------------------------- | ----------- |
| type      | "single" \| "multiple"    | "single"  |
| variant   | "default" \| "outline"    | "default" |
| size      | "default" \| "sm" \| "lg" | "default" |
| spacing   | number                    | 0         |
| className | string                    |             |

```tsx
<ToggleGroup type="single" variant="outline" size="sm">
  <ToggleGroupItem value="a">A</ToggleGroupItem>
  <ToggleGroupItem value="b">B</ToggleGroupItem>
</ToggleGroup>
```

### ToggleGroupItem

Individual toggle items within a toggle group. Remember to add an aria-label to each item for accessibility.

| Prop        | Type     | Default  |
| ----------- | -------- | -------- |
| value     | string | Required |
| className | string |          |
and ---
title: Toggle
description: A two-state button that can be either on or off.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/toggle
  api: https://www.radix-ui.com/docs/primitives/components/toggle#api-reference
---

<ComponentPreview name="toggle-demo" description="A toggle component." />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add toggle
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-toggle
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="toggle" title="components/ui/toggle.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { Toggle } from "@/components/ui/toggle"
```

```tsx
<Toggle>Toggle</Toggle>
```

## Examples

### Default

<ComponentPreview name="toggle-demo" description="A toggle component." />

### Outline

<ComponentPreview
  name="toggle-outline"
  description="A toggle component using the outline variant."
/>

### With Text

<ComponentPreview
  name="toggle-with-text"
  description="A toggle component with text."
/>

### Small

<ComponentPreview name="toggle-sm" description="A small toggle component." />

### Large

<ComponentPreview name="toggle-lg" description="A large toggle component." />

### Disabled

<ComponentPreview
  name="toggle-disabled"
  description="A disabled toggle component."
/>
and ---
title: Tooltip
description: A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.
component: true
links:
  doc: https://www.radix-ui.com/docs/primitives/components/tooltip
  api: https://www.radix-ui.com/docs/primitives/components/tooltip#api-reference
---

<ComponentPreview name="tooltip-demo" description="A tooltip component." />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add tooltip
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-tooltip
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="tooltip" title="components/ui/tooltip.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx showLineNumbers
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
```

```tsx showLineNumbers
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent>
    <p>Add to library</p>
  </TooltipContent>
</Tooltip>
```

---

## Changelog

### 2025-09-22 Update tooltip colors

We've updated the tooltip colors to use the foreground color for the background and the background color for the foreground.

Replace bg-primary text-primary-foreground with bg-foreground text-background for both <TooltipContent /> and <TooltipArrow />.
and ---
title: Typography
description: Styles for headings, paragraphs, lists...etc
component: true
---

We do not ship any typography styles by default. This page is an example of how you can use utility classes to style your text.

<ComponentPreview
  name="typography-demo"
  description="A collection of typographic elements."
  className="[&_.preview]:!h-auto"
  hideCode
/>

## h1

<ComponentPreview name="typography-h1" />

## h2

<ComponentPreview name="typography-h2" />

## h3

<ComponentPreview name="typography-h3" />

## h4

<ComponentPreview name="typography-h4" />

## p

<ComponentPreview name="typography-p" />

## blockquote

<ComponentPreview name="typography-blockquote" />

## table

<ComponentPreview name="typography-table" />

## list

<ComponentPreview name="typography-list" />

## Inline code

<ComponentPreview name="typography-inline-code" />

## Lead

<ComponentPreview name="typography-lead" />

## Large

<ComponentPreview name="typography-large" />

## Small

<ComponentPreview name="typography-small" />

## Muted

<ComponentPreview name="typography-muted" />
and ---
title: React Hook Form
description: Build forms in React using React Hook Form and Zod.
links:
  doc: https://react-hook-form.com
---

import { InfoIcon } from "lucide-react"

In this guide, we will take a look at building forms with React Hook Form. We'll cover building forms with the <Field /> component, adding schema validation using Zod, error handling, accessibility, and more.

## Demo

We are going to build the following form. It has a simple text input and a textarea. On submit, we'll validate the form data and display any errors.

<Callout icon={<InfoIcon />}>
  **Note:** For the purpose of this demo, we have intentionally disabled browser
  validation to show how schema validation and form errors work in React Hook
  Form. It is recommended to add basic browser validation in your production
  code.
</Callout>

<ComponentPreview
  name="form-rhf-demo"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

## Approach

This form leverages React Hook Form for performant, flexible form handling. We'll build our form using the <Field /> component, which gives you **complete flexibility over the markup and styling**.

- Uses React Hook Form's useForm hook for form state management.
- <Controller /> component for controlled inputs.
- <Field /> components for building accessible forms.
- Client-side validation using Zod with zodResolver.

## Anatomy

Here's a basic example of a form using the <Controller /> component from React Hook Form and the <Field /> component.

```tsx showLineNumbers {5-18}
<Controller
  name="title"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
      <Input
        {...field}
        id={field.name}
        aria-invalid={fieldState.invalid}
        placeholder="Login button not working on mobile"
        autoComplete="off"
      />
      <FieldDescription>
        Provide a concise title for your bug report.
      </FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

## Form

### Create a form schema

We'll start by defining the shape of our form using a Zod schema

<Callout icon={<InfoIcon />}>
  **Note:** This example uses zod v3 for schema validation, but you can
  replace it with any other Standard Schema validation library supported by
  React Hook Form.
</Callout>

```tsx showLineNumbers title="form.tsx"
import * as z from "zod"

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})
```

### Setup the form

Next, we'll use the useForm hook from React Hook Form to create our form instance. We'll also add the Zod resolver to validate the form data.

```tsx showLineNumbers title="form.tsx" {17-23}
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})

export function BugReportForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    // Do something with the form values.
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ... */}
      {/* Build the form here */}
      {/* ... */}
    </form>
  )
}
```

### Build the form

We can now build the form using the <Controller /> component from React Hook Form and the <Field /> component.

<ComponentSource
  src="/registry/new-york-v4/examples/form-rhf-demo.tsx"
  title="form.tsx"
/>

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the onSubmit function will be called with the validated form data. If the form data is invalid, React Hook Form will display the errors next to each field.

## Validation

### Client-side Validation

React Hook Form validates your form data using the Zod schema. Define a schema and pass it to the resolver option of the useForm hook.

```tsx showLineNumbers title="example-form.tsx" {5-8,12}
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
})

export function ExampleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })
}
```

### Validation Modes

React Hook Form supports different validation modes.

```tsx showLineNumbers title="form.tsx" {3}
const form = useForm<z.infer<typeof formSchema>>({
  resolver: zodResolver(formSchema),
  mode: "onChange",
})
```

| Mode          | Description                                              |
| ------------- | -------------------------------------------------------- |
| "onChange"  | Validation triggers on every change.                     |
| "onBlur"    | Validation triggers on blur.                             |
| "onSubmit"  | Validation triggers on submit (default).                 |
| "onTouched" | Validation triggers on first blur, then on every change. |
| "all"       | Validation triggers on blur and change.                  |

## Displaying Errors

Display errors next to the field using <FieldError />. For styling and accessibility:

- Add the data-invalid prop to the <Field /> component.
- Add the aria-invalid prop to the form control such as <Input />, <SelectTrigger />, <Checkbox />, etc.

```tsx showLineNumbers title="form.tsx" {5,11,13}
<Controller
  name="email"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
      <Input
        {...field}
        id={field.name}
        type="email"
        aria-invalid={fieldState.invalid}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

## Working with Different Field Types

### Input

- For input fields, spread the field object onto the <Input /> component.
- To show errors, add the aria-invalid prop to the <Input /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-rhf-input"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

For simple text inputs, spread the field object onto the input.

```tsx showLineNumbers title="form.tsx" {5,7,8}
<Controller
  name="name"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Name</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Textarea

- For textarea fields, spread the field object onto the <Textarea /> component.
- To show errors, add the aria-invalid prop to the <Textarea /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-rhf-textarea"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

For textarea fields, spread the field object onto the textarea.

```tsx showLineNumbers title="form.tsx" {5,10,18}
<Controller
  name="about"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor="form-rhf-textarea-about">More about you</FieldLabel>
      <Textarea
        {...field}
        id="form-rhf-textarea-about"
        aria-invalid={fieldState.invalid}
        placeholder="I'm a software engineer..."
        className="min-h-[120px]"
      />
      <FieldDescription>
        Tell us more about yourself. This will be used to help us personalize
        your experience.
      </FieldDescription>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

### Select

- For select components, use field.value and field.onChange on the <Select /> component.
- To show errors, add the aria-invalid prop to the <SelectTrigger /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-rhf-select"
  className="sm:[&_.preview]:h-[500px] sm:[&_pre]:!h-[500px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {5,13,22}
<Controller
  name="language"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field orientation="responsive" data-invalid={fieldState.invalid}>
      <FieldContent>
        <FieldLabel htmlFor="form-rhf-select-language">
          Spoken Language
        </FieldLabel>
        <FieldDescription>
          For best results, select the language you speak.
        </FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldContent>
      <Select
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
      >
        <SelectTrigger
          id="form-rhf-select-language"
          aria-invalid={fieldState.invalid}
          className="min-w-[120px]"
        >
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectItem value="auto">Auto</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
    </Field>
  )}
/>
```

### Checkbox

- For checkbox arrays, use field.value and field.onChange with array manipulation.
- To show errors, add the aria-invalid prop to the <Checkbox /> component and the data-invalid prop to the <Field /> component.
- Remember to add data-slot="checkbox-group" to the <FieldGroup /> component for proper styling and spacing.

<ComponentPreview
  name="form-rhf-checkbox"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {10,15,20-22,38}
<Controller
  name="tasks"
  control={form.control}
  render={({ field, fieldState }) => (
    <FieldSet>
      <FieldLegend variant="label">Tasks</FieldLegend>
      <FieldDescription>
        Get notified when tasks you&apos;ve created have updates.
      </FieldDescription>
      <FieldGroup data-slot="checkbox-group">
        {tasks.map((task) => (
          <Field
            key={task.id}
            orientation="horizontal"
            data-invalid={fieldState.invalid}
          >
            <Checkbox
              id={form-rhf-checkbox-${task.id}}
              name={field.name}
              aria-invalid={fieldState.invalid}
              checked={field.value.includes(task.id)}
              onCheckedChange={(checked) => {
                const newValue = checked
                  ? [...field.value, task.id]
                  : field.value.filter((value) => value !== task.id)
                field.onChange(newValue)
              }}
            />
            <FieldLabel
              htmlFor={form-rhf-checkbox-${task.id}}
              className="font-normal"
            >
              {task.label}
            </FieldLabel>
          </Field>
        ))}
      </FieldGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </FieldSet>
  )}
/>
```

### Radio Group

- For radio groups, use field.value and field.onChange on the <RadioGroup /> component.
- To show errors, add the aria-invalid prop to the <RadioGroupItem /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-rhf-radiogroup"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {12-13,17,25,31}
<Controller
  name="plan"
  control={form.control}
  render={({ field, fieldState }) => (
    <FieldSet>
      <FieldLegend>Plan</FieldLegend>
      <FieldDescription>
        You can upgrade or downgrade your plan at any time.
      </FieldDescription>
      <RadioGroup
        name={field.name}
        value={field.value}
        onValueChange={field.onChange}
      >
        {plans.map((plan) => (
          <FieldLabel key={plan.id} htmlFor={form-rhf-radiogroup-${plan.id}}>
            <Field orientation="horizontal" data-invalid={fieldState.invalid}>
              <FieldContent>
                <FieldTitle>{plan.title}</FieldTitle>
                <FieldDescription>{plan.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem
                value={plan.id}
                id={form-rhf-radiogroup-${plan.id}}
                aria-invalid={fieldState.invalid}
              />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </FieldSet>
  )}
/>
```

### Switch

- For switches, use field.value and field.onChange on the <Switch /> component.
- To show errors, add the aria-invalid prop to the <Switch /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-rhf-switch"
  className="sm:[&_.preview]:h-[500px] sm:[&_pre]:!h-[500px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {5,13,18-19}
<Controller
  name="twoFactor"
  control={form.control}
  render={({ field, fieldState }) => (
    <Field orientation="horizontal" data-invalid={fieldState.invalid}>
      <FieldContent>
        <FieldLabel htmlFor="form-rhf-switch-twoFactor">
          Multi-factor authentication
        </FieldLabel>
        <FieldDescription>
          Enable multi-factor authentication to secure your account.
        </FieldDescription>
        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
      </FieldContent>
      <Switch
        id="form-rhf-switch-twoFactor"
        name={field.name}
        checked={field.value}
        onCheckedChange={field.onChange}
        aria-invalid={fieldState.invalid}
      />
    </Field>
  )}
/>
```

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

<ComponentPreview
  name="form-rhf-complex"
  className="sm:[&_.preview]:h-[1300px] sm:[&_pre]:!h-[1300px]"
  chromeLessOnMobile
/>

## Resetting the Form

Use form.reset() to reset the form to its default values.

```tsx showLineNumbers
<Button type="button" variant="outline" onClick={() => form.reset()}>
  Reset
</Button>
```

## Array Fields

React Hook Form provides a useFieldArray hook for managing dynamic array fields. This is useful when you need to add or remove fields dynamically.

<ComponentPreview
  name="form-rhf-array"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

### Using useFieldArray

Use the useFieldArray hook to manage array fields. It provides fields, append, and remove methods.

```tsx showLineNumbers title="form.tsx" {8-11}
import { useFieldArray, useForm } from "react-hook-form"

export function ExampleForm() {
  const form = useForm({
    // ... form config
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emails",
  })
}
```

### Array Field Structure

Wrap your array fields in a <FieldSet /> with a <FieldLegend /> and <FieldDescription />.

```tsx showLineNumbers title="form.tsx"
<FieldSet className="gap-4">
  <FieldLegend variant="label">Email Addresses</FieldLegend>
  <FieldDescription>
    Add up to 5 email addresses where we can contact you.
  </FieldDescription>
  <FieldGroup className="gap-4">{/* Array items go here */}</FieldGroup>
</FieldSet>
```

### Controller Pattern for Array Items

Map over the fields array and use <Controller /> for each item. **Make sure to use field.id as the key**.

```tsx showLineNumbers title="form.tsx"
{
  fields.map((field, index) => (
    <Controller
      key={field.id}
      name={emails.${index}.address}
      control={form.control}
      render={({ field: controllerField, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldContent>
            <InputGroup>
              <InputGroupInput
                {...controllerField}
                id={form-rhf-array-email-${index}}
                aria-invalid={fieldState.invalid}
                placeholder="name@example.com"
                type="email"
                autoComplete="email"
              />
              {/* Remove button */}
            </InputGroup>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  ))
}
```

### Adding Items

Use the append method to add new items to the array.

```tsx showLineNumbers title="form.tsx"
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => append({ address: "" })}
  disabled={fields.length >= 5}
>
  Add Email Address
</Button>
```

### Removing Items

Use the remove method to remove items from the array. Add the remove button conditionally.

```tsx showLineNumbers title="form.tsx"
{
  fields.length > 1 && (
    <InputGroupAddon align="inline-end">
      <InputGroupButton
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => remove(index)}
        aria-label={Remove email ${index + 1}}
      >
        <XIcon />
      </InputGroupButton>
    </InputGroupAddon>
  )
}
```

### Array Validation

Use Zod's array method to validate array fields.

```tsx showLineNumbers title="form.tsx"
const formSchema = z.object({
  emails: z
    .array(
      z.object({
        address: z.string().email("Enter a valid email address."),
      })
    )
    .min(1, "Add at least one email address.")
    .max(5, "You can add up to 5 email addresses."),
})
```
and ---
title: TanStack Form
description: Build forms in React using TanStack Form and Zod.
links:
  doc: https://tanstack.com/form
---

import { InfoIcon } from "lucide-react"

This guide explores how to build forms using TanStack Form. You'll learn to create forms with the <Field /> component, implement schema validation with Zod, handle errors, and ensure accessibility.

## Demo

We'll start by building the following form. It has a simple text input and a textarea. On submit, we'll validate the form data and display any errors.

<Callout icon={<InfoIcon />}>
  **Note:** For the purpose of this demo, we have intentionally disabled browser
  validation to show how schema validation and form errors work in TanStack
  Form. It is recommended to add basic browser validation in your production
  code.
</Callout>

<ComponentPreview
  name="form-tanstack-demo"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

## Approach

This form leverages TanStack Form for powerful, headless form handling. We'll build our form using the <Field /> component, which gives you **complete flexibility over the markup and styling**.

- Uses TanStack Form's useForm hook for form state management.
- form.Field component with render prop pattern for controlled inputs.
- <Field /> components for building accessible forms.
- Client-side validation using Zod.
- Real-time validation feedback.

## Anatomy

Here's a basic example of a form using TanStack Form with the <Field /> component.

```tsx showLineNumbers {15-31}
<form
  onSubmit={(e) => {
    e.preventDefault()
    form.handleSubmit()
  }}
>
  <FieldGroup>
    <form.Field
      name="title"
      children={(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Bug Title</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              aria-invalid={isInvalid}
              placeholder="Login button not working on mobile"
              autoComplete="off"
            />
            <FieldDescription>
              Provide a concise title for your bug report.
            </FieldDescription>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    />
  </FieldGroup>
  <Button type="submit">Submit</Button>
</form>
```

## Form

### Create a schema

We'll start by defining the shape of our form using a Zod schema.

<Callout icon={<InfoIcon />}>
  **Note:** This example uses zod v3 for schema validation. TanStack Form
  integrates seamlessly with Zod and other Standard Schema validation libraries
  through its validators API.
</Callout>

```tsx showLineNumbers title="form.tsx"
import * as z from "zod"

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Bug title must be at least 5 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(100, "Description must be at most 100 characters."),
})
```

### Setup the form

Use the useForm hook from TanStack Form to create your form instance with Zod validation.

```tsx showLineNumbers title="form.tsx" {10-21}
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"

const formSchema = z.object({
  // ...
})

export function BugReportForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      toast.success("Form submitted successfully")
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      {/* ... */}
    </form>
  )
}
```

We are using onSubmit to validate the form data here. TanStack Form supports other validation modes, which you can read about in the [documentation](https://tanstack.com/form/latest/docs/framework/react/guides/dynamic-validation).

### Build the form

We can now build the form using the form.Field component from TanStack Form and the <Field /> component.

<ComponentSource
  src="/registry/new-york-v4/examples/form-tanstack-demo.tsx"
  title="form.tsx"
/>

### Done

That's it. You now have a fully accessible form with client-side validation.

When you submit the form, the onSubmit function will be called with the validated form data. If the form data is invalid, TanStack Form will display the errors next to each field.

## Validation

### Client-side Validation

TanStack Form validates your form data using the Zod schema. Validation happens in real-time as the user types.

```tsx showLineNumbers title="form.tsx" {13-15}
import { useForm } from "@tanstack/react-form"

const formSchema = z.object({
  // ...
})

export function BugReportForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return <form onSubmit={/* ... */}>{/* ... */}</form>
}
```

### Validation Modes

TanStack Form supports different validation strategies through the validators option:

| Mode         | Description                          |
| ------------ | ------------------------------------ |
| "onChange" | Validation triggers on every change. |
| "onBlur"   | Validation triggers on blur.         |
| "onSubmit" | Validation triggers on submit.       |

```tsx showLineNumbers title="form.tsx" {6-9}
const form = useForm({
  defaultValues: {
    title: "",
    description: "",
  },
  validators: {
    onSubmit: formSchema,
    onChange: formSchema,
    onBlur: formSchema,
  },
})
```

## Displaying Errors

Display errors next to the field using <FieldError />. For styling and accessibility:

- Add the data-invalid prop to the <Field /> component.
- Add the aria-invalid prop to the form control such as <Input />, <SelectTrigger />, <Checkbox />, etc.

```tsx showLineNumbers title="form.tsx" {4,18}
<form.Field
  name="email"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          type="email"
          aria-invalid={isInvalid}
        />
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```

## Working with Different Field Types

### Input

- For input fields, use field.state.value and field.handleChange on the <Input /> component.
- To show errors, add the aria-invalid prop to the <Input /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-tanstack-input"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {6,11-14,22}
<form.Field
  name="username"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="form-tanstack-input-username">Username</FieldLabel>
        <Input
          id="form-tanstack-input-username"
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder="shadcn"
          autoComplete="username"
        />
        <FieldDescription>
          This is your public display name. Must be between 3 and 10 characters.
          Must only contain letters, numbers, and underscores.
        </FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```

### Textarea

- For textarea fields, use field.state.value and field.handleChange on the <Textarea /> component.
- To show errors, add the aria-invalid prop to the <Textarea /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-tanstack-textarea"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {6,13-16,24}
<form.Field
  name="about"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field data-invalid={isInvalid}>
        <FieldLabel htmlFor="form-tanstack-textarea-about">
          More about you
        </FieldLabel>
        <Textarea
          id="form-tanstack-textarea-about"
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder="I'm a software engineer..."
          className="min-h-[120px]"
        />
        <FieldDescription>
          Tell us more about yourself. This will be used to help us personalize
          your experience.
        </FieldDescription>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </Field>
    )
  }}
/>
```

### Select

- For select components, use field.state.value and field.handleChange on the <Select /> component.
- To show errors, add the aria-invalid prop to the <SelectTrigger /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-tanstack-select"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {6,18-19,23}
<form.Field
  name="language"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field orientation="responsive" data-invalid={isInvalid}>
        <FieldContent>
          <FieldLabel htmlFor="form-tanstack-select-language">
            Spoken Language
          </FieldLabel>
          <FieldDescription>
            For best results, select the language you speak.
          </FieldDescription>
          {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </FieldContent>
        <Select
          name={field.name}
          value={field.state.value}
          onValueChange={field.handleChange}
        >
          <SelectTrigger
            id="form-tanstack-select-language"
            aria-invalid={isInvalid}
            className="min-w-[120px]"
          >
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            <SelectItem value="auto">Auto</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    )
  }}
/>
```

### Checkbox

- For checkbox, use field.state.value and field.handleChange on the <Checkbox /> component.
- To show errors, add the aria-invalid prop to the <Checkbox /> component and the data-invalid prop to the <Field /> component.
- For checkbox arrays, use mode="array" on the <form.Field /> component and TanStack Form's array helpers.
- Remember to add data-slot="checkbox-group" to the <FieldGroup /> component for proper styling and spacing.

<ComponentPreview
  name="form-tanstack-checkbox"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {12,17,22-24,44}
<form.Field
  name="tasks"
  mode="array"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <FieldSet>
        <FieldLegend variant="label">Tasks</FieldLegend>
        <FieldDescription>
          Get notified when tasks you&apos;ve created have updates.
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          {tasks.map((task) => (
            <Field
              key={task.id}
              orientation="horizontal"
              data-invalid={isInvalid}
            >
              <Checkbox
                id={form-tanstack-checkbox-${task.id}}
                name={field.name}
                aria-invalid={isInvalid}
                checked={field.state.value.includes(task.id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    field.pushValue(task.id)
                  } else {
                    const index = field.state.value.indexOf(task.id)
                    if (index > -1) {
                      field.removeValue(index)
                    }
                  }
                }}
              />
              <FieldLabel
                htmlFor={form-tanstack-checkbox-${task.id}}
                className="font-normal"
              >
                {task.label}
              </FieldLabel>
            </Field>
          ))}
        </FieldGroup>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldSet>
    )
  }}
/>
```

### Radio Group

- For radio groups, use field.state.value and field.handleChange on the <RadioGroup /> component.
- To show errors, add the aria-invalid prop to the <RadioGroupItem /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-tanstack-radiogroup"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {21,29,35}
<form.Field
  name="plan"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <FieldSet>
        <FieldLegend>Plan</FieldLegend>
        <FieldDescription>
          You can upgrade or downgrade your plan at any time.
        </FieldDescription>
        <RadioGroup
          name={field.name}
          value={field.state.value}
          onValueChange={field.handleChange}
        >
          {plans.map((plan) => (
            <FieldLabel
              key={plan.id}
              htmlFor={form-tanstack-radiogroup-${plan.id}}
            >
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldTitle>{plan.title}</FieldTitle>
                  <FieldDescription>{plan.description}</FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={plan.id}
                  id={form-tanstack-radiogroup-${plan.id}}
                  aria-invalid={isInvalid}
                />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>
        {isInvalid && <FieldError errors={field.state.meta.errors} />}
      </FieldSet>
    )
  }}
/>
```

### Switch

- For switches, use field.state.value and field.handleChange on the <Switch /> component.
- To show errors, add the aria-invalid prop to the <Switch /> component and the data-invalid prop to the <Field /> component.

<ComponentPreview
  name="form-tanstack-switch"
  className="sm:[&_.preview]:h-[500px] sm:[&_pre]:!h-[500px]"
  chromeLessOnMobile
/>

```tsx showLineNumbers title="form.tsx" {6,14,19-21}
<form.Field
  name="twoFactor"
  children={(field) => {
    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
    return (
      <Field orientation="horizontal" data-invalid={isInvalid}>
        <FieldContent>
          <FieldLabel htmlFor="form-tanstack-switch-twoFactor">
            Multi-factor authentication
          </FieldLabel>
          <FieldDescription>
            Enable multi-factor authentication to secure your account.
          </FieldDescription>
          {isInvalid && <FieldError errors={field.state.meta.errors} />}
        </FieldContent>
        <Switch
          id="form-tanstack-switch-twoFactor"
          name={field.name}
          checked={field.state.value}
          onCheckedChange={field.handleChange}
          aria-invalid={isInvalid}
        />
      </Field>
    )
  }}
/>
```

### Complex Forms

Here is an example of a more complex form with multiple fields and validation.

<ComponentPreview
  name="form-tanstack-complex"
  className="sm:[&_.preview]:h-[1100px] sm:[&_pre]:!h-[1100px]"
  chromeLessOnMobile
/>

## Resetting the Form

Use form.reset() to reset the form to its default values.

```tsx showLineNumbers
<Button type="button" variant="outline" onClick={() => form.reset()}>
  Reset
</Button>
```

## Array Fields

TanStack Form provides powerful array field management with mode="array". This allows you to dynamically add, remove, and update array items with full validation support.

<ComponentPreview
  name="form-tanstack-array"
  className="sm:[&_.preview]:h-[700px] sm:[&_pre]:!h-[700px]"
  chromeLessOnMobile
/>

This example demonstrates managing multiple email addresses with array fields. Users can add up to 5 email addresses, remove individual addresses, and each address is validated independently.

### Array Field Structure

Use mode="array" on the parent field to enable array field management.

```tsx showLineNumbers title="form.tsx" {3,12-14}
<form.Field
  name="emails"
  mode="array"
  children={(field) => {
    return (
      <FieldSet>
        <FieldLegend variant="label">Email Addresses</FieldLegend>
        <FieldDescription>
          Add up to 5 email addresses where we can contact you.
        </FieldDescription>
        <FieldGroup>
          {field.state.value.map((_, index) => (
            // Nested field for each array item
          ))}
        </FieldGroup>
      </FieldSet>
    )
  }}
/>
```

### Nested Fields

Access individual array items using bracket notation: fieldName[index].propertyName. This example uses InputGroup to display the remove button inline with the input.

```tsx showLineNumbers title="form.tsx"
<form.Field
  name={emails[${index}].address}
  children={(subField) => {
    const isSubFieldInvalid =
      subField.state.meta.isTouched && !subField.state.meta.isValid
    return (
      <Field orientation="horizontal" data-invalid={isSubFieldInvalid}>
        <FieldContent>
          <InputGroup>
            <InputGroupInput
              id={form-tanstack-array-email-${index}}
              name={subField.name}
              value={subField.state.value}
              onBlur={subField.handleBlur}
              onChange={(e) => subField.handleChange(e.target.value)}
              aria-invalid={isSubFieldInvalid}
              placeholder="name@example.com"
              type="email"
            />
            {field.state.value.length > 1 && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => field.removeValue(index)}
                  aria-label={Remove email ${index + 1}}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
          {isSubFieldInvalid && (
            <FieldError errors={subField.state.meta.errors} />
          )}
        </FieldContent>
      </Field>
    )
  }}
/>
```

### Adding Items

Use field.pushValue(item) to add items to an array field. You can disable the button when the array reaches its maximum length.

```tsx showLineNumbers title="form.tsx"
<Button
  type="button"
  variant="outline"
  size="sm"
  onClick={() => field.pushValue({ address: "" })}
  disabled={field.state.value.length >= 5}
>
  Add Email Address
</Button>
```

### Removing Items

Use field.removeValue(index) to remove items from an array field. You can conditionally show the remove button only when there's more than one item.

```tsx showLineNumbers title="form.tsx"
{
  field.state.value.length > 1 && (
    <InputGroupButton
      onClick={() => field.removeValue(index)}
      aria-label={Remove email ${index + 1}}
    >
      <XIcon />
    </InputGroupButton>
  )
}
```

### Array Validation

Validate array fields using Zod's array methods.

```tsx showLineNumbers title="form.tsx"
const formSchema = z.object({
  emails: z
    .array(
      z.object({
        address: z.string().email("Enter a valid email address."),
      })
    )
    .min(1, "Add at least one email address.")
    .max(5, "You can add up to 5 email addresses."),
})
```
and ---
title: components.json
description: Configuration for your project.
---

The components.json file holds configuration for your project.

We use it to understand how your project is set up and how to generate components customized for your project.

<Callout className="mt-6" title="Note: The components.json file is optional">
  It is **only required if you're using the CLI** to add components to your
  project. If you're using the copy and paste method, you don't need this file.
</Callout>

You can create a components.json file in your project by running the following command:

```bash
npx shadcn@latest init
```

See the <Link href="/docs/cli">CLI section</Link> for more information.

## $schema

You can see the JSON Schema for components.json [here](https://ui.shadcn.com/schema.json).

```json title="components.json"
{
  "$schema": "https://ui.shadcn.com/schema.json"
}
```

## style

The style for your components. **This cannot be changed after initialization.**

```json title="components.json"
{
  "style": "new-york"
}
```

The default style has been deprecated. Use the new-york style instead.

## tailwind

Configuration to help the CLI understand how Tailwind CSS is set up in your project.

See the <Link href="/docs/installation">installation section</Link> for how to set up Tailwind CSS.

### tailwind.config

Path to where your tailwind.config.js file is located. **For Tailwind CSS v4, leave this blank.**

```json title="components.json"
{
  "tailwind": {
    "config": "tailwind.config.js" | "tailwind.config.ts"
  }
}
```

### tailwind.css

Path to the CSS file that imports Tailwind CSS into your project.

```json title="components.json"
{
  "tailwind": {
    "css": "styles/global.css"
  }
}
```

### tailwind.baseColor

This is used to generate the default color palette for your components. **This cannot be changed after initialization.**

```json title="components.json"
{
  "tailwind": {
    "baseColor": "gray" | "neutral" | "slate" | "stone" | "zinc"
  }
}
```

### tailwind.cssVariables

You can choose between using CSS variables or Tailwind CSS utility classes for theming.

To use utility classes for theming set tailwind.cssVariables to false. For CSS variables, set tailwind.cssVariables to true.

```json title="components.json"
{
  "tailwind": {
    "cssVariables": true | false 
  }
}
```

For more information, see the <Link href="/docs/theming">theming docs</Link>.

**This cannot be changed after initialization.** To switch between CSS variables and utility classes, you'll have to delete and re-install your components.

### tailwind.prefix

The prefix to use for your Tailwind CSS utility classes. Components will be added with this prefix.

```json title="components.json"
{
  "tailwind": {
    "prefix": "tw-"
  }
}
```

## rsc

Whether or not to enable support for React Server Components.

The CLI automatically adds a use client directive to client components when set to true.

```json title="components.json"
{
  "rsc": true | false 
}
```

## tsx

Choose between TypeScript or JavaScript components.

Setting this option to false allows components to be added as JavaScript with the .jsx file extension.

```json title="components.json"
{
  "tsx": true | false 
}
```

## aliases

The CLI uses these values and the paths config from your tsconfig.json or jsconfig.json file to place generated components in the correct location.

Path aliases have to be set up in your tsconfig.json or jsconfig.json file.

<Callout className="mt-6">
  **Important:** If you're using the src directory, make sure it is included
  under paths in your tsconfig.json or jsconfig.json file.
</Callout>

### aliases.utils

Import alias for your utility functions.

```json title="components.json"
{
  "aliases": {
    "utils": "@/lib/utils"
  }
}
```

### aliases.components

Import alias for your components.

```json title="components.json"
{
  "aliases": {
    "components": "@/components"
  }
}
```

### aliases.ui

Import alias for ui components.

The CLI will use the aliases.ui value to determine where to place your ui components. Use this config if you want to customize the installation directory for your ui components.

```json title="components.json"
{
  "aliases": {
    "ui": "@/app/ui"
  }
}
```

### aliases.lib

Import alias for lib functions such as format-date or generate-id.

```json title="components.json"
{
  "aliases": {
    "lib": "@/lib"
  }
}
```

### aliases.hooks

Import alias for hooks such as use-media-query or use-toast.

```json title="components.json"
{
  "aliases": {
    "hooks": "@/hooks"
  }
}
```

## registries

Configure multiple resource registries for your project. This allows you to install components, libraries, utilities, and other resources from various sources including private registries.

See the <Link href="/docs/registry/namespace">Namespaced Registries</Link> documentation for detailed information.

### Basic Configuration

Configure registries with URL templates:

```json title="components.json"
{
  "registries": {
    "@v0": "https://v0.dev/chat/b/{name}",
    "@acme": "https://registry.acme.com/{name}.json",
    "@internal": "https://internal.company.com/{name}.json"
  }
}
```

The {name} placeholder is replaced with the resource name when installing.

### Advanced Configuration with Authentication

For private registries that require authentication:

```json title="components.json"
{
  "registries": {
    "@private": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}",
        "X-API-Key": "${API_KEY}"
      },
      "params": {
        "version": "latest"
      }
    }
  }
}
```

Environment variables in the format ${VAR_NAME} are automatically expanded from your environment.

### Using Namespaced Registries

Once configured, install resources using the namespace syntax:

```bash
# Install from a configured registry
npx shadcn@latest add @v0/dashboard

# Install from private registry
npx shadcn@latest add @private/button

# Install multiple resources
npx shadcn@latest add @acme/header @internal/auth-utils
```

### Example: Multiple Registry Setup

```json title="components.json"
{
  "registries": {
    "@shadcn": "https://ui.shadcn.com/r/{name}.json",
    "@company-ui": {
      "url": "https://registry.company.com/ui/{name}.json",
      "headers": {
        "Authorization": "Bearer ${COMPANY_TOKEN}"
      }
    },
    "@team": {
      "url": "https://team.company.com/{name}.json",
      "params": {
        "team": "frontend",
        "version": "${REGISTRY_VERSION}"
      }
    }
  }
}
```

This configuration allows you to:

- Install public components from shadcn/ui
- Access private company UI components with authentication
- Use team-specific resources with versioning

For more information about authentication, see the <Link href="/docs/registry/authentication">Authentication</Link> documentation.
and ---
title: Theming
description: Using CSS Variables and color utilities for theming.
---

You can choose between using CSS variables (recommended) or utility classes for theming.

## CSS Variables

```tsx /bg-background/ /text-foreground/
<div className="bg-background text-foreground" />
```

To use CSS variables for theming set tailwind.cssVariables to true in your components.json file.

```json {8} title="components.json" showLineNumbers
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## Utility classes

```tsx /bg-zinc-950/ /text-zinc-50/ /dark:bg-white/ /dark:text-zinc-950/
<div className="bg-zinc-950 dark:bg-white" />
```

To use utility classes for theming set tailwind.cssVariables to false in your components.json file.

```json {8} title="components.json" showLineNumbers
{
  "style": "new-york",
  "rsc": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": false
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

## Convention

We use a simple background and foreground convention for colors. The background variable is used for the background color of the component and the foreground variable is used for the text color.

<Callout className="mt-4">

The background suffix is omitted when the variable is used for the background color of the component.

</Callout>

Given the following CSS variables:

```css
--primary: oklch(0.205 0 0);
--primary-foreground: oklch(0.985 0 0);
```

The background color of the following component will be var(--primary) and the foreground color will be var(--primary-foreground).

```tsx
<div className="bg-primary text-primary-foreground">Hello</div>
```

## List of variables

Here's the list of variables available for customization:

```css title="app/globals.css" showLineNumbers
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.269 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.371 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.439 0 0);
}
```

## Adding new colors

To add new colors, you need to add them to your CSS file under the :root and dark pseudo-classes. Then, use the @theme inline directive to make the colors available as CSS variables.

```css title="app/globals.css" showLineNumbers
:root {
  --warning: oklch(0.84 0.16 84);
  --warning-foreground: oklch(0.28 0.07 46);
}

.dark {
  --warning: oklch(0.41 0.11 46);
  --warning-foreground: oklch(0.99 0.02 95);
}

@theme inline {
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
}
```

You can now use the warning utility class in your components.

```tsx /bg-warning/ /text-warning-foreground/
<div className="bg-warning text-warning-foreground" />
```

## Other color formats

See the [Tailwind CSS documentation](https://tailwindcss.com/docs/colors) for more information on using colors in Tailwind CSS.

## Base Colors

For reference, here's a list of the base colors that are available.

### Neutral

<CodeCollapsibleWrapper>

```css title="app/globals.css" showLineNumbers
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}
```

</CodeCollapsibleWrapper>

### Stone

<CodeCollapsibleWrapper>

```css title="app/globals.css" showLineNumbers
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.147 0.004 49.25);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.147 0.004 49.25);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.147 0.004 49.25);
  --primary: oklch(0.216 0.006 56.043);
  --primary-foreground: oklch(0.985 0.001 106.423);
  --secondary: oklch(0.97 0.001 106.424);
  --secondary-foreground: oklch(0.216 0.006 56.043);
  --muted: oklch(0.97 0.001 106.424);
  --muted-foreground: oklch(0.553 0.013 58.071);
  --accent: oklch(0.97 0.001 106.424);
  --accent-foreground: oklch(0.216 0.006 56.043);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.923 0.003 48.717);
  --input: oklch(0.923 0.003 48.717);
  --ring: oklch(0.709 0.01 56.259);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0.001 106.423);
  --sidebar-foreground: oklch(0.147 0.004 49.25);
  --sidebar-primary: oklch(0.216 0.006 56.043);
  --sidebar-primary-foreground: oklch(0.985 0.001 106.423);
  --sidebar-accent: oklch(0.97 0.001 106.424);
  --sidebar-accent-foreground: oklch(0.216 0.006 56.043);
  --sidebar-border: oklch(0.923 0.003 48.717);
  --sidebar-ring: oklch(0.709 0.01 56.259);
}

.dark {
  --background: oklch(0.147 0.004 49.25);
  --foreground: oklch(0.985 0.001 106.423);
  --card: oklch(0.216 0.006 56.043);
  --card-foreground: oklch(0.985 0.001 106.423);
  --popover: oklch(0.216 0.006 56.043);
  --popover-foreground: oklch(0.985 0.001 106.423);
  --primary: oklch(0.923 0.003 48.717);
  --primary-foreground: oklch(0.216 0.006 56.043);
  --secondary: oklch(0.268 0.007 34.298);
  --secondary-foreground: oklch(0.985 0.001 106.423);
  --muted: oklch(0.268 0.007 34.298);
  --muted-foreground: oklch(0.709 0.01 56.259);
  --accent: oklch(0.268 0.007 34.298);
  --accent-foreground: oklch(0.985 0.001 106.423);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.553 0.013 58.071);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.216 0.006 56.043);
  --sidebar-foreground: oklch(0.985 0.001 106.423);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0.001 106.423);
  --sidebar-accent: oklch(0.268 0.007 34.298);
  --sidebar-accent-foreground: oklch(0.985 0.001 106.423);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.553 0.013 58.071);
}
```

</CodeCollapsibleWrapper>

### Zinc

<CodeCollapsibleWrapper>

```css title="app/globals.css" showLineNumbers
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.21 0.006 285.885);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.141 0.005 285.823);
  --sidebar-primary: oklch(0.21 0.006 285.885);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.967 0.001 286.375);
  --sidebar-accent-foreground: oklch(0.21 0.006 285.885);
  --sidebar-border: oklch(0.92 0.004 286.32);
  --sidebar-ring: oklch(0.705 0.015 286.067);
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.92 0.004 286.32);
  --primary-foreground: oklch(0.21 0.006 285.885);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0.016 285.938);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.21 0.006 285.885);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.274 0.006 286.033);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.552 0.016 285.938);
}
```

</CodeCollapsibleWrapper>

### Gray

<CodeCollapsibleWrapper>

```css title="app/globals.css" showLineNumbers
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.13 0.028 261.692);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.13 0.028 261.692);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.13 0.028 261.692);
  --primary: oklch(0.21 0.034 264.665);
  --primary-foreground: oklch(0.985 0.002 247.839);
  --secondary: oklch(0.967 0.003 264.542);
  --secondary-foreground: oklch(0.21 0.034 264.665);
  --muted: oklch(0.967 0.003 264.542);
  --muted-foreground: oklch(0.551 0.027 264.364);
  --accent: oklch(0.967 0.003 264.542);
  --accent-foreground: oklch(0.21 0.034 264.665);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.928 0.006 264.531);
  --input: oklch(0.928 0.006 264.531);
  --ring: oklch(0.707 0.022 261.325);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0.002 247.839);
  --sidebar-foreground: oklch(0.13 0.028 261.692);
  --sidebar-primary: oklch(0.21 0.034 264.665);
  --sidebar-primary-foreground: oklch(0.985 0.002 247.839);
  --sidebar-accent: oklch(0.967 0.003 264.542);
  --sidebar-accent-foreground: oklch(0.21 0.034 264.665);
  --sidebar-border: oklch(0.928 0.006 264.531);
  --sidebar-ring: oklch(0.707 0.022 261.325);
}

.dark {
  --background: oklch(0.13 0.028 261.692);
  --foreground: oklch(0.985 0.002 247.839);
  --card: oklch(0.21 0.034 264.665);
  --card-foreground: oklch(0.985 0.002 247.839);
  --popover: oklch(0.21 0.034 264.665);
  --popover-foreground: oklch(0.985 0.002 247.839);
  --primary: oklch(0.928 0.006 264.531);
  --primary-foreground: oklch(0.21 0.034 264.665);
  --secondary: oklch(0.278 0.033 256.848);
  --secondary-foreground: oklch(0.985 0.002 247.839);
  --muted: oklch(0.278 0.033 256.848);
  --muted-foreground: oklch(0.707 0.022 261.325);
  --accent: oklch(0.278 0.033 256.848);
  --accent-foreground: oklch(0.985 0.002 247.839);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.21 0.034 264.665);
  --sidebar-foreground: oklch(0.985 0.002 247.839);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0.002 247.839);
  --sidebar-accent: oklch(0.278 0.033 256.848);
  --sidebar-accent-foreground: oklch(0.985 0.002 247.839);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}
```

</CodeCollapsibleWrapper>

### Slate

<CodeCollapsibleWrapper>

```css title="app/globals.css" showLineNumbers
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.129 0.042 264.695);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.129 0.042 264.695);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.129 0.042 264.695);
  --primary: oklch(0.208 0.042 265.755);
  --primary-foreground: oklch(0.984 0.003 247.858);
  --secondary: oklch(0.968 0.007 247.896);
  --secondary-foreground: oklch(0.208 0.042 265.755);
  --muted: oklch(0.968 0.007 247.896);
  --muted-foreground: oklch(0.554 0.046 257.417);
  --accent: oklch(0.968 0.007 247.896);
  --accent-foreground: oklch(0.208 0.042 265.755);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.929 0.013 255.508);
  --input: oklch(0.929 0.013 255.508);
  --ring: oklch(0.704 0.04 256.788);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.984 0.003 247.858);
  --sidebar-foreground: oklch(0.129 0.042 264.695);
  --sidebar-primary: oklch(0.208 0.042 265.755);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.968 0.007 247.896);
  --sidebar-accent-foreground: oklch(0.208 0.042 265.755);
  --sidebar-border: oklch(0.929 0.013 255.508);
  --sidebar-ring: oklch(0.704 0.04 256.788);
}

.dark {
  --background: oklch(0.129 0.042 264.695);
  --foreground: oklch(0.984 0.003 247.858);
  --card: oklch(0.208 0.042 265.755);
  --card-foreground: oklch(0.984 0.003 247.858);
  --popover: oklch(0.208 0.042 265.755);
  --popover-foreground: oklch(0.984 0.003 247.858);
  --primary: oklch(0.929 0.013 255.508);
  --primary-foreground: oklch(0.208 0.042 265.755);
  --secondary: oklch(0.279 0.041 260.031);
  --secondary-foreground: oklch(0.984 0.003 247.858);
  --muted: oklch(0.279 0.041 260.031);
  --muted-foreground: oklch(0.704 0.04 256.788);
  --accent: oklch(0.279 0.041 260.031);
  --accent-foreground: oklch(0.984 0.003 247.858);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.551 0.027 264.364);
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.208 0.042 265.755);
  --sidebar-foreground: oklch(0.984 0.003 247.858);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.984 0.003 247.858);
  --sidebar-accent: oklch(0.279 0.041 260.031);
  --sidebar-accent-foreground: oklch(0.984 0.003 247.858);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.551 0.027 264.364);
}
```

</CodeCollapsibleWrapper>
and ---
title: Next.js
description: Adding dark mode to your next app.
---

<Steps>

## Install next-themes

Start by installing next-themes:

```bash
npm install next-themes
```

## Create a theme provider

```tsx title="components/theme-provider.tsx" showLineNumbers
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

## Wrap your root layout

Add the ThemeProvider to your root layout and add the suppressHydrationWarning prop to the html tag.

```tsx {1,6,9-14,16} title="app/layout.tsx" showLineNumbers
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
```

## Add a mode toggle

Place a mode toggle on your site to toggle between light and dark mode.

<ComponentPreview name="mode-toggle" className="[&_.preview]:items-start" />

</Steps>
and ---
title: MCP Server
description: MCP support for registry developers
---

The [shadcn MCP server](/docs/mcp) works out of the box with any shadcn-compatible registry. You do not need to do anything special to enable MCP support for your registry.

---

## Prerequisites

The MCP server works by requesting your registry index. Make sure you have a registry item file at the root of your registry named registry.

For example, if your registry is hosted at https://acme.com/r/[name].json, you should have a file at https://acme.com/r/registry.json or https://acme.com/r/registry if you're using a JSON file extension.

This file must be a valid JSON file that conforms to the [registry schema](/docs/registry/registry-json).

---

## Configuring MCP

Ask your registry consumers to configure your registry in their components.json file and install the shadcn MCP server:

<Tabs defaultValue="claude">
  <TabsList>
    <TabsTrigger value="claude">Claude Code</TabsTrigger>
    <TabsTrigger value="cursor">Cursor</TabsTrigger>
    <TabsTrigger value="vscode">VS Code</TabsTrigger>
    <TabsTrigger value="codex">Codex</TabsTrigger>
  </TabsList>
  <TabsContent value="claude" className="mt-4">
    **Configure your registry** in your components.json file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```

    **Run the following command** in your project:

    ```bash
    npx shadcn@latest mcp init --client claude
    ```

    **Restart Claude Code** and try the following prompts:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

    **Note:** You can use /mcp command in Claude Code to debug the MCP server.

  </TabsContent>

  <TabsContent value="cursor" className="mt-4">
    **Configure your registry** in your components.json file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```
    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client cursor
       ```

    Open **Cursor Settings** and **Enable the MCP server** for shadcn. Then try the following prompts:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

  </TabsContent>

  <TabsContent value="vscode" className="mt-4">
    **Configure your registry** in your components.json file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```
    **Run the following command** in your project:
       ```bash
       npx shadcn@latest mcp init --client vscode
       ```

    Open .vscode/mcp.json and click **Start** next to the shadcn server. Then try the following prompts with GitHub Copilot:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

  </TabsContent>

  <TabsContent value="codex" className="mt-4">
    **Configure your registry** in your components.json file:

    ```json title="components.json" showLineNumbers
    {
      "registries": {
        "@acme": "https://acme.com/r/{name}.json"
      }
    }
    ```

    **Add the following configuration** to ~/.codex/config.toml:
       ```toml
       [mcp_servers.shadcn]
       command = "npx"
       args = ["shadcn@latest", "mcp"]
       ```

    **Restart Codex** and try the following prompts:
       - Show me the components in the acme registry
       - Create a landing page using items from the acme registry

  </TabsContent>
</Tabs>

You can read more about the MCP server in the [MCP documentation](/docs/mcp).

---

## Best Practices

Here are some best practices for MCP-compatible registries:

1. **Clear Descriptions**: Add concise, informative descriptions that help AI assistants understand what a registry item is for and how to use it.
2. **Proper Dependencies**: List all dependencies accurately so MCP can install them automatically.
3. **Registry Dependencies**: Use registryDependencies to indicate relationships between items.
4. **Consistent Naming**: Use kebab-case for component names and maintain consistency across your registry.
and ---
title: Add a Registry
description: Open Source Registry Index
---

The open source registry index is a list of all the open source registries that are available to use out of the box.

When you run shadcn add or shadcn search, the CLI will automatically check the registry index for the registry you are looking for and add it to your components.json file.

You can see the full list at [https://ui.shadcn.com/r/registries.json](https://ui.shadcn.com/r/registries.json).

## Adding a Registry

You can open an issue to add a registry to the index by filling out the [registry directory issue template](https://github.com/shadcn-ui/ui/issues/new?template=registry_directory.yml).

Once you have submitted your issue, it will be validated and reviewed by the team.

### Requirements

1. The registry must be open source and publicly accessible.
2. The registry must be a valid JSON file that conforms to the [registry schema specification](/docs/registry/registry-json).
3. The registry is expected to be a flat registry with no nested items i.e /registry.json and /component-name.json files are expected to be in the root of the registry.
4. The files array, if present, must NOT include a content property.

Here's an example of a valid registry:

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "login-form",
      "type": "registry:component",
      "title": "Login Form",
      "description": "A login form component.",
      "files": [
        {
          "path": "registry/new-york/auth/login-form.tsx",
          "type": "registry:component"
        }
      ]
    },
    {
      "name": "example-login-form",
      "type": "registry:component",
      "title": "Example Login Form",
      "description": "An example showing how to use the login form component.",
      "files": [
        {
          "path": "registry/new-york/examples/example-login-form.tsx",
          "type": "registry:component"
        }
      ]
    }
    }
  ]
}
```
and ---
title: registry.json
description: Schema for running your own component registry.
---

The registry.json schema is used to define your custom component registry.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "shadcn",
  "homepage": "https://ui.shadcn.com",
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "registryDependencies": [
        "button",
        "@acme/input-form",
        "https://example.com/r/foo"
      ],
      "dependencies": ["is-even@3.0.0", "motion"],
      "files": [
        {
          "path": "registry/new-york/hello-world/hello-world.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

## Definitions

You can see the JSON Schema for registry.json [here](https://ui.shadcn.com/schema/registry.json).

### $schema

The $schema property is used to specify the schema for the registry.json file.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json"
}
```

### name

The name property is used to specify the name of your registry. This is used for data attributes and other metadata.

```json title="registry.json" showLineNumbers
{
  "name": "acme"
}
```

### homepage

The homepage of your registry. This is used for data attributes and other metadata.

```json title="registry.json" showLineNumbers
{
  "homepage": "https://acme.com"
}
```

### items

The items in your registry. Each item must implement the [registry-item schema specification](https://ui.shadcn.com/schema/registry-item.json).

```json title="registry.json" showLineNumbers
{
  "items": [
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "registryDependencies": [
        "button",
        "@acme/input-form",
        "https://example.com/r/foo"
      ],
      "dependencies": ["is-even@3.0.0", "motion"],
      "files": [
        {
          "path": "registry/new-york/hello-world/hello-world.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

See the [registry-item schema documentation](/docs/registry/registry-item-json) for more information.
and ---
title: registry-item.json
description: Specification for registry items.
---

The registry-item.json schema is used to define your custom registry items.

```json title="registry-item.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "hello-world",
  "type": "registry:block",
  "title": "Hello World",
  "description": "A simple hello world component.",
  "registryDependencies": [
    "button",
    "@acme/input-form",
    "https://example.com/r/foo"
  ],
  "dependencies": ["is-even@3.0.0", "motion"],
  "files": [
    {
      "path": "registry/new-york/hello-world/hello-world.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/new-york/hello-world/use-hello-world.ts",
      "type": "registry:hook"
    }
  ],
  "cssVars": {
    "theme": {
      "font-heading": "Poppins, sans-serif"
    },
    "light": {
      "brand": "20 14.3% 4.1%"
    },
    "dark": {
      "brand": "20 14.3% 4.1%"
    }
  }
}
```

<div className="mt-6 flex items-center gap-2">
  <Link href="/docs/registry/examples">See more examples</Link>
</div>

## Definitions

You can see the JSON Schema for registry-item.json [here](https://ui.shadcn.com/schema/registry-item.json).

### $schema

The $schema property is used to specify the schema for the registry-item.json file.

```json title="registry-item.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json"
}
```

### name

The name of the item. This is used to identify the item in the registry. It should be unique for your registry.

```json title="registry-item.json" showLineNumbers
{
  "name": "hello-world"
}
```

### title

A human-readable title for your registry item. Keep it short and descriptive.

```json title="registry-item.json" showLineNumbers
{
  "title": "Hello World"
}
```

### description

A description of your registry item. This can be longer and more detailed than the title.

```json title="registry-item.json" showLineNumbers
{
  "description": "A simple hello world component."
}
```

### type

The type property is used to specify the type of your registry item. This is used to determine the type and target path of the item when resolved for a project.

```json title="registry-item.json" showLineNumbers
{
  "type": "registry:block"
}
```

The following types are supported:

| Type                 | Description                                      |
| -------------------- | ------------------------------------------------ |
| registry:block     | Use for complex components with multiple files.  |
| registry:component | Use for simple components.                       |
| registry:lib       | Use for lib and utils.                           |
| registry:hook      | Use for hooks.                                   |
| registry:ui        | Use for UI components and single-file primitives |
| registry:page      | Use for page or file-based routes.               |
| registry:file      | Use for miscellaneous files.                     |
| registry:style     | Use for registry styles. eg. new-york          |
| registry:theme     | Use for themes.                                  |
| registry:item      | Use for universal registry items.                |

### author

The author property is used to specify the author of the registry item.

It can be unique to the registry item or the same as the author of the registry.

```json title="registry-item.json" showLineNumbers
{
  "author": "John Doe <john@doe.com>"
}
```

### dependencies

The dependencies property is used to specify the dependencies of your registry item. This is for npm packages.

Use @version to specify the version of your registry item.

```json title="registry-item.json" showLineNumbers
{
  "dependencies": [
    "@radix-ui/react-accordion",
    "zod",
    "lucide-react",
    "name@1.0.2"
  ]
}
```

### registryDependencies

Used for registry dependencies. Can be names, namespaced or URLs.

- For shadcn/ui registry items such as button, input, select, etc use the name eg. ['button', 'input', 'select'].
- For namespaced registry items such as @acme use the name eg. ['@acme/input-form'].
- For custom registry items use the URL of the registry item eg. ['https://example.com/r/hello-world.json'].

```json title="registry-item.json" showLineNumbers
{
  "registryDependencies": [
    "button",
    "@acme/input-form",
    "https://example.com/r/editor.json"
  ]
}
```

Note: The CLI will automatically resolve remote registry dependencies.

### files

The files property is used to specify the files of your registry item. Each file has a path, type and target (optional) property.

**The target property is required for registry:page and registry:file types.**

```json title="registry-item.json" showLineNumbers
{
  "files": [
    {
      "path": "registry/new-york/hello-world/page.tsx",
      "type": "registry:page",
      "target": "app/hello/page.tsx"
    },
    {
      "path": "registry/new-york/hello-world/hello-world.tsx",
      "type": "registry:component"
    },
    {
      "path": "registry/new-york/hello-world/use-hello-world.ts",
      "type": "registry:hook"
    },
    {
      "path": "registry/new-york/hello-world/.env",
      "type": "registry:file",
      "target": "~/.env"
    }
  ]
}
```

#### path

The path property is used to specify the path to the file in your registry. This path is used by the build script to parse, transform and build the registry JSON payload.

#### type

The type property is used to specify the type of the file. See the [type](#type) section for more information.

#### target

The target property is used to indicate where the file should be placed in a project. This is optional and only required for registry:page and registry:file types.

By default, the shadcn cli will read a project's components.json file to determine the target path. For some files, such as routes or config you can specify the target path manually.

Use ~ to refer to the root of the project e.g ~/foo.config.js.

### tailwind

**DEPRECATED:** Use cssVars.theme instead for Tailwind v4 projects.

The tailwind property is used for tailwind configuration such as theme, plugins and content.

You can use the tailwind.config property to add colors, animations and plugins to your registry item.

```json title="registry-item.json" showLineNumbers
{
  "tailwind": {
    "config": {
      "theme": {
        "extend": {
          "colors": {
            "brand": "hsl(var(--brand))"
          },
          "keyframes": {
            "wiggle": {
              "0%, 100%": { "transform": "rotate(-3deg)" },
              "50%": { "transform": "rotate(3deg)" }
            }
          },
          "animation": {
            "wiggle": "wiggle 1s ease-in-out infinite"
          }
        }
      }
    }
  }
}
```

### cssVars

Use to define CSS variables for your registry item.

```json title="registry-item.json" showLineNumbers
{
  "cssVars": {
    "theme": {
      "font-heading": "Poppins, sans-serif"
    },
    "light": {
      "brand": "20 14.3% 4.1%",
      "radius": "0.5rem"
    },
    "dark": {
      "brand": "20 14.3% 4.1%"
    }
  }
}
```

### css

Use css to add new rules to the project's CSS file eg. @layer base, @layer components, @utility, @keyframes, @plugin, etc.

```json title="registry-item.json" showLineNumbers
{
  "css": {
    "@plugin @tailwindcss/typography": {},
    "@plugin foo": {},
    "@layer base": {
      "body": {
        "font-size": "var(--text-base)",
        "line-height": "1.5"
      }
    },
    "@layer components": {
      "button": {
        "background-color": "var(--color-primary)",
        "color": "var(--color-white)"
      }
    },
    "@utility text-magic": {
      "font-size": "var(--text-base)",
      "line-height": "1.5"
    },
    "@keyframes wiggle": {
      "0%, 100%": {
        "transform": "rotate(-3deg)"
      },
      "50%": {
        "transform": "rotate(3deg)"
      }
    }
  }
}
```

### envVars

Use envVars to add environment variables to your registry item.

```json title="registry-item.json" showLineNumbers
{
  "envVars": {
    "NEXT_PUBLIC_APP_URL": "http://localhost:4000",
    "DATABASE_URL": "postgresql://postgres:postgres@localhost:5432/postgres",
    "OPENAI_API_KEY": ""
  }
}
```

Environment variables are added to the .env.local or .env file. Existing variables are not overwritten.

<Callout>

**IMPORTANT:** Use envVars to add development or example variables. Do NOT use it to add production variables.

</Callout>

### docs

Use docs to show custom documentation or message when installing your registry item via the CLI.

```json title="registry-item.json" showLineNumbers
{
  "docs": "To get an OPENAI_API_KEY, sign up for an account at https://platform.openai.com."
}
```

### categories

Use categories to organize your registry item.

```json title="registry-item.json" showLineNumbers
{
  "categories": ["sidebar", "dashboard"]
}
```

### meta

Use meta to add additional metadata to your registry item. You can add any key/value pair that you want to be available to the registry item.

```json title="registry-item.json" showLineNumbers
{
  "meta": { "foo": "bar" }
}
```
and ---
title: Sonner
description: An opinionated toast component for React.
component: true
links:
  doc: https://sonner.emilkowal.ski
---

<ComponentPreview name="sonner-demo" />

## About

Sonner is built and maintained by [emilkowalski](https://twitter.com/emilkowalski).

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

<Steps>

<Step>Run the following command:</Step>

```bash
npx shadcn@latest add sonner
```

<Step>Add the Toaster component</Step>

```tsx title="app/layout.tsx" {1,9}
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  )
}
```

</Steps>

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install sonner next-themes
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="sonner" title="components/ui/sonner.tsx" />

<Step>Add the Toaster component</Step>

```tsx showLineNumbers title="app/layout.tsx" {1,8}
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  )
}
```

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import { toast } from "sonner"
```

```tsx
toast("Event has been created.")
```

## Examples

<ComponentPreview name="sonner-types" />

## Changelog

### 2025-10-13 Icons

We've updated the Sonner component to use icons from lucide. Update your sonner.tsx file to use the new icons.

```tsx showLineNumbers title="components/ui/sonner.tsx" {3-9,20-26}
"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
```
and ---
title: Data Table
description: Powerful table and datagrids built using TanStack Table.
component: true
links:
  doc: https://tanstack.com/table/v8/docs/introduction
---

<ComponentPreview name="data-table-demo" className="[&_.preview]:items-start" />

## Introduction

Every data table or datagrid I've created has been unique. They all behave differently, have specific sorting and filtering requirements, and work with different data sources.

It doesn't make sense to combine all of these variations into a single component. If we do that, we'll lose the flexibility that [headless UI](https://tanstack.com/table/v8/docs/introduction#what-is-headless-ui) provides.

So instead of a data-table component, I thought it would be more helpful to provide a guide on how to build your own.

We'll start with the basic <Table /> component and build a complex data table from scratch.

<Callout className="mt-4">

**Tip:** If you find yourself using the same table in multiple places in your app, you can always extract it into a reusable component.

</Callout>

## Table of Contents

This guide will show you how to use [TanStack Table](https://tanstack.com/table) and the <Table /> component to build your own custom data table. We'll cover the following topics:

- [Basic Table](#basic-table)
- [Row Actions](#row-actions)
- [Pagination](#pagination)
- [Sorting](#sorting)
- [Filtering](#filtering)
- [Visibility](#visibility)
- [Row Selection](#row-selection)
- [Reusable Components](#reusable-components)

## Installation

1. Add the <Table /> component to your project:

```bash
npx shadcn@latest add table
```

2. Add tanstack/react-table dependency:

```bash
npm install @tanstack/react-table
```

## Prerequisites

We are going to build a table to show recent payments. Here's what our data looks like:

```tsx showLineNumbers
type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
]
```

## Project Structure

Start by creating the following file structure:

```txt
app
└── payments
    ├── columns.tsx
    ├── data-table.tsx
    └── page.tsx
```

I'm using a Next.js example here but this works for any other React framework.

- columns.tsx (client component) will contain our column definitions.
- data-table.tsx (client component) will contain our <DataTable /> component.
- page.tsx (server component) is where we'll fetch data and render our table.

## Basic Table

Let's start by building a basic table.

<Steps>

### Column Definitions

First, we'll define our columns.

```tsx showLineNumbers title="app/payments/columns.tsx" {3,14-27}
"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
]
```

<Callout className="mt-4">

**Note:** Columns are where you define the core of what your table
will look like. They define the data that will be displayed, how it will be
formatted, sorted and filtered.

</Callout>

### <DataTable /> component

Next, we'll create a <DataTable /> component to render our table.

```tsx showLineNumbers title="app/payments/data-table.tsx"
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

<Callout>

**Tip**: If you find yourself using <DataTable /> in multiple places, this is the component you could make reusable by extracting it to components/ui/data-table.tsx.

<DataTable columns={columns} data={data} /> 

</Callout>

### Render the table

Finally, we'll render our table in our page component.

```tsx showLineNumbers title="app/payments/page.tsx" {22}
import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

</Steps>

## Cell Formatting

Let's format the amount cell to display the dollar amount. We'll also align the cell to the right.

<Steps>

### Update columns definition

Update the header and cell definitions for amount as follows:

```tsx showLineNumbers title="app/payments/columns.tsx" {4-15}
export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]
```

You can use the same approach to format other cells and headers.

</Steps>

## Row Actions

Let's add row actions to our table. We'll use a <Dropdown /> component for this.

<Steps>

### Update columns definition

Update our columns definition to add a new actions column. The actions cell returns a <Dropdown /> component.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,6-14,18-45}
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns: ColumnDef<Payment>[] = [
  // ...
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
  // ...
]
```

You can access the row data using row.original in the cell function. Use this to handle actions for your row eg. use the id to make a DELETE call to your API.

</Steps>

## Pagination

Next, we'll add pagination to our table.

<Steps>

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" {5,17}
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // ...
}
```

This will automatically paginate your rows into pages of 10. See the [pagination docs](https://tanstack.com/table/v8/docs/api/features/pagination) for more information on customizing page size and implementing manual pagination.

### Add pagination controls

We can add pagination controls to our table using the <Button /> component and the table.previousPage(), table.nextPage() API methods.

```tsx showLineNumbers title="app/payments/data-table.tsx" {1,15,21-39}
import { Button } from "@/components/ui/button"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          { // .... }
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

See [Reusable Components](#reusable-components) section for a more advanced pagination component.

</Steps>

## Sorting

Let's make the email column sortable.

<Steps>

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" showLineNumbers {3,6,10,18,25-28}
"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

### Make header cell sortable

We can now update the email header cell to add sorting controls.

```tsx showLineNumbers title="app/payments/columns.tsx" {4,9-19}
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]
```

This will automatically sort the table (asc and desc) when the user toggles on the header cell.

</Steps>

## Filtering

Let's add a search input to filter emails in our table.

<Steps>

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" {6,10,17,24-26,35-36,39,45-54}
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

Filtering is now enabled for the email column. You can add filters to other columns as well. See the [filtering docs](https://tanstack.com/table/v8/docs/guide/filters) for more information on customizing filters.

</Steps>

## Visibility

Adding column visibility is fairly simple using @tanstack/react-table visibility API.

<Steps>

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" {8,18-23,33-34,45,49,64-91}
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table.getColumn("email")?.getFilterValue() as string}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter(
                (column) => column.getCanHide()
              )
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>{ ... }</Table>
      </div>
    </div>
  )
}
```

This adds a dropdown menu that you can use to toggle column visibility.

</Steps>

## Row Selection

Next, we're going to add row selection to our table.

<Steps>

### Update column definitions

```tsx showLineNumbers title="app/payments/columns.tsx" {6,9-27}
"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
```

### Update <DataTable> 

```tsx showLineNumbers title="app/payments/data-table.tsx" {11,23,28}
export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table />
      </div>
    </div>
  )
}
```

This adds a checkbox to each row and a checkbox in the header to select all rows.

### Show selected rows

You can show the number of selected rows using the table.getFilteredSelectedRowModel() API.

```tsx
<div className="text-muted-foreground flex-1 text-sm">
  {table.getFilteredSelectedRowModel().rows.length} of{" "}
  {table.getFilteredRowModel().rows.length} row(s) selected.
</div>
```

</Steps>

## Reusable Components

Here are some components you can use to build your data tables. This is from the [Tasks](/examples/tasks) demo.

### Column header

Make any column header sortable and hideable.

<ComponentSource
  src="/app/(app)/examples/tasks/components/data-table-column-header.tsx"
  title="components/data-table-column-header.tsx"
/>

```tsx showLineNumbers {5}
export const columns = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
]
```

### Pagination

Add pagination controls to your table including page size and selection count.

<ComponentSource src="/app/(app)/examples/tasks/components/data-table-pagination.tsx" />

```tsx
<DataTablePagination table={table} />
```

### Column toggle

A component to toggle column visibility.

<ComponentSource src="/app/(app)/examples/tasks/components/data-table-view-options.tsx" />

```tsx
<DataTableViewOptions table={table} />
```
and ---
title: Button Group
description: A container that groups related buttons together with consistent styling.
component: true
---

<ComponentPreview name="button-group-demo" />

## Installation

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">CLI</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add button-group
```

</TabsContent>

<TabsContent value="manual">

<Steps>

<Step>Install the following dependencies:</Step>

```bash
npm install @radix-ui/react-slot
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource name="button-group" title="components/ui/button-group.tsx" />

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

```tsx
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
```

```tsx
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## Accessibility

- The ButtonGroup component has the role attribute set to group.
- Use <Kbd>Tab</Kbd> to navigate between the buttons in the group.
- Use aria-label or aria-labelledby to label the button group.

```tsx showLineNumbers
<ButtonGroup aria-label="Button group">
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

## ButtonGroup vs ToggleGroup

- Use the ButtonGroup component when you want to group buttons that perform an action.
- Use the ToggleGroup component when you want to group buttons that toggle a state.

## Examples

### Orientation

Set the orientation prop to change the button group layout.

<ComponentPreview name="button-group-orientation" />

### Size

Control the size of buttons using the size prop on individual buttons.

<ComponentPreview name="button-group-size" />

### Nested

Nest <ButtonGroup> components to create button groups with spacing.

<ComponentPreview name="button-group-nested" />

### Separator

The ButtonGroupSeparator component visually divides buttons within a group.

Buttons with variant outline do not need a separator since they have a border. For other variants, a separator is recommended to improve the visual hierarchy.

<ComponentPreview name="button-group-separator" />

### Split

Create a split button group by adding two buttons separated by a ButtonGroupSeparator.

<ComponentPreview name="button-group-split" />

### Input

Wrap an Input component with buttons.

<ComponentPreview name="button-group-input" />

### Input Group

Wrap an InputGroup component to create complex input layouts.

<ComponentPreview name="button-group-input-group" />

### Dropdown Menu

Create a split button group with a DropdownMenu component.

<ComponentPreview name="button-group-dropdown" />

### Select

Pair with a Select component.

<ComponentPreview name="button-group-select" />

### Popover

Use with a Popover component.

<ComponentPreview name="button-group-popover" />

## API Reference

### ButtonGroup

The ButtonGroup component is a container that groups related buttons together with consistent styling.

| Prop          | Type                         | Default        |
| ------------- | ---------------------------- | -------------- |
| orientation | "horizontal" \| "vertical" | "horizontal" |

```tsx
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

Nest multiple button groups to create complex layouts with spacing. See the [nested](#nested) example for more details.

```tsx
<ButtonGroup>
  <ButtonGroup />
  <ButtonGroup />
</ButtonGroup>
```

### ButtonGroupSeparator

The ButtonGroupSeparator component visually divides buttons within a group.

| Prop          | Type                         | Default      |
| ------------- | ---------------------------- | ------------ |
| orientation | "horizontal" \| "vertical" | "vertical" |

```tsx
<ButtonGroup>
  <Button>Button 1</Button>
  <ButtonGroupSeparator />
  <Button>Button 2</Button>
</ButtonGroup>
```

### ButtonGroupText

Use this component to display text within a button group.

| Prop      | Type      | Default |
| --------- | --------- | ------- |
| asChild | boolean | false |

```tsx
<ButtonGroup>
  <ButtonGroupText>Text</ButtonGroupText>
  <Button>Button</Button>
</ButtonGroup>
```

Use the asChild prop to render a custom component as the text, for example a label.

```tsx showLineNumbers
import { ButtonGroupText } from "@/components/ui/button-group"
import { Label } from "@/components/ui/label"

export function ButtonGroupTextDemo() {
  return (
    <ButtonGroup>
      <ButtonGroupText asChild>
        <Label htmlFor="name">Text</Label>
      </ButtonGroupText>
      <Input placeholder="Type something here..." id="name" />
    </ButtonGroup>
  )
}
```
and ---
title: Monorepo
description: Using shadcn/ui components and CLI in a monorepo.
---

Until now, using shadcn/ui in a monorepo was a bit of a pain. You could add
components using the CLI, but you had to manage where the components
were installed and manually fix import paths.

With the new monorepo support in the CLI, we've made it a lot easier to use
shadcn/ui in a monorepo.

The CLI now understands the monorepo structure and will install the components,
dependencies and registry dependencies to the correct paths and handle imports
for you.

## Getting started

<Steps>

### Create a new monorepo project

To create a new monorepo project, run the init command. You will be prompted
to select the type of project you are creating.

```bash
npx shadcn@latest init
```

Select the Next.js (Monorepo) option.

```bash
? Would you like to start a new project?
    Next.js
❯   Next.js (Monorepo)
```

This will create a new monorepo project with two workspaces: web and ui,
and [Turborepo](https://turbo.build/repo/docs) as the build system.

Everything is set up for you, so you can start adding components to your project.

Note: The monorepo uses React 19 and Tailwind CSS v4.

### Add components to your project

To add components to your project, run the add command **in the path of your app**.

```bash
cd apps/web
```

```bash
npx shadcn@latest add [COMPONENT]
```

The CLI will figure out what type of component you are adding and install the
correct files to the correct path.

For example, if you run npx shadcn@latest add button, the CLI will install the button component under packages/ui and update the import path for components in apps/web.

If you run npx shadcn@latest add login-01, the CLI will install the button, label, input and card components under packages/ui and the login-form component under apps/web/components.

### Importing components

You can import components from the @workspace/ui package as follows:

```tsx
import { Button } from "@workspace/ui/components/button"
```

You can also import hooks and utilities from the @workspace/ui package.

```tsx
import { useTheme } from "@workspace/ui/hooks/use-theme"
import { cn } from "@workspace/ui/lib/utils"
```

</Steps>

## File Structure

When you create a new monorepo project, the CLI will create the following file structure:

```txt
apps
└── web         # Your app goes here.
    ├── app
    │   └── page.tsx
    ├── components
    │   └── login-form.tsx
    ├── components.json
    └── package.json
packages
└── ui          # Your components and dependencies are installed here.
    ├── src
    │   ├── components
    │   │   └── button.tsx
    │   ├── hooks
    │   ├── lib
    │   │   └── utils.ts
    │   └── styles
    │       └── globals.css
    ├── components.json
    └── package.json
package.json
turbo.json
```

## Requirements

1. Every workspace must have a components.json file. A package.json file tells npm how to install the dependencies. A components.json file tells the CLI how and where to install components.

2. The components.json file must properly define aliases for the workspace. This tells the CLI how to import components, hooks, utilities, etc.

```json showLineNumbers title="apps/web/components.json"
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components"
  }
}
```

```json showLineNumbers title="packages/ui/components.json"
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@workspace/ui/components",
    "utils": "@workspace/ui/lib/utils",
    "hooks": "@workspace/ui/hooks",
    "lib": "@workspace/ui/lib",
    "ui": "@workspace/ui/components"
  }
}
```

3. Ensure you have the same style, iconLibrary and baseColor in both components.json files.

4. **For Tailwind CSS v4, leave the tailwind config empty in the components.json file.**

By following these requirements, the CLI will be able to install ui components, blocks, libs and hooks to the correct paths and handle imports for you.
and ---
title: Changelog
description: Latest updates and announcements.
toc: false
---

## December 2025 - npx shadcn create

From the very first commit, the goal of shadcn/ui was to make it customizable.

The idea is to give you solid defaults, spacing, color tokens, animations, accessibility, and then let you take it from there. Tweak the code. Add new components. Change the colors. Build your own version.

But somewhere along the way, all apps started looking the same. I guess the defaults were a little _too_ good. My bad.

Today, we're changing that: **npx shadcn create**.

Customize Everything. Pick your component library, icons, base color, theme, fonts and create your own version of shadcn/ui.

We're starting with **5 new visual styles,** designed to help your UI actually feel like _your_ UI.

- **Vega** – The classic shadcn/ui look.
- **Nova** – Reduced padding and margins for compact layouts.
- **Maia** – Soft and rounded, with generous spacing.
- **Lyra** – Boxy and sharp. Pairs well with mono fonts.
- **Mira** – Compact. Made for dense interfaces.

**This goes beyond theming**.

Your config doesn’t just change colors, it rewrites the component code to match your setup. Fonts, spacing, structure, even the libraries you use, everything adapts to your preferences.

The new CLI takes care of it all.

Start with a component library. Choose between Radix or Base UI.

We rebuilt every component for Base UI, keeping the same abstraction.
They are fully compatible with your existing components, even those pulled from remote registries.

When you pull down components, we auto-detect your library and apply the right transformations.

**It's time to build something that doesn't look like everything else.**

Now available for Next.js, Vite, TanStack Start and v0.

<Button asChild>
  <Link href="/create" className="mt-6 no-underline!">
    Get Started
  </Link>
</Button>

---

## November 2025 - Registry directory

We just published the Registry Directory: a list of code registries you can browse and pull code and components from.

https://ui.shadcn.com/docs/directory

Built into the CLI. No config required.

---

## October 2025 - New Components

For this round of components, I looked at what we build every day, the boring stuff we rebuild over and over, and made reusable abstractions you can actually use.

**These components work with every component library, Radix, Base UI, React Aria, you name it. Copy and paste to your projects.**

- [Spinner](#spinner): An indicator to show a loading state.
- [Kbd](#kbd): Display a keyboard key or group of keys.
- [Button Group](#button-group): A group of buttons for actions and split buttons.
- [Input Group](#input-group): Input with icons, buttons, labels and more.
- [Field](#field): One component. All your forms.
- [Item](#item): Display lists of items, cards, and more.
- [Empty](#empty): Use this one for empty states.

### Spinner

Okay let's start with the easiest ones: **Spinner** and **Kbd**. Pretty basic. We all know what they do.

Here's how you render a spinner:

```tsx
import { Spinner } from "@/components/ui/spinner"
```

```tsx
<Spinner />
```

Here's what it looks like:

<ComponentPreview
  name="spinner-basic"
  className="[&_.preview]:h-[250px] [&_pre]:!h-[250px]"
/>

Here's what it looks like in a button:

<ComponentPreview
  name="spinner-button"
  className="[&_.preview]:h-[250px] [&_pre]:!h-[250px]"
/>

You can edit the code and replace it with your own spinner.

<ComponentPreview
  name="spinner-custom"
  className="[&_.preview]:h-[250px] [&_pre]:!h-[250px]"
/>

### Kbd

Kbd is a component that renders a keyboard key.

```tsx
import { Kbd, KbdGroup } from "@/components/ui/kbd"
```

```tsx
<Kbd>Ctrl</Kbd>
```

Use KbdGroup to group keyboard keys together.

```tsx showLineNumbers
<KbdGroup>
  <Kbd>Ctrl</Kbd>
  <Kbd>B</Kbd>
</KbdGroup>
```

<ComponentPreview
  name="kbd-demo"
  className="[&_.preview]:h-[250px] [&_pre]:!h-[250px]"
/>

You can add it to buttons, tooltips, input groups, and more.

### Button Group

I got a lot of requests for this one: Button Group. It's a container that groups related buttons together with consistent styling. Great for action groups, split buttons, and more.

<ComponentPreview
  name="button-group-demo"
  className="[&_.preview]:h-[250px] [&_pre]:!h-[250px]"
/>

Here's the code:

```tsx
import { ButtonGroup } from "@/components/ui/button-group"
```

```tsx showLineNumbers
<ButtonGroup>
  <Button>Button 1</Button>
  <Button>Button 2</Button>
</ButtonGroup>
```

You can nest button groups to create more complex layouts with spacing.

```tsx showLineNumbers
<ButtonGroup>
  <ButtonGroup>
    <Button>Button 1</Button>
    <Button>Button 2</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button>Button 3</Button>
    <Button>Button 4</Button>
  </ButtonGroup>
</ButtonGroup>
```

Use ButtonGroupSeparator to create split buttons. Classic dropdown pattern.

<ComponentPreview
  name="button-group-dropdown"
  className="[&_.preview]:h-[250px] [&_pre]:!h-[250px]"
/>

You can also use it to add prefix or suffix buttons and text to inputs.

<ComponentPreview
  name="button-group-select"
  className="[&_.preview]:h-[250px] [&_pre]:!h-[250px]"
/>

```tsx showLineNumbers
<ButtonGroup>
  <ButtonGroupText>Prefix</ButtonGroupText>
  <Input placeholder="Type something here..." />
  <Button>Button</Button>
</ButtonGroup>
```

### Input Group

Input Group lets you add icons, buttons, and more to your inputs. You know, all those little bits you always need around your inputs.

```tsx
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
```

```tsx showLineNumbers
<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
</InputGroup>
```

Here's a preview with icons:

<ComponentPreview
  name="input-group-icon"
  className="[&_.preview]:h-[300px] [&_pre]:!h-[300px]"
/>

You can also add buttons to the input group.

<ComponentPreview
  name="input-group-button"
  className="[&_.preview]:h-[300px] [&_pre]:!h-[300px]"
/>

Or text, labels, tooltips,...

<ComponentPreview
  name="input-group-text"
  className="[&_.preview]:h-[350px] [&_pre]:!h-[350px]"
/>

It also works with textareas so you can build really complex components with lots of knobs and dials or yet another prompt form.

<ComponentPreview
  name="input-group-textarea"
  className="[&_.preview]:h-[450px] [&_pre]:!h-[450px]"
/>

Oh here are some cool ones with spinners:

<ComponentPreview
  name="input-group-spinner"
  className="[&_.preview]:h-[350px] [&_pre]:!h-[350px]"
/>

### Field

Introducing **Field**, a component for building really complex forms. The abstraction here is beautiful.

It took me a long time to get it right but I made it work with all your form libraries: Server Actions, React Hook Form, TanStack Form, Bring Your Own Form.

```tsx
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
```

Here's a basic field with an input:

```tsx showLineNumbers
<Field>
  <FieldLabel htmlFor="username">Username</FieldLabel>
  <Input id="username" placeholder="Max Leiter" />
  <FieldDescription>
    Choose a unique username for your account.
  </FieldDescription>
</Field>
```

<ComponentPreview
  name="field-input"
  className="[&_.preview]:h-[350px] [&_pre]:!h-[350px]"
/>

It works with all form controls. Inputs, textareas, selects, checkboxes, radios, switches, sliders, you name it. Here's a full example:

<ComponentPreview
  name="field-demo"
  className="[&_.preview]:h-[850px] [&_pre]:!h-[850px]"
/>

Here are some checkbox fields:

<ComponentPreview
  name="field-checkbox"
  className="[&_.preview]:h-[500px] [&_pre]:!h-[500px]"
/>

You can group fields together using FieldGroup and FieldSet. Perfect for
multi-section forms.

```tsx showLineNumbers
<FieldSet>
  <FieldLegend />
  <FieldGroup>
    <Field />
    <Field />
  </FieldGroup>
</FieldSet>
```

<ComponentPreview
  name="field-fieldset"
  className="[&_.preview]:h-[500px] [&_pre]:!h-[500px]"
/>

Making it responsive is easy. Use orientation="responsive" and it switches
between vertical and horizontal layouts based on container width. Done.

<ComponentPreview
  name="field-responsive"
  className="[&_.preview]:h-[600px] [&_pre]:!h-[600px]"
/>

Wait here's more. Wrap your fields in FieldLabel to create a selectable field group. Really easy. And it looks great.

<ComponentPreview
  name="field-choice-card"
  className="[&_.preview]:h-[600px] [&_pre]:!h-[600px]"
/>

### Item

This one is a straightforward flex container that can house nearly any type of content.

I've built this so many times that I decided to create a component for it. Now I use it all the time. I use it to display lists of items, cards, and more.

```tsx
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
```

Here's a basic item:

```tsx showLineNumbers
<Item>
  <ItemMedia variant="icon">
    <HomeIcon />
  </ItemMedia>
  <ItemContent>
    <ItemTitle>Dashboard</ItemTitle>
    <ItemDescription>Overview of your account and activity.</ItemDescription>
  </ItemContent>
</Item>
```

<ComponentPreview
  name="item-demo"
  className="[&_.preview]:h-[300px] [&_.preview]:p-4 [&_pre]:!h-[300px]"
/>

You can add icons, avatars, or images to the item.

<ComponentPreview
  name="item-icon"
  className="[&_.preview]:h-[300px] [&_.preview]:p-4 [&_pre]:!h-[300px]"
/>

<ComponentPreview
  name="item-avatar"
  className="[&_.preview]:h-[300px] [&_.preview]:p-4 [&_pre]:!h-[300px]"
/>

And here's what a list of items looks like with ItemGroup:

<ComponentPreview
  name="item-group"
  className="[&_.preview]:h-[500px] [&_.preview]:p-4 [&_pre]:!h-[500px]"
/>

Need it as a link? Use the asChild prop:

```tsx showLineNumbers
<Item asChild>
  <a href="/dashboard">
    <ItemMedia variant="icon">
      <HomeIcon />
    </ItemMedia>
    <ItemContent>
      <ItemTitle>Dashboard</ItemTitle>
      <ItemDescription>Overview of your account and activity.</ItemDescription>
    </ItemContent>
  </a>
</Item>
```

<ComponentPreview
  name="item-link"
  className="[&_.preview]:h-[400px] [&_.preview]:p-4 [&_pre]:!h-[400px]"
/>

### Empty

Okay last one: **Empty**. Use this to display empty states in your app.

```tsx
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
```

Here's how you use it:

```tsx showLineNumbers
<Empty>
  <EmptyMedia variant="icon">
    <InboxIcon />
  </EmptyMedia>
  <EmptyTitle>No messages</EmptyTitle>
  <EmptyDescription>You don't have any messages yet.</EmptyDescription>
  <EmptyContent>
    <Button>Send a message</Button>
  </EmptyContent>
</Empty>
```

<ComponentPreview
  name="empty-demo"
  className="[&_.preview]:h-[400px] [&_.preview]:p-4 [&_pre]:!h-[400px]"
/>

You can use it with avatars:

<ComponentPreview
  name="empty-avatar"
  className="[&_.preview]:h-[400px] [&_pre]:!h-[400px]"
/>

Or with input groups for things like search results or email subscriptions:

<ComponentPreview
  name="empty-input-group"
  className="[&_.preview]:h-[450px] [&_pre]:!h-[450px]"
/>

That's it. Seven new components. Works with all your libraries. Ready for your projects.

---

## September 2025 - Registry Index

We've created an index of open source registries that you can install items from.

You can search, view and add items from the registry index without configuring the .components.json file.

They'll be automatically added to your components.json file for you.

```bash
npx shadcn add @ai-elements/prompt-input
```

The full list of registries is available at [https://ui.shadcn.com/r/registries.json](https://ui.shadcn.com/r/registries.json).

To add a registry to the index, submit a PR to the shadcn/ui repository. See the [registry index documentation](/docs/registry/registry-index) for more details.

---

## August 2025 - shadcn CLI 3.0 and MCP Server

We just shipped shadcn CLI 3.0 with support for namespaced registries, advanced authentication, new commands and a completely rewritten registry engine.

### What's New

- [Namespaced Registries](#namespaced-registries) - Install components using @registry/name format.
- [Private Registries](#private-registries) - Secure your registry with advanced authentication.
- [Search & Discovery](#search--discovery) - New commands to find and view code before installing.
- [MCP Server](#mcp-server) - MCP server for all registries.
- [Faster Everything](#faster-everything) - Completely rewritten registry resolution.
- [Improved Error Handling](#improved-error-handling) - Better error messages for users and LLMs.
- [Upgrade Guide](#upgrade-guide) - Migration notes for existing users.

### Namespaced Registries

The biggest change in 3.0 is namespaced registries. You can now install components from registries: a community registry, your company's private registry or internal registry, using the @registry/name format.

This makes it easier to distribute code across teams and projects.

Configure registries in your components.json:

```json title="components.json"
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json",
    "@internal": {
      "url": "https://registry.company.com/{name}",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Then use the @registry/name format to install components:

```bash
npx shadcn add @acme/button @internal/auth-system
```

It's completely decentralized. There's no central registrar. Create any namespace you want and organize components however makes sense for your team.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@design": "https://registry.company.com/create/{name}.json",
    "@engineering": "https://registry.company.com/eng/{name}.json",
    "@marketing": "https://registry.company.com/marketing/{name}.json"
  }
}
```

Components can even depend on resources from different registries. Everything gets resolved and installed automatically from the right sources.

```json title="registry-item.json" showLineNumbers
{
  "name": "dashboard",
  "type": "registry:block",
  "registryDependencies": [
    "@shadcn/card", // From default registry
    "@v0/chart", // From v0 registry
    "@acme/data-table", // From acme registry
    "@lib/data-fetcher", // Utility library
    "@ai/analytics-prompt" // AI prompt resource
  ]
}
```

### Private Registries

Need to keep your components private? We've got you covered. Configure authentication with tokens, API keys, or custom headers:

```json title="components.json"
{
  "registries": {
    "@private": {
      "url": "https://registry.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Your private components stay private. Perfect for enterprise teams with proprietary UI libraries.

We support all major authentication methods: basic auth, bearer token, api key query params and custom headers.

See the [authentication docs](/docs/registry/authentication) for more details.

### Search & Discovery

Three new commands make it easy to find exactly what you need:

1. View items from the registry before installing

```bash
npx shadcn view @acme/auth-system
```

2. Search items from registries

```bash
npx shadcn search @tweakcn -q "dark"
```

3. List all items from a registry

```bash
npx shadcn list @acme
```

Preview components before installing them. Search across multiple registries. See the code and all dependencies upfront.

### MCP Server

<Image
  src="/images/mcp.jpeg"
  width="1432"
  height="1050"
  alt="Lift Mode"
  className="mt-6 w-full overflow-hidden rounded-lg border"
/>

Back in April, we [introduced](https://x.com/shadcn/status/1917597228513853603) the first version of the MCP server. Since then, we've taken everything we learned and built a better MCP server.

Here's what's new:

- Works with all registries. Zero config
- One command to add to your favorite MCP clients
- We improved the underlying tools
- Better integration with the CLI and registries
- Support for multiple registries in the same project

Add the MCP server to your project:

```bash
npx shadcn@latest mcp init
```

See the [docs](/docs/mcp) for more details.

### Faster Everything

We completely rewrote the registry resolution engine from scratch. It's faster, smarter, and handles even the trickiest dependency trees.

- Up to 3x faster dependency resolution
- Smarter file deduplication and merging
- Better monorepo support out of the box
- Updated build command for registry authors

### Improved Error Handling

Registry developers can now provide custom error messages to help guide users (and LLMs) when things go wrong. The CLI displays helpful, actionable errors for common issues:

```txt
Unknown registry "@acme". Make sure it is defined in components.json as follows:
{
  "registries": {
    "@acme": "[URL_TO_REGISTRY]"
  }
}
```

Missing environment variables? The CLI tells you exactly what's needed:

```txt
Registry "@private" requires the following environment variables:
  • REGISTRY_TOKEN

Set the required environment variables to your .env or .env.local file.
```

Registry authors can provide custom error messages in their responses to help users and AI agents understand and fix issues quickly.

```txt
Error:
You are not authorized to access the item at http://example.com/r/component.

Message:
[Unauthorized] Your API key has expired. Renew it at https://example.com/api/renew-key.
```

### Upgrade Guide

Here's the best part: there are no breaking changes for users. Your existing components.json works exactly the same. All your installed components work exactly the same.

For developers, if you're using the programmatic APIs directly, we've deprecated a few functions in favor of better ones:

- fetchRegistry → getRegistry 
- resolveRegistryTree → resolveRegistryItems 
- Schema moved from shadcn/registry to shadcn/schema package

```diff
- import { registryItemSchema } from "shadcn/registry"
+ import { registryItemSchema } from "shadcn/schema"
```

That's it. Seriously. Everything else just works.

---

## July 2025 - Universal Registry Items

We've added support for universal registry items. This allows you to create registry items that can be distributed to any project i.e. no framework, no components.json, no tailwind, no react required.

This new registry item type unlocks a lot of new workflows. You can now distribute code, config, rules, docs, anything to any code project.

See the [docs](/docs/registry/examples) for more details and examples.

---

## July 2025 - Local File Support

The shadcn CLI now supports local files. Initialize projects and add components, themes, hooks, utils and more from local JSON files.

```bash
# Initialize a project from a local file
npx shadcn init ./template.json

# Add a component from a local file
npx shadcn add ./block.json
```

This feature enables powerful new workflows:

- **Zero setup** - No remote registries required
- **Faster development** - Test registry items locally before publishing
- **Enhanced workflow for agents and MCP** - Generate and run registry items locally
- **Private components** - Keep proprietary components local and private.

---

## June 2025 - radix-ui 

We've added a new command to migrate to the new radix-ui package. This command will replace all @radix-ui/react-* imports with radix-ui.

```bash
npx shadcn@latest migrate radix
```

It will automatically update all imports in your ui components and install radix-ui as a dependency.

```diff showLineNumbers title="components/ui/alert-dialog.tsx"
- import * as AlertDialogPrimitive from "@radix-ui/react-dialog"
+ import { AlertDialog as AlertDialogPrimitive } from "radix-ui"
```

Make sure to test your components and project after running the command.

**Note:** To update imports for newly added components, run the migration command again.

## June 2025 - Calendar Component

We've upgraded the Calendar component to the latest version of [React DayPicker](https://daypicker.dev).

This is a major upgrade and includes a lot of new features and improvements. We've also built a collection of 30+ calendar blocks that you can use to build your own calendar components.

See all calendar blocks in the [Blocks Library](/blocks/calendar) page.

<Image src="/images/calendar-2.png" alt="Calendar" width={676} height={895} />

To upgrade your project to the latest version of the Calendar component, see the [upgrade guide](/docs/components/calendar#upgrade-guide).

## May 2025 - New Site

We've upgraded [ui.shadcn.com](https://ui.shadcn.com) to Next.js 15.3 and Tailwind v4. The site now uses the upgraded new-york components.

We've also made some minor design updates to make the site faster and easier to navigate.

This upgrade unlocks a lot of new features that we're working on. More to come.

## April 2025 - MCP

We're working on zero-config MCP support for shadcn/ui registry. One command npx shadcn registry:mcp to make any registry mcp-compatible.

<Image
  src="/images/mcp.jpeg"
  width="1432"
  height="1050"
  alt="Lift Mode"
  className="mt-6 w-full overflow-hidden rounded-lg border"
/>

Learn more in the [thread here](https://x.com/shadcn/status/1917597228513853603).

## March 2025 - shadcn 2.5.0

We tagged shadcn 2.5.0 earlier this week. It comes with a pretty cool feature: **resolve anywhere**.

Registries can now place files anywhere in an app and we'll properly resolve imports. No need to stick to a fixed file structure. It can even add files outside the registry itself.

On install, we track all files and perform a multi-pass resolution to correctly handle imports and aliases. It's fast.

## March 2025 - Cross-framework Route Support

The shadcn CLI can now auto-detect your framework and adapts routes for you.

Works with all frameworks including Laravel, Vite and React Router.

## February 2025 - Tailwind v4

We shipped the first preview of Tailwind v4 and React 19. Ready for you to try out. You can start using it today.

What's New:

- The CLI can now initialize projects with Tailwind v4.
- Full support for the new @theme directive and @theme inline option.
- All components are updated for Tailwind v4 and React 19.
- We've removed the forwardRefs and adjusted the types.
- Every primitive now has a data-slot attribute for styling.
- We've fixed and cleaned up the style of the components.
- We're deprecating the toast component in favor of sonner.
- Buttons now use the default cursor.
- We're deprecating the default style. New projects will use new-york.
- HSL colors are now converted to OKLCH.

Read more in the [docs](/docs/tailwind-v4).

## February 2025 - Updated Registry Schema

We're updating the registry schema to support more features.

Define code as a flat JSON file and distribute it via the CLI.

- Custom styles: bring your own design system, components & tokens
- Extend, override, mix & match components from third-party registries and LLMs
- Install themes, CSS vars, hooks, animations, and Tailwind layers & utilities

## January 2025 - Blocks

We are inviting the community to contribute to the blocks library. Share your components and blocks with other developers and help build a library of high-quality, reusable components.

We'd love to see all types of blocks: applications, marketing, products, and more.

See the [docs](/docs/blocks) page to get started.

## December 2024 - Monorepo Support

Until now, using shadcn/ui in a monorepo was a bit of a pain. You could add
components using the CLI, but you had to manage where the components
were installed and manually fix import paths.

With the new monorepo support in the CLI, we've made it a lot easier to use
shadcn/ui in a monorepo.

The CLI now understands the monorepo structure and will install the components,
dependencies and registry dependencies to the correct paths and handle imports
for you.

Read more in the [docs](/docs/monorepo).

## November 2024 - Icons

An update on icons. The new-york style now uses Lucide as the default icon set.

- New projects will use Lucide by default
- No breaking changes for existing projects
- Use the CLI to (optionally) migrate primitives to Lucide

For more info on why we're doing this, see the [thread](https://x.com/shadcn/status/1853902179041702169).

## October 2024 - React 19

shadcn/ui is now compatible with React 19 and Next.js 15.

We published a guide to help you upgrade your project to React 19.

Read more [here](/docs/react-19).

## October 2024 - Sidebar

Introducing sidebar.tsx: 25 components to help you build all kinds of sidebars.

I don't like building sidebars. So I built 30+ of them. All types. Then simplified the core into sidebar.tsx: a strong foundation to build on top of.

It works with Next.js, Remix, Vite & Laravel.

See the announcement [here](https://x.com/shadcn/status/1847359896557408461).

## August 2024 - npx shadcn init

The new CLI is now available. It's a complete rewrite with a lot of new features and improvements. You can now install components, themes, hooks, utils and more using npx shadcn add.

This is a major step towards distributing code that you and your LLMs can access and use.

1. First up, the cli now has support for all major React framework out of the box. Next.js, Remix, Vite and Laravel. And when you init into a new app, we update your existing Tailwind files instead of overriding.
2. A component now ship its own dependencies. Take the accordion for example, it can define its Tailwind keyframes. When you add it to your project, we'll update your tailwind.config.ts file accordingly.
3. You can also install remote components using url. `npx shadcn add https://acme.com/registry/navbar.json`.
4. We have also improve the init command. It does framework detection and can even init a brand new Next.js app in one command. npx shadcn init.
5. We have created a new schema that you can use to ship your own component registry. And since it has support for urls, you can even use it to distribute private components.
6. And a few more updates like better error handling and monorepo support.

You can try the new cli today.

```bash
npx shadcn init sidebar-01 login-01
```

### Update Your Project

To update an existing project to use the new CLI, update your components.json file to include import aliases for your **components**, **utils**, **ui**, **lib** and **hooks**.

```json showLineNumbers {7-13} title="components.json"
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tailwind": {
    // ...
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

If you're using a different import alias prefix eg ~, replace @ with your prefix.

## April 2024 - Introducing Lift Mode

We're introducing a new mode for [Blocks](/blocks) called **Lift Mode**.

Enable Lift Mode to automatically "lift" smaller components from a block template for copy and paste.

<a href="/blocks">
  <Image
    src="/images/lift-mode-light.png"
    width="1432"
    height="1050"
    alt="Lift Mode"
    className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
  />
  <Image
    src="/images/lift-mode-dark.png"
    width="1432"
    height="1069"
    alt="Lift Mode"
    className="mt-6 hidden w-full overflow-hidden rounded-lg border shadow-sm dark:block"
  />
  <span className="sr-only">View the blocks library</span>
</a>

With Lift Mode, you'll be able to copy the smaller components that make up a block template, like cards, buttons, and forms, and paste them directly into your project.

Visit the [Blocks](/blocks) page to try it out.

## March 2024 - Introducing Blocks

One of the most requested features since launch has been layouts: admin dashboards with sidebar, marketing page sections, cards and more.

**Today, we're launching [**Blocks**](/blocks)**.

<a href="/blocks">
  <Image
    src="/images/dashboard-1.jpg"
    width="716"
    height="430"
    alt="Admin dashboard"
    className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
  />
  <Image
    src="/images/dashboard-1-dark.jpg"
    width="716"
    height="430"
    alt="Admin dashboard"
    className="mt-6 hidden w-full overflow-hidden rounded-lg border shadow-sm dark:block"
  />
  <span className="sr-only">View the blocks library</span>
</a>

Blocks are ready-made components that you can use to build your apps. They are fully responsive, accessible, and composable, meaning they are built using the same principles as the rest of the components in shadcn/ui.

We're starting with dashboard layouts and authentication pages, with plans to add more blocks in the coming weeks.

### Open Source

Blocks are open source. You can find the source on GitHub. Use them in your projects, customize them and contribute back.

<a href="/blocks">
  <Image
    src="/images/dashboard-2.jpg"
    width="716"
    height="420"
    alt="AI Playground"
    className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
  />
  <Image
    src="/images/dashboard-2-dark.jpg"
    width="716"
    height="420"
    alt="AI Playground"
    className="mt-6 hidden w-full overflow-hidden rounded-lg border shadow-sm dark:block"
  />
  <span className="sr-only">View the blocks library</span>
</a>

### Request a Block

We're also introducing a "Request a Block" feature. If there's a specific block you'd like to see, simply create a request on GitHub and the community can upvote and build it.

<a href="/blocks">
  <Image
    src="/images/dashboard-3.jpg"
    width="716"
    height="420"
    alt="Settings Page"
    className="mt-6 w-full overflow-hidden rounded-lg border dark:hidden"
  />
  <Image
    src="/images/dashboard-3-dark.jpg"
    width="716"
    height="420"
    alt="Settings Page"
    className="mt-6 hidden w-full overflow-hidden rounded-lg border shadow-sm dark:block"
  />
  <span className="sr-only">View the blocks library</span>
</a>

### v0

If you have a [v0](https://v0.dev) account, you can use the **Edit in v0** feature to open the code on v0 for prompting and further generation.

<div className="bg-background mt-6 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border shadow-sm">
  <svg
    viewBox="0 0 40 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-foreground h-40 w-40"
  >
    <path
      d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
      fill="currentColor"
    ></path>
    <path
      d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
      fill="currentColor"
    ></path>
  </svg>
</div>

That's it. _Looking forward to seeing what you build with Blocks_.

## March 2024 - Breadcrumb and Input OTP

We've added a new Breadcrumb component and an Input OTP component.

### Breadcrumb

An accessible and flexible breadcrumb component. It has support for collapsed items, custom separators, bring-your-own routing <Link /> and composable with other shadcn/ui components.

<ComponentPreview name="breadcrumb-demo" />

[See more examples](/docs/components/breadcrumb)

### Input OTP

A fully featured input OTP component. It has support for numeric and alphanumeric codes, custom length, copy-paste and accessible. Input OTP is built on top of [input-otp](https://github.com/guilhermerodz/input-otp) by [@guilherme_rodz](https://twitter.com/guilherme_rodz).

<ComponentPreview name="input-otp-demo" />

[Read the docs](/docs/components/input-otp)

If you have a [v0](https://v0.dev), the new components are available for generation.

## December 2023 - New components, CLI and more

We've added new components to shadcn/ui and made a lot of improvements to the CLI.

Here's a quick overview of what's new:

- [**Carousel**](#carousel) - A carousel component with motion, swipe gestures and keyboard support.
- [**Drawer**](#drawer) - A drawer component that looks amazing on mobile.
- [**Pagination**](#pagination) - A pagination component with page navigation, previous and next buttons.
- [**Resizable**](#resizable) - A resizable component for building resizable panel groups and layouts.
- [**Sonner**](#sonner) - The last toast component you'll ever need.
- [**CLI updates**](#cli-updates) - Support for custom **Tailwind prefix** and tailwind.config.ts.

### Carousel

We've added a fully featured carousel component with motion, swipe gestures and keyboard support. Built on top of [Embla Carousel](https://www.embla-carousel.com).

It has support for infinite looping, autoplay, vertical orientation, and more.

<ComponentPreview name="carousel-demo" />

### Drawer

Oh the drawer component 😍. Built on top of [Vaul](https://github.com/emilkowalski/vaul) by [emilkowalski](https://twitter.com/emilkowalski).

Try opening the following drawer on mobile. It looks amazing!

<ComponentPreview name="drawer-demo" />

### Pagination

We've added a pagination component with page navigation, previous and next buttons. Simple, flexible and works with your framework's <Link /> component.

<ComponentPreview name="pagination-demo" />

### Resizable

Build resizable panel groups and layouts with this <Resizable /> component.

<ComponentPreview name="resizable-demo-with-handle" />

<Resizable /> is built using [react-resizable-panels](https://github.com/bvaughn/react-resizable-panels) by [bvaughn](https://github.com/bvaughn). It has support for mouse, touch and keyboard.

### Sonner

Another one by [emilkowalski](https://twitter.com/emilkowalski). The last toast component you'll ever need. Sonner is now availabe in shadcn/ui.

<ComponentPreview name="sonner-demo" />

### CLI updates

This has been one of the most requested features. You can now configure a custom Tailwind prefix and the cli will automatically prefix your utility classes when adding components.

This means you can now easily add shadcn/ui components to existing projects like Docusaurus, Nextra...etc. A drop-in for your existing design system with no conflict. 🔥

```tsx /tw-/
<AlertDialog className="tw-grid tw-gap-4 tw-border tw-bg-background tw-shadow-lg" />
```

It works with cn, cva and CSS variables.

The cli can now also detect tailwind.config.ts and add the TypeScript version of the config for you.

That's it. Happy Holidays.

## July 2023 - JavaScript

This project and the components are written in TypeScript. **We recommend using TypeScript for your project as well**.

However we provide a JavaScript version of the components, available via the [cli](/docs/cli).

```txt
Would you like to use TypeScript (recommended)? no
```

To opt-out of TypeScript, you can use the tsx flag in your components.json file.

```json {10} title="components.json" showLineNumbers
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "rsc": false,
  "tsx": false,
  "aliases": {
    "utils": "~/lib/utils",
    "components": "~/components"
  }
}
```

To configure import aliases, you can use the following jsconfig.json:

```json {4} title="jsconfig.json" showLineNumbers
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## June 2023 - New CLI, Styles and more

I have a lot of updates to share with you today:

- [**New CLI**](#new-cli) - Rewrote the CLI from scratch. You can now add components, dependencies and configure import paths.
- [**Theming**](#theming-with-css-variables-or-tailwind-colors) - Choose between using CSS variables or Tailwind CSS utility classes for theming.
- [**Base color**](#base-color) - Configure the base color for your project. This will be used to generate the default color palette for your components.
- [**React Server Components**](#react-server-components) - Opt out of using React Server Components. The CLI will automatically append or remove the use client directive.
- [**Styles**](#styles) - Introducing a new concept called _Style_. A style comes with its own set of components, animations, icons and more.
- [**Exit animations**](#exit-animations) - Added exit animations to all components.
- [**Other updates**](#other-updates) - New icon button size, updated sheet component and more.
- [**Updating your project**](#updating-your-project) - How to update your project to get the latest changes.

---

### New CLI

I've been working on a new CLI for the past few weeks. It's a complete rewrite. It comes with a lot of new features and improvements.

### init 

```bash
npx shadcn@latest init
```

When you run the init command, you will be asked a few questions to configure components.json:

```txt showLineNumbers
Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Where is your global CSS file? › › app/globals.css
Do you want to use CSS variables for colors? › no / yes
Where is your tailwind.config.js located? › tailwind.config.js
Configure the import alias for components: › @/components
Configure the import alias for utils: › @/lib/utils
Are you using React Server Components? › no / yes
```

This file contains all the information about your components: where to install them, the import paths, how they are styled...etc.

You can use this file to change the import path of a component, set a baseColor or change the styling method.

```json title="components.json" showLineNumbers
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "rsc": false,
  "aliases": {
    "utils": "~/lib/utils",
    "components": "~/components"
  }
}
```

This means you can now use the CLI with any directory structure including src and app directories.

### add 

```bash
npx shadcn@latest add
```

The add command is now much more capable. You can now add UI components but also import more complex components (coming soon).

The CLI will automatically resolve all components and dependencies, format them based on your custom config and add them to your project.

### diff (experimental)

```bash
npx shadcn diff
```

We're also introducing a new diff command to help you keep track of upstream updates.

You can use this command to see what has changed in the upstream repository and update your project accordingly.

Run the diff command to get a list of components that have updates available:

```bash
npx shadcn diff
```

```txt
The following components have updates available:
- button
  - /path/to/my-app/components/ui/button.tsx
- toast
  - /path/to/my-app/components/ui/use-toast.ts
  - /path/to/my-app/components/ui/toaster.tsx
```

Then run diff [component] to see the changes:

```bash
npx shadcn diff alert
```

```diff /pl-12/
const alertVariants = cva(
- "relative w-full rounded-lg border",
+ "relative w-full pl-12 rounded-lg border"
)
```

---

### Theming with CSS Variables or Tailwind Colors

You can choose between using CSS variables or Tailwind CSS utility classes for theming.

When you add new components, the CLI will automatically use the correct theming methods based on your components.json configuration.

#### Utility classes

```tsx /bg-zinc-950/ /text-zinc-50/ /dark:bg-white/ /dark:text-zinc-950/
<div className="bg-zinc-950 dark:bg-white" />
```

To use utility classes for theming set tailwind.cssVariables to false in your components.json file.

```json {6} title="components.json" showLineNumbers
{
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": false
  }
}
```

#### CSS Variables

```tsx /bg-background/ /text-foreground/
<div className="bg-background text-foreground" />
```

To use CSS variables classes for theming set tailwind.cssVariables to true in your components.json file.

```json {6} title="components.json" showLineNumbers
{
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  }
}
```

---

### Base color

You can now configure the base color for your project. This will be used to generate the default color palette for your components.

```json {5} title="components.json" showLineNumbers
{
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "zinc",
    "cssVariables": false
  }
}
```

Choose between gray, neutral, slate, stone or zinc.

If you have cssVariables set to true, we will set the base colors as CSS variables in your globals.css file. If you have cssVariables set to false, we will inline the Tailwind CSS utility classes in your components.

---

### React Server Components

If you're using a framework that does not support React Server Components, you can now opt out by setting rsc to false. We will automatically append or remove the use client directive when adding components.

```json title="components.json" showLineNumbers
{
  "rsc": false
}
```

---

### Styles

We are introducing a new concept called _Style_.

_You can think of style as the visual foundation: shapes, icons, animations & typography._ A style comes with its own set of components, animations, icons and more.

We are shipping two styles: default and new-york (with more coming soon).

<Image
  src="/images/style.jpg"
  width="716"
  height="402"
  alt="Default vs New York style"
  className="mt-6 overflow-hidden rounded-lg border"
/>

The default style is the one you are used to. It's the one we've been using since the beginning of this project. It uses lucide-react for icons and tailwindcss-animate for animations.

The new-york style is a new style. It ships with smaller buttons, cards with shadows and a new set of icons from [Radix Icons](https://icons.radix-ui.com).

When you run the init command, you will be asked which style you would like to use. This is saved in your components.json file.

```json title="components.json" showLineNumbers
{
  "style": "new-york"
}
```

### Theming

Start with a style as the base then theme using CSS variables or Tailwind CSS utility classes to completely change the look of your components.

<Image
  src="/images/style-with-theming.jpg"
  width="716"
  height="402"
  alt="Style with theming"
  className="mt-6 overflow-hidden rounded-lg border"
/>

---

### Exit animations

I added exit animations to all components. Click on the combobox below to see the subtle exit animation.

<ComponentPreview name="combobox-demo" className="[&_.preview]:items-start" />

The animations can be customized using utility classes.

---

### Other updates

### Button

- Added a new button size icon:

<ComponentPreview name="button-icon" />

### Sheet

- Renamed position to side to match the other elements.

<ComponentPreview name="sheet-side" />

- Removed the size props. Use className="w-[200px] md:w-[450px]" for responsive sizing.

---

### Updating your project

Since we follow a copy and paste approach, you will need to manually update your project to get the latest changes.

<Callout className="mt-4">
  Note: we are working on a [diff](#diff-experimental) command to help you
  keep track of upstream updates.
</Callout>

<Steps>

### Add components.json 

Creating a components.json file at the root:

```json title="components.json" showLineNumbers
{
  "style": "default",
  "rsc": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

Update the values for tailwind.css and aliases to match your project structure.

### Button

Add the icon size to the buttonVariants:

```tsx {7} title="components/ui/button.tsx" showLineNumbers
const buttonVariants = cva({
  variants: {
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
})
```

### Sheet

1. Replace the content of sheet.tsx with the following:

```tsx title="components/ui/sheet.tsx" showLineNumbers
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = ({
  className,
  ...props
}: SheetPrimitive.DialogPortalProps) => (
  <SheetPrimitive.Portal className={cn(className)} {...props} />
)
SheetPortal.displayName = SheetPrimitive.Portal.displayName

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-foreground text-lg font-semibold", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

2. Rename position to side 

```diff /position/ /side/
- <Sheet position="right" />
+ <Sheet side="right" />
```

</Steps>

### Thank you

I'd like to thank everyone who has been using this project, providing feedback and contributing to it. I really appreciate it. Thank you 🙏
