'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  change?: {
    value: number
    isPositive: boolean
  }
  icon: LucideIcon
  variant?: 'default' | 'warning' | 'success' | 'danger'
  loading?: boolean
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  variant = 'default',
  loading = false,
}: KPICardProps) {
  const variantStyles = {
    default: 'bg-primary/10 text-primary',
    warning: 'bg-orange-500/10 text-orange-500',
    success: 'bg-green-500/10 text-green-500',
    danger: 'bg-red-500/10 text-red-500',
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-full', variantStyles[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 bg-muted animate-pulse rounded" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <p className="text-xs text-muted-foreground mt-1">
                <span
                  className={cn(
                    'font-medium',
                    change.isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {change.isPositive ? '+' : ''}
                  {change.value}%
                </span>{' '}
                from last period
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
