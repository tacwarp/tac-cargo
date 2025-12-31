'use client'

import { PageLayout } from '@/components/dashboard/page-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  PackageIcon,
  TruckIcon,
  DollarSignIcon,
  TrendingUpIcon,
  CalendarIcon
} from 'lucide-react'
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'

const monthlyData = [
  { month: 'Jan', shipments: 420, revenue: 125000 },
  { month: 'Feb', shipments: 380, revenue: 115000 },
  { month: 'Mar', shipments: 510, revenue: 145000 },
  { month: 'Apr', shipments: 475, revenue: 138000 },
  { month: 'May', shipments: 590, revenue: 168000 },
  { month: 'Jun', shipments: 620, revenue: 185000 },
  { month: 'Jul', shipments: 580, revenue: 172000 },
  { month: 'Aug', shipments: 640, revenue: 195000 },
  { month: 'Sep', shipments: 720, revenue: 215000 },
  { month: 'Oct', shipments: 680, revenue: 205000 },
  { month: 'Nov', shipments: 750, revenue: 225000 },
  { month: 'Dec', shipments: 820, revenue: 248000 }
]

const routeData = [
  { route: 'Delhi', shipments: 342 },
  { route: 'Mumbai', shipments: 285 },
  { route: 'Kolkata', shipments: 198 },
  { route: 'Chennai', shipments: 156 },
  { route: 'Bangalore', shipments: 134 },
  { route: 'Hyderabad', shipments: 112 }
]

export default function AnalyticsPage() {
  return (
    <PageLayout
      title='Analytics'
      description='Business insights and performance metrics'
      actions={
        <Button variant='outline'>
          <CalendarIcon className='mr-2 size-4' />
          Last 12 Months
        </Button>
      }
    >
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Shipments'
          value='7,185'
          icon={PackageIcon}
          trend={{ value: 15.3, isPositive: true }}
        />
        <StatCard
          title='Delivery Rate'
          value='98.5%'
          icon={TruckIcon}
          trend={{ value: 2.1, isPositive: true }}
        />
        <StatCard
          title='Total Revenue'
          value='₹21.36L'
          icon={DollarSignIcon}
          trend={{ value: 18.7, isPositive: true }}
        />
        <StatCard
          title='Avg. Transit Time'
          value='2.3 days'
          icon={TrendingUpIcon}
          trend={{ value: 5.2, isPositive: true }}
        />
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                  <XAxis dataKey='month' className='text-xs' />
                  <YAxis className='text-xs' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type='monotone'
                    dataKey='shipments'
                    stroke='hsl(var(--primary))'
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                  <XAxis dataKey='month' className='text-xs' />
                  <YAxis className='text-xs' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${(value / 1000).toFixed(0)}K`, 'Revenue']}
                  />
                  <Bar dataKey='revenue' fill='hsl(var(--primary))' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Routes by Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-[250px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={routeData} layout='vertical'>
                <CartesianGrid strokeDasharray='3 3' className='stroke-border' />
                <XAxis type='number' className='text-xs' />
                <YAxis dataKey='route' type='category' className='text-xs' width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey='shipments' fill='hsl(var(--chart-2))' radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
