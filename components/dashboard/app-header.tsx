'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { BellIcon, SearchIcon, LanguagesIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import React from 'react'

import LanguageDropdown from '@/components/shadcn-studio/blocks/dropdown-language'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'

export function AppHeader() {
  const pathname = usePathname()
  const pathSegments = pathname.split('/').filter(Boolean)

  return (
    <header className='sticky top-0 z-50 flex h-16 items-center gap-4 border-b border-border bg-card px-6'>
      <SidebarTrigger className='[&_svg]:!size-5' />
      <Separator orientation='vertical' className='!h-4' />

      <Breadcrumb className='hidden sm:block'>
        <BreadcrumbList>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`
            const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ')

            return (
              <React.Fragment key={segment}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className='ml-auto flex items-center gap-2'>
        <Button variant='ghost' size='icon'>
          <SearchIcon className='size-4' />
        </Button>
        <Button variant='ghost' size='icon' className='relative'>
          <BellIcon className='size-4' />
          <span className='absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive' />
        </Button>

        <ThemeToggle />

        <LanguageDropdown
          trigger={
            <Button variant='ghost' size='icon'>
              <LanguagesIcon className='size-4' />
            </Button>
          }
        />

        <ProfileDropdown
          trigger={
            <Button variant='ghost' size='icon' className='size-9'>
              <Avatar className='size-8'>
                <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                <AvatarFallback>TC</AvatarFallback>
              </Avatar>
            </Button>
          }
        />
      </div>
    </header>
  )
}
