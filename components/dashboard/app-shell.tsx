'use client'

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { AppHeader } from '@/components/dashboard/app-header'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="dashboard-scroll-container flex flex-col">
        <AppHeader />
        <main className="dashboard-main p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
