import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Canonical KPI Card - CRITICAL RULE: Values are NEVER colorized
 * Only trends use semantic KPI tokens (kpi-positive/negative/neutral/warning)
 */

export type KPITrend = 'up' | 'down' | 'neutral' | 'warning'

export interface KPICardProps {
  label: string
  value: string | number
  trend?: KPITrend
  delta?: string
  icon?: ReactNode
  description?: string
  className?: string
}

const trendClasses: Record<KPITrend, string> = {
  up: 'text-kpi-positive',
  down: 'text-kpi-negative',
  neutral: 'text-kpi-neutral',
  warning: 'text-kpi-warning'
}

export function KPICard({ label, value, trend, delta, icon, description, className }: KPICardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-center gap-2">
        {icon && <div className="flex size-8 items-center justify-center rounded-lg bg-muted">{icon}</div>}
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {(delta || description) && (
        <div className="mt-3 flex items-center gap-3">
          {delta && trend && (
            <span className={cn('text-sm font-medium', trendClasses[trend])}>{delta}</span>
          )}
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </div>
      )}
    </Card>
  )
}

export function KPICardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-4', className)}>{children}</div>
}

