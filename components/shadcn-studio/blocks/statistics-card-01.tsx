import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

import { cn } from '@/lib/utils'

type StatisticsCardProps = {
  icon: ReactNode
  value: string
  title: string
  changePercentage: string
  className?: string
}

const StatisticsCard = ({ icon, value, title, changePercentage, className }: StatisticsCardProps) => {
  const numericValue = parseFloat(changePercentage.replace(/[^\d.-]/g, ''))
  const isPositive = changePercentage.startsWith('+') || (!changePercentage.startsWith('-') && numericValue > 0)
  const isNeutral = numericValue === 0
  
  return (
    <Card className={cn('gap-4 overflow-hidden relative group glass-card border-none', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <CardHeader className='flex items-center relative z-10'>
        <div className='bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl shadow-lg shadow-primary/30'>
          {icon}
        </div>
        <span className='text-4xl font-bold tracking-tight text-foreground'>{value}</span>
      </CardHeader>
      <CardContent className='flex flex-col gap-2 relative z-10'>
        <span className='font-medium text-muted-foreground tracking-wide uppercase text-xs'>{title}</span>
        <p className='flex items-center gap-2'>
          <span 
            className={cn(
              'text-xs font-bold px-2 py-1 rounded-md border inline-flex items-center gap-1',
              isNeutral
                ? 'text-muted-foreground bg-muted/50 border-border'
                : isPositive 
                  ? 'text-success bg-success/10 border-success/20 shadow-sm shadow-success/20' 
                  : 'text-destructive bg-destructive/10 border-destructive/20 shadow-sm shadow-destructive/20'
            )}
            role="status"
            aria-label={`${isNeutral ? 'No change' : isPositive ? 'Increase of' : 'Decrease of'} ${changePercentage}`}
          >
            {!isNeutral && <span aria-hidden="true">{isPositive ? '↑' : '↓'}</span>}
            {changePercentage}
          </span>
          <span className='text-muted-foreground/70 text-xs'>vs last week</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
