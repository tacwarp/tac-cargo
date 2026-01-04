import { type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick?: () => void
    href?: string
  }
  variant?: 'default' | 'compact' | 'card'
  className?: string
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action,
  secondaryAction,
  variant = 'default',
  className
}: EmptyStateProps) {
  const isCompact = variant === 'compact'
  const isCard = variant === 'card'

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      isCompact ? 'py-8' : 'py-16',
      isCard && 'bg-card rounded-lg border border-border/50 p-8',
      className
    )}>
      <div className={cn(
        'mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20',
        isCompact ? 'p-3' : 'p-5'
      )}>
        <Icon className={cn(
          'text-primary/70',
          isCompact ? 'size-6' : 'size-10'
        )} />
      </div>
      <h3 className={cn(
        'mb-2 font-semibold text-foreground',
        isCompact ? 'text-base' : 'text-xl'
      )}>
        {title}
      </h3>
      <p className={cn(
        'max-w-md text-muted-foreground leading-relaxed',
        isCompact ? 'text-xs mb-4' : 'text-sm mb-6'
      )}>
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            action.href ? (
              <Button asChild size={isCompact ? 'sm' : 'default'}>
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ) : (
              <Button onClick={action.onClick} size={isCompact ? 'sm' : 'default'}>
                {action.label}
              </Button>
            )
          )}
          {secondaryAction && (
            secondaryAction.href ? (
              <Button variant="outline" asChild size={isCompact ? 'sm' : 'default'}>
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={secondaryAction.onClick} size={isCompact ? 'sm' : 'default'}>
                {secondaryAction.label}
              </Button>
            )
          )}
        </div>
      )}
    </div>
  )
}
