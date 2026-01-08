"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface StatusChartProps {
  data: Record<string, number>;
  loading?: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--chart-3)",
  picked_up: "var(--chart-1)",
  in_transit: "var(--primary)",
  out_for_delivery: "var(--chart-4)",
  delivered: "var(--secondary)",
  cancelled: "var(--destructive)",
  exception: "var(--chart-5)",
};

export function StatusChart({ data, loading }: StatusChartProps) {
  const chartData = Object.entries(data || {}).map(([status, count]) => ({
    name: status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: count,
    status,
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted h-[300px] animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="var(--primary)"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.status] || "var(--muted-foreground)"}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
