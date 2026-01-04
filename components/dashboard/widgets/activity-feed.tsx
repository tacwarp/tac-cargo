'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { 
  RiBox3Line, 
  RiTruckLine, 
  RiCheckboxCircleLine, 
  RiAlertLine,
  RiTimeLine 
} from '@remixicon/react'

interface ActivityItem {
  id: string
  type: 'shipment' | 'delivery' | 'alert' | 'transit' | 'pending'
  title: string
  description: string
  time: string
}

const activityData: ActivityItem[] = [
  {
    id: '1',
    type: 'delivery',
    title: 'Shipment Delivered',
    description: 'AWB #TAC-2024-8847 delivered to Mumbai Hub',
    time: '2 min ago'
  },
  {
    id: '2',
    type: 'shipment',
    title: 'New Booking',
    description: 'Express shipment created for ABC Corp',
    time: '8 min ago'
  },
  {
    id: '3',
    type: 'alert',
    title: 'Delay Alert',
    description: 'Flight AI-302 delayed affecting 12 shipments',
    time: '15 min ago'
  },
  {
    id: '4',
    type: 'transit',
    title: 'In Transit Update',
    description: 'Manifest MF-1247 departed from Delhi Hub',
    time: '23 min ago'
  },
  {
    id: '5',
    type: 'pending',
    title: 'Pending Pickup',
    description: '3 shipments awaiting pickup at Warehouse B',
    time: '45 min ago'
  }
]

const iconMap = {
  shipment: RiBox3Line,
  delivery: RiCheckboxCircleLine,
  alert: RiAlertLine,
  transit: RiTruckLine,
  pending: RiTimeLine
}

const colorMap = {
  shipment: 'text-primary bg-primary/10 border-primary/20',
  delivery: 'text-success bg-success/10 border-success/20',
  alert: 'text-destructive bg-destructive/10 border-destructive/20',
  transit: 'text-warning bg-warning/10 border-warning/20',
  pending: 'text-info bg-info/10 border-info/20'
}

interface ActivityFeedProps {
  className?: string
}

export function ActivityFeed({ className }: ActivityFeedProps) {
  return (
    <Card className={cn('depth-surface noise-overlay border-none overflow-hidden', className)}>
      <CardHeader className='pb-3 border-b border-border/30 px-5'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-0.5'>
            <h3 className='text-xs font-bold uppercase tracking-[0.2em] text-foreground'>
              Live Activity
            </h3>
            <p className='text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wide'>
              Real-time operations feed
            </p>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='relative flex h-2 w-2'>
              <span className='relative inline-flex rounded-full h-2 w-2 bg-muted-foreground/50' />
            </span>
            <span className='text-[9px] font-bold text-muted-foreground uppercase tracking-wide'>Static</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='divide-y divide-border/20'>
          {activityData.map((item) => {
            const Icon = iconMap[item.type]
            return (
              <div 
                key={item.id} 
                className='flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors group'
              >
                <div className={cn(
                  'p-2 rounded-lg border shrink-0 transition-transform group-hover:scale-105',
                  colorMap[item.type]
                )}>
                  <Icon className='size-3.5' />
                </div>
                <div className='flex-1 min-w-0 space-y-0.5'>
                  <p className='text-[11px] font-bold text-foreground truncate'>
                    {item.title}
                  </p>
                  <p className='text-[10px] text-muted-foreground/70 truncate'>
                    {item.description}
                  </p>
                </div>
                <span className='text-[9px] font-medium text-muted-foreground/40 uppercase tracking-wide shrink-0'>
                  {item.time}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
