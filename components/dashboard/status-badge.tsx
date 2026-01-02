import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusConfig = {
  pending: { label: 'Pending', className: 'status-pending' },
  scanned: { label: 'Scanned', className: 'status-processing' },
  'in-transit': { label: 'In Transit', className: 'status-in-transit' },
  arrived: { label: 'Arrived', className: 'bg-info/10 text-info border-info/20 shadow-[0_0_10px_hsl(var(--info)/0.2)]' },
  delivered: { label: 'Delivered', className: 'status-delivered' },
  delayed: { label: 'Delayed', className: 'status-delayed' },
  cancelled: { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20 shadow-[0_0_10px_hsl(var(--destructive)/0.2)]' },
  exception: { label: 'Exception', className: 'status-delayed' },
  processing: { label: 'Processing', className: 'status-processing' }
} as const

type Status = keyof typeof statusConfig

interface StatusBadgeProps {
  status: Status
  className?: string
  pulse?: boolean
}

export function StatusBadge({ status, className, pulse = false }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge 
      variant='outline' 
      className={cn(
        config.className, 
        'font-medium',
        className
      )}
    >
      {pulse && (
        <span className="mr-1.5 relative flex h-2 w-2" role="status" aria-label="Status updating">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" aria-hidden="true"></span>
        </span>
      )}
      {config.label}
    </Badge>
  )
}
