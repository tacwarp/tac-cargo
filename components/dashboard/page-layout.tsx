interface PageLayoutProps {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
}

export function PageLayout({ title, description, actions, children }: PageLayoutProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
          {description && <p className='mt-1 text-muted-foreground'>{description}</p>}
        </div>
        {actions && <div className='flex items-center gap-2'>{actions}</div>}
      </div>
      {children}
    </div>
  )
}
