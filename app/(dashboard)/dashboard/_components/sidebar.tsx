"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOutUser } from "@/lib/auth-helpers";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    LayoutGrid,
    PieChart,
    Container,
    Globe,
    ScanLine,
    PackageCheck,
    Receipt,
    Settings2,
    Box,
    ChevronsUpDown,
    Radar,
    ClipboardList,
    AlertOctagon,
    Wallet,
    Users,
    HelpCircle,
    MessageSquare,
    LogOut,
    type LucideIcon,
} from "lucide-react";

interface NavItemProps {
    href: string;
    icon: LucideIcon;
    children: React.ReactNode;
    badge?: string;
    active?: boolean;
}

function NavItem({ href, icon: Icon, children, badge, active }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "nav-item w-full group flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-all relative overflow-hidden",
                active
                    ? "text-foreground bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
        >
            <Icon className="w-4 h-4" />
            {children}
            {badge && (
                <span className="ml-auto text-[9px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border group-hover:border-primary/40 transition-colors">
                    {badge}
                </span>
            )}
            {active && (
                <div className="active-dot absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full shadow-[0_0_10px_color-mix(in_oklch,var(--color-primary)_50%,transparent_50%)]"></div>
            )}
        </Link>
    );
}

export function V2Sidebar() {
    const pathname = usePathname();
    const [isHydrated, setIsHydrated] = useState(false);

    // Prevent hydration mismatch by only rendering Radix components after mount
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsHydrated(true);
    }, []);

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(`${path}/`);
    };

    return (
        <aside className="hidden md:flex w-[260px] flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-xl flex-shrink-0 h-full text-sidebar-foreground">
            {/* Logo */}
            <div className="h-16 flex items-center px-6">
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-primary rounded-lg rotate-3 opacity-60 group-hover:rotate-6 transition-transform"></div>
                        <div className="absolute inset-0 bg-card rounded-lg border border-border flex items-center justify-center z-10">
                            <Box className="text-primary w-4 h-4" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold tracking-tight text-foreground leading-none">
                            TAC<span className="text-muted-foreground">CARGO</span>
                        </span>
                        <span className="text-[9px] text-muted-foreground font-mono mt-0.5 tracking-widest">
                            COMMAND DASHBOARD
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-8">
                {/* Main */}
                <div>
                    <h3 className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                        Main Deck
                    </h3>
                    <nav className="space-y-0.5">
                        <NavItem href="/dashboard" icon={LayoutGrid} active={pathname === "/dashboard"}>
                            Overview
                        </NavItem>
                        <NavItem
                            href="/dashboard/analytics"
                            icon={PieChart}
                            active={isActive("/dashboard/analytics")}
                        >
                            Analytics
                        </NavItem>
                    </nav>
                </div>

                {/* Operations */}
                <div>
                    <h3 className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                        Operations
                    </h3>
                    <nav className="space-y-0.5">
                        <NavItem
                            href="/dashboard/shipments"
                            icon={Container}
                            badge="12"
                            active={isActive("/dashboard/shipments")}
                        >
                            Shipments
                        </NavItem>
                        <NavItem href="/dashboard/routes" icon={Globe} active={isActive("/dashboard/routes")}>
                            Live Routes
                        </NavItem>
                        <NavItem href="/dashboard/tracking" icon={Radar} active={isActive("/dashboard/tracking")}>
                            Tracking
                        </NavItem>
                        <NavItem
                            href="/dashboard/manifests"
                            icon={ClipboardList}
                            active={isActive("/dashboard/manifests")}
                        >
                            Manifests
                        </NavItem>
                        <NavItem
                            href="/dashboard/scanning"
                            icon={ScanLine}
                            active={isActive("/dashboard/scanning")}
                        >
                            Scanner
                        </NavItem>
                        <NavItem
                            href="/dashboard/inventory"
                            icon={PackageCheck}
                            active={isActive("/dashboard/inventory")}
                        >
                            Inventory
                        </NavItem>
                        <NavItem
                            href="/dashboard/exceptions"
                            icon={AlertOctagon}
                            active={isActive("/dashboard/exceptions")}
                            badge="3"
                        >
                            Exceptions
                        </NavItem>
                    </nav>
                </div>

                {/* Financials */}
                <div>
                    <h3 className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                        Finance
                    </h3>
                    <nav className="space-y-0.5">
                        <NavItem
                            href="/dashboard/invoices"
                            icon={Receipt}
                            active={isActive("/dashboard/invoices")}
                        >
                            Invoices
                        </NavItem>
                        <NavItem
                            href="/dashboard/payments"
                            icon={Wallet}
                            active={isActive("/dashboard/payments")}
                        >
                            Payments
                        </NavItem>
                    </nav>
                </div>

                {/* Management */}
                <div>
                    <h3 className="px-3 text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">
                        Management
                    </h3>
                    <nav className="space-y-0.5">
                        <NavItem
                            href="/dashboard/customers"
                            icon={Users}
                            active={isActive("/dashboard/customers")}
                        >
                            Customers
                        </NavItem>
                        <NavItem
                            href="/dashboard/settings"
                            icon={Settings2}
                            active={isActive("/dashboard/settings")}
                        >
                            Settings
                        </NavItem>
                        <NavItem
                            href="/dashboard/support"
                            icon={HelpCircle}
                            active={isActive("/dashboard/support")}
                        >
                            Support
                        </NavItem>
                        <NavItem
                            href="/dashboard/feedback"
                            icon={MessageSquare}
                            active={isActive("/dashboard/feedback")}
                        >
                            Feedback
                        </NavItem>
                    </nav>
                </div>
            </div>

            {/* Profile Widget */}
            <div className="p-4 border-t border-sidebar-border bg-sidebar">
                {isHydrated ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="glass-panel p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-muted/60 transition-colors group">
                                <div className="w-8 h-8 rounded-md bg-muted border border-border flex items-center justify-center">
                                    <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">AL</span>
                                </div>
                                <div className="flex flex-col min-w-0 text-left">
                                    <span className="text-xs text-foreground font-medium truncate">
                                        Alex Logistics
                                    </span>
                                    <span className="text-[10px] text-muted-foreground truncate">
                                        Station Chief
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto text-muted-foreground text-xs w-4 h-4" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[228px]">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings2 className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={async () => {
                                    await signOutUser();
                                    window.location.href = "/auth/login";
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="glass-panel p-2 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-muted/60 transition-colors group">
                        <div className="w-8 h-8 rounded-md bg-muted border border-border flex items-center justify-center">
                            <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">AL</span>
                        </div>
                        <div className="flex flex-col min-w-0 text-left">
                            <span className="text-xs text-foreground font-medium truncate">
                                Alex Logistics
                            </span>
                            <span className="text-[10px] text-muted-foreground truncate">
                                Station Chief
                            </span>
                        </div>
                        <ChevronsUpDown className="ml-auto text-muted-foreground text-xs w-4 h-4" />
                    </div>
                )}
            </div>
        </aside>
    );
}
