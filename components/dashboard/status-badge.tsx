import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  scanned: { label: 'Scanned', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  'in-transit': { label: 'In Transit', className: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
  arrived: { label: 'Arrived', className: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' },
  delivered: { label: 'Delivered', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  delayed: { label: 'Delayed', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  cancelled: { label: 'Cancelled', className: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
  exception: { label: 'Exception', className: 'bg-red-500/10 text-red-500 border-red-500/20' }
} as const

type Status = keyof typeof statusConfig

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant='outline' className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
