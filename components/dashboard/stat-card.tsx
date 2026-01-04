import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ElementType } from 'react'
import { RiArrowUpLine, RiArrowDownLine } from '@remixicon/react'

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
  /** Hero variant for primary KPI spotlight */
  variant?: 'default' | 'hero' | 'compact'
  /** Optional subtitle for additional context */
  subtitle?: string
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  isActive, 
  className,
  variant = 'default',
  subtitle
}: StatCardProps) {
  
  if (variant === 'hero') {
    return (
      <Card className={cn(
        'depth-surface noise-overlay border-none overflow-hidden transition-all duration-500 group relative',
        'hover:shadow-2xl hover:shadow-primary/20',
        isActive && 'ring-2 ring-primary/40 shadow-xl shadow-primary/15',
        className
      )}>
        {/* Gradient accent bar */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-80' />
        
        <CardContent className='pt-8 pb-6 px-6'>
          <div className='flex items-start justify-between mb-6'>
            <div className={cn(
              "p-3 rounded-xl transition-all duration-300",
              isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40" 
                : "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110"
            )}>
              <Icon className='size-6' />
            </div>
            {trend && (
              <div className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold',
                trend.isPositive 
                  ? 'bg-success/15 text-success border border-success/20' 
                  : 'bg-destructive/15 text-destructive border border-destructive/20'
              )}>
                {trend.isPositive ? <RiArrowUpLine className='size-3.5' /> : <RiArrowDownLine className='size-3.5' />}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>
          
          <div className='space-y-2'>
            <p className='text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.25em]'>{title}</p>
            <p className='text-kpi text-5xl font-black tracking-tighter text-foreground'>{value}</p>
            {subtitle && (
              <p className='text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wide pt-1'>{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  if (variant === 'compact') {
    return (
      <Card className={cn(
        'depth-surface noise-overlay border-none overflow-hidden transition-all duration-300 group',
        'hover:ring-1 hover:ring-primary/20 hover:shadow-lg hover:shadow-primary/5',
        isActive && 'ring-1 ring-primary/30 shadow-md shadow-primary/10',
        className
      )}>
        <CardContent className='p-4 flex items-center gap-4'>
          <div className={cn(
            "p-2.5 rounded-lg transition-all duration-300 shrink-0",
            isActive
              ? "bg-primary/15 text-primary"
              : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
          )}>
            <Icon className='size-4' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] truncate'>{title}</p>
            <p className='text-kpi text-xl font-bold tracking-tight text-foreground'>{value}</p>
            {subtitle && (
              <p className='text-[8px] font-medium text-muted-foreground/40 uppercase tracking-wide truncate'>{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className={cn(
              'text-[10px] font-bold shrink-0',
              trend.isPositive ? 'text-success' : 'text-destructive'
            )}>
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn(
      'depth-surface noise-overlay border-none overflow-hidden transition-all duration-300 group relative',
      'hover:ring-1 hover:ring-primary/25 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-0.5',
      isActive && 'ring-2 ring-primary/30 shadow-lg shadow-primary/10',
      className
    )}>
      {/* Subtle top accent on active */}
      {isActive && (
        <div className='absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent' />
      )}
      
      <CardContent className='pt-5 pb-4 px-5'>
        <div className='flex items-start justify-between mb-4'>
          <p className='text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]'>{title}</p>
          <div className={cn(
            "p-2 rounded-lg transition-all duration-300",
            isActive 
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30" 
              : "bg-primary/5 text-primary/70 group-hover:bg-primary/15 group-hover:text-primary group-hover:scale-105"
          )}>
            <Icon className='size-4' />
          </div>
        </div>
        
        <div className='space-y-2'>
          <p className='text-kpi text-3xl font-bold tracking-tight text-foreground'>{value}</p>
          {trend && (
            <div className='flex items-center gap-2'>
              <span className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold',
                trend.isPositive 
                  ? 'bg-success/10 text-success' 
                  : 'bg-destructive/10 text-destructive'
              )}>
                {trend.isPositive ? <RiArrowUpLine className='size-3' /> : <RiArrowDownLine className='size-3' />}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-[9px] text-muted-foreground/50 font-medium uppercase tracking-wide">vs prev</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
