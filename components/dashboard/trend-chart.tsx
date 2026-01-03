'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface TrendChartProps {
  data: Array<{
    date: string
    total: number
    delivered: number
    pending: number
  }>
  loading?: boolean
}

export function TrendChart({ data, loading }: TrendChartProps) {
  const formattedData = data?.map((item) => ({
    ...item,
    date: format(new Date(item.date), 'MMM dd'),
  }))

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>7-Day Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8b5cf6"
              strokeWidth={2}
              name="Total"
            />
            <Line
              type="monotone"
              dataKey="delivered"
              stroke="#10b981"
              strokeWidth={2}
              name="Delivered"
            />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Pending"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
