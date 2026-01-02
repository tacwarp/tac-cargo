import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ElementType } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ElementType
  trend?: {
    value: number
    isPositive: boolean
  }
  isActive?: boolean
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, isActive, className }: StatCardProps) {
  return (
    <Card className={cn(
      'depth-surface noise-overlay border-none overflow-hidden',
      isActive && 'ring-1 ring-primary/20',
      className
    )}>
      <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
        <CardTitle className='text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-80'>{title}</CardTitle>
        <div className={cn(
          "p-2 rounded-md",
          isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
        )}>
          <Icon className='size-3.5' />
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-3xl text-kpi'>{value}</div>
        {trend && (
          <div className='mt-3 flex items-center gap-2'>
            <div className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1',
              trend.isPositive ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
            )}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </div>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight opacity-60">Prev period</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
