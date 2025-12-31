"use client"

import * as React from "react"
import {
  BarChart3,
  FileText,
  Home,
  MapPin,
  Package,
  Settings,
  Truck,
  Users,
  Warehouse,
  AlertTriangle,
  DollarSign,
  ScanBarcode,
  LifeBuoy,
  Send,
} from "lucide-react"

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

const data = {
  user: {
    name: "Admin User",
    email: "admin@taccargo.com",
    avatar: "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  },
  overview: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
  ],
  operations: [
    {
      title: "Shipments",
      url: "/dashboard/shipments",
      icon: Package,
    },
    {
      title: "Tracking",
      url: "/dashboard/tracking",
      icon: MapPin,
    },
    {
      title: "Manifests",
      url: "/dashboard/manifests",
      icon: Truck,
    },
    {
      title: "Scanning",
      url: "/dashboard/scanning",
      icon: ScanBarcode,
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Warehouse,
    },
    {
      title: "Exceptions",
      url: "/dashboard/exceptions",
      icon: AlertTriangle,
    },
  ],
  finance: [
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: FileText,
    },
    {
      title: "Payments",
      url: "/dashboard/payments",
      icon: DollarSign,
    },
  ],
  management: [
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">TAC Cargo</span>
                  <span className="truncate text-xs">Enterprise Logistics</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain label="Overview" items={data.overview} />
        <NavMain label="Operations" items={data.operations} />
        <NavMain label="Finance" items={data.finance} />
        <NavMain label="Management" items={data.management} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
