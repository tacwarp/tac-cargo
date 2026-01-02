"use client"

import * as React from "react"
import {
  RiDashboardLine,
  RiBarChartBoxLine,
  RiBox3Line,
  RiMapPinLine,
  RiTruckLine,
  RiQrScan2Line,
  RiArchiveLine,
  RiAlertLine,
  RiFileTextLine,
  RiMoneyDollarCircleLine,
  RiTeamLine,
  RiSettings4Line,
  RiCustomerService2Line,
  RiFeedbackLine,
} from "@remixicon/react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Navigation configuration
const navConfig = {
  overview: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: RiDashboardLine,
      isActive: true,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: RiBarChartBoxLine,
    },
  ],
  operations: [
    {
      title: "Shipments",
      url: "/dashboard/shipments",
      icon: RiBox3Line,
    },
    {
      title: "Tracking",
      url: "/dashboard/tracking",
      icon: RiMapPinLine,
    },
    {
      title: "Manifests",
      url: "/dashboard/manifests",
      icon: RiTruckLine,
    },
    {
      title: "Scanning",
      url: "/dashboard/scanning",
      icon: RiQrScan2Line,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: RiArchiveLine,
    },
    {
      title: "Exceptions",
      url: "/dashboard/exceptions",
      icon: RiAlertLine,
    },
  ],
  finance: [
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: RiFileTextLine,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: RiMoneyDollarCircleLine,
    },
  ],
  management: [
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: RiTeamLine,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: RiSettings4Line,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "/dashboard/support",
      icon: RiCustomerService2Line,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: RiFeedbackLine,
    },
  ],
}

// User type for sidebar
interface SidebarUser {
  name: string
  email: string
  avatar?: string
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: SidebarUser
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Default user for development - should come from auth context in production
  const displayUser = {
    name: user?.name ?? "Admin User",
    email: user?.email ?? "admin@taccargo.com",
    avatar: user?.avatar ?? "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  }
  return (
    <Sidebar
      variant="inset"
      className="glass-sidebar noise-overlay border-r-0"
      {...props}
    >
      <SidebarHeader className="border-b border-border/30 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-secondary border border-primary/20 shadow-lg shadow-primary/20 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20" />
                  <RiBox3Line className="size-5 text-primary relative z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-[1px] bg-primary" />
                </div>
                <div className="grid flex-1 text-left">
                  <span className="text-sm font-bold tracking-tight text-foreground uppercase">TAC Cargo</span>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest opacity-60">Enterprise Logistics</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-2 pt-4 px-2">
        <NavMain label="Overview" items={navConfig.overview} />
        <NavMain label="Operations" items={navConfig.operations} />
        <NavMain label="Finance" items={navConfig.finance} />
        <NavMain label="Management" items={navConfig.management} />
        <NavSecondary items={navConfig.navSecondary} className="mt-auto border-t border-border/30 pt-4" />
      </SidebarContent>
      <SidebarFooter className="border-t border-border/30">
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
