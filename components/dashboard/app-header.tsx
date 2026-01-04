'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/dashboard/theme-toggle'
import { BellIcon, SearchIcon, LanguagesIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

import LanguageDropdown from '@/components/shadcn-studio/blocks/dropdown-language'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'

export function AppHeader() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  return (
    <header className='sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-border/30 bg-background/80 backdrop-blur-xl px-6'>
      <SidebarTrigger className='[&_svg]:!size-4 hover:bg-muted/50 transition-colors' />
      <Separator orientation='vertical' className='!h-4 bg-border/30' />

      <Breadcrumb className='hidden sm:block'>
        <BreadcrumbList className='gap-1.5'>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`
            const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

            return (
              <React.Fragment key={segment}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage className='text-[11px] font-bold uppercase tracking-wide text-foreground'>{title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href} className='text-[11px] font-medium uppercase tracking-wide text-muted-foreground/60 hover:text-foreground transition-colors'>{title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className='text-muted-foreground/30' />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className='ml-auto flex items-center gap-1'>
        <Button variant='ghost' size='icon' className='size-9 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all'>
          <SearchIcon className='size-4' />
        </Button>
        <Button variant='ghost' size='icon' className='size-9 relative hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all'>
          <BellIcon className='size-4' />
          <span className='absolute right-2 top-2 size-1.5 rounded-full bg-destructive animate-pulse' />
        </Button>

        <ThemeToggle />

        <LanguageDropdown
          trigger={
            <Button variant='ghost' size='icon' className='size-9 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all'>
              <LanguagesIcon className='size-4' />
            </Button>
          }
        />

        <Separator orientation='vertical' className='!h-4 bg-border/30 mx-1' />

        <ProfileDropdown
          trigger={
            <Button variant='ghost' size='icon' className='size-9 p-0 hover:ring-2 hover:ring-primary/20 transition-all rounded-full'>
              <Avatar className='size-8 ring-2 ring-border/30'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                <AvatarFallback className='text-[10px] font-bold'>TC</AvatarFallback>
              </Avatar>
            </Button>
          }
        />
      </div>
    </header>
  )
}
