"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface TrendChartProps {
  data: Array<{
    date: string;
    total: number;
    delivered: number;
    pending: number;
  }>;
  loading?: boolean;
}

export function TrendChart({ data, loading }: TrendChartProps) {
  const formattedData = data?.map((item) => ({
    ...item,
    date: format(new Date(item.date), "MMM dd"),
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Trend</CardTitle>
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
        <CardTitle>7-Day Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Total"
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
            />
            <Line
              type="monotone"
              dataKey="delivered"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              name="Delivered"
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--success))" }}
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="hsl(var(--warning))"
              strokeWidth={2}
              name="Pending"
              dot={false}
              activeDot={{ r: 6, fill: "hsl(var(--warning))" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
