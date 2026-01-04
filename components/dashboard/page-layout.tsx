import { cn } from '@/lib/utils'

interface PageLayoutProps {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  /** Optional badge/label next to title */
  badge?: React.ReactNode
  /** Compact mode reduces vertical spacing */
  compact?: boolean
}

export function PageLayout({ 
  title, 
  description, 
  actions, 
  children,
  badge,
  compact = false
}: PageLayoutProps) {
  return (
    <div className={cn('space-y-8', compact && 'space-y-5')}>
      {/* Premium Header Block */}
      <header className='relative'>
        {/* Subtle gradient accent line */}
        <div className='absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-gradient-to-b from-primary via-accent to-primary/50 opacity-80' />
        
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-1.5'>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-black tracking-tight text-foreground uppercase'>
                {title}
              </h1>
              {badge && (
                <span className='px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-primary/10 text-primary border border-primary/20 rounded-md'>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className='text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wide max-w-lg'>
                {description}
              </p>
            )}
          </div>
          
          {actions && (
            <div className='flex items-center gap-3 shrink-0'>
              {actions}
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content Area */}
      <div className='relative'>
        {children}
      </div>
    </div>
  )
}
