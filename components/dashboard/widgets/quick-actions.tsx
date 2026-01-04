'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { 
  RiAddLine, 
  RiScanLine, 
  RiFileTextLine, 
  RiSearchLine,
  RiArrowRightLine
} from '@remixicon/react'

interface QuickAction {
  icon: React.ElementType
  label: string
  href: string
  variant: 'primary' | 'secondary'
}

const actions: QuickAction[] = [
  {
    icon: RiAddLine,
    label: 'New Shipment',
    href: '/dashboard/shipments/new',
    variant: 'primary'
  },
  {
    icon: RiScanLine,
    label: 'Scan Package',
    href: '/dashboard/scanning',
    variant: 'secondary'
  },
  {
    icon: RiFileTextLine,
    label: 'Create Manifest',
    href: '/dashboard/manifests/new',
    variant: 'secondary'
  },
  {
    icon: RiSearchLine,
    label: 'Track AWB',
    href: '/dashboard/tracking',
    variant: 'secondary'
  }
]

interface QuickActionsProps {
  className?: string
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card className={cn('depth-surface noise-overlay border-none overflow-hidden', className)}>
      <CardHeader className='pb-3 border-b border-border/30 px-5'>
        <div className='flex flex-col gap-0.5'>
          <h3 className='text-xs font-bold uppercase tracking-[0.2em] text-foreground'>
            Quick Actions
          </h3>
          <p className='text-[9px] font-medium text-muted-foreground/50 uppercase tracking-wide'>
            Frequently used operations
          </p>
        </div>
      </CardHeader>
      <CardContent className='p-4 space-y-2'>
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.label}
              asChild
              variant='ghost'
              className={cn(
                'w-full justify-start h-11 px-4 group transition-all duration-200',
                action.variant === 'primary' 
                  ? 'bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/40' 
                  : 'hover:bg-muted/60 text-foreground/80 hover:text-foreground'
              )}
            >
              <Link href={action.href}>
                <Icon className={cn(
                  'size-4 mr-3 transition-transform group-hover:scale-110',
                  action.variant === 'primary' && 'text-primary'
                )} />
                <span className='text-[11px] font-bold uppercase tracking-wide flex-1 text-left'>
                  {action.label}
                </span>
                <RiArrowRightLine className='size-3.5 opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all' />
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
