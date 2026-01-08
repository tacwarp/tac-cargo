"use client";

import * as React from "react";
import {
  LayoutDashboard,
  BarChart2,
  Package,
  MapPin,
  Truck,
  ScanBarcode,
  Archive,
  AlertTriangle,
  FileText,
  DollarSign,
  Users,
  Settings,
  Headphones,
  MessageSquare,
  Map,
  Box
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Navigation configuration
const navConfig = {
  overview: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart2,
    },
  ],
  operations: [
    {
      title: "Shipments",
      url: "/dashboard/shipments",
      icon: Package,
    },
    {
      title: "Route Tracker",
      url: "/dashboard/route-tracker",
      icon: Map,
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
      icon: Archive,
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
      url: "/dashboard/support",
      icon: Headphones,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: MessageSquare,
    },
  ],
};

// User type for sidebar
interface SidebarUser {
  name: string;
  email: string;
  avatar?: string;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: SidebarUser;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // Default user for development - should come from auth context in production
  const displayUser = {
    name: user?.name ?? "Admin User",
    email: user?.email ?? "admin@taccargo.com",
    avatar:
      user?.avatar ??
      "https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png",
  };
  return (
    <Sidebar
      variant="inset"
      className="glass-sidebar noise-overlay border-border/10 my-2 ml-2 h-[calc(100vh-16px)] rounded-r-3xl border-r bg-black/40 backdrop-blur-xl"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader className="border-b border-white/5 pt-4 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className="transition-all group-data-[collapsible=icon]:justify-center hover:bg-white/5"
            >
              <a href="/dashboard" className="flex items-center gap-3">
                <div className="bg-primary/20 border-primary/30 group relative flex aspect-square size-10 items-center justify-center overflow-hidden rounded-xl border shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                  <div className="from-primary/40 absolute inset-0 bg-gradient-to-tr to-transparent opacity-50" />
                  <Box className="text-primary relative z-10 size-6" />
                </div>
                <div className="grid flex-1 text-left group-data-[collapsible=icon]:hidden">
                  <span className="font-heading text-base font-bold tracking-tight text-white uppercase">
                    TAC Cargo
                  </span>
                  <span className="text-primary/80 text-[9px] font-bold tracking-[0.2em] uppercase">
                    Command v2
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-2 px-2 py-4">
        <div className="mb-2 px-2 group-data-[collapsible=icon]:hidden">
          <span className="text-muted-foreground/50 pl-2 text-[10px] font-bold tracking-widest uppercase">
            Main Deck
          </span>
        </div>
        <NavMain label="Overview" items={navConfig.overview} />

        <div className="mt-4 mb-2 px-2 group-data-[collapsible=icon]:hidden">
          <span className="text-muted-foreground/50 pl-2 text-[10px] font-bold tracking-widest uppercase">
            Ops Control
          </span>
        </div>
        <NavMain label="Operations" items={navConfig.operations} />

        <div className="mt-4 mb-2 px-2 group-data-[collapsible=icon]:hidden">
          <span className="text-muted-foreground/50 pl-2 text-[10px] font-bold tracking-widest uppercase">
            Finance
          </span>
        </div>
        <NavMain label="Finance" items={navConfig.finance} />

        <div className="mt-4 mb-2 px-2 group-data-[collapsible=icon]:hidden">
          <span className="text-muted-foreground/50 pl-2 text-[10px] font-bold tracking-widest uppercase">
            Management
          </span>
        </div>
        <NavMain label="Management" items={navConfig.management} />

        <NavSecondary
          items={navConfig.navSecondary}
          className="mt-auto border-t border-white/5 pt-4"
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-2">
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
