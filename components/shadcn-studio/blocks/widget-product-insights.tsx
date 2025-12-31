'use client'

import { Bar, BarChart } from 'recharts'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

const hubPerformanceData = [
  { month: 'January', onTime: 168 },
  { month: 'February', onTime: 305 },
  { month: 'March', onTime: 213 },
  { month: 'April', onTime: 330 },
  { month: 'May', onTime: 305 }
]

const hubPerformanceConfig = {
  onTime: {
    label: 'On-Time',
    color: 'var(--primary)'
  }
} satisfies ChartConfig

const bookingsChartData = [
  { month: 'January', bookings: 168 },
  { month: 'February', bookings: 305 },
  { month: 'March', bookings: 213 },
  { month: 'April', bookings: 330 },
  { month: 'May', bookings: 305 }
]

const bookingsChartConfig = {
  bookings: {
    label: 'Bookings',
    color: 'color-mix(in oklab, var(--primary) 10%, transparent)'
  }
} satisfies ChartConfig

const ProductInsightsCard = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('gap-4', className)}>
      <CardHeader className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <span className='text-lg font-semibold'>Hub Performance</span>
          <span className='text-muted-foreground text-sm'>Imphal Hub • May 2025</span>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src='https://cdn.shadcnstudio.com/ss-assets/blocks/dashboard-application/widgets/image-7.png'
          alt='Hub'
          className='w-20.5 rounded-md object-cover'
        />
      </CardHeader>
      <CardContent className='space-y-4'>
        <Separator />
        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-muted-foreground'>On-Time Deliveries</span>
            <span className='text-2xl font-semibold'>98.5%</span>
          </div>
          <ChartContainer config={hubPerformanceConfig} className='min-h-13 max-w-18'>
            <BarChart accessibilityLayer data={hubPerformanceData} barSize={8}>
              <Bar dataKey='onTime' fill='var(--color-onTime)' radius={2} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className='flex items-center justify-between gap-1'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-muted-foreground'>Total Bookings</span>
            <span className='text-2xl font-semibold'>2,123</span>
          </div>
          <ChartContainer config={bookingsChartConfig} className='min-h-13 max-w-18'>
            <BarChart accessibilityLayer data={bookingsChartData} barSize={8}>
              <Bar dataKey='bookings' fill='var(--color-bookings)' radius={2} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductInsightsCard
