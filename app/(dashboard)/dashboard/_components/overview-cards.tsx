"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { GlassPanel } from "./glass-panel";
import { ArrowRight, DollarSign, AlertOctagon, CloudRain } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const revenueData = [
    { value: 10 },
    { value: 25 },
    { value: 15 },
    { value: 30 },
    { value: 20 },
    { value: 50 },
];

export function OverviewMapCard() {
    return (
        <GlassPanel className="md:col-span-2 md:row-span-2 relative overflow-hidden group p-0">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 mix-blend-lighten grayscale group-hover:grayscale-0 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 z-10">
                <div className="px-3 py-1 rounded-full bg-background/80 border border-border backdrop-blur text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                    <span className="text-foreground font-medium">Global Fleet</span>
                    <span className="text-muted-foreground border-l border-border pl-2">
                        248 Active
                    </span>
                </div>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-4 left-4 z-10 w-full pr-8">
                <div className="flex justify-between items-end">
                    <div>
                        <div className="text-2xl font-bold text-foreground mb-1">98.2%</div>
                        <div className="text-xs text-muted-foreground">On-Time Performance</div>
                    </div>
                    <Link
                        href="/dashboard/routes"
                        className="px-3 py-1.5 bg-primary/20 border border-primary/50 text-primary rounded text-xs hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                        View Map
                    </Link>
                </div>
            </div>
        </GlassPanel>
    );
}

export function OverviewRevenueCard() {
    return (
        <GlassPanel className="md:col-span-1 md:row-span-2 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6 z-10">
                <div className="w-8 h-8 rounded bg-muted border border-border flex items-center justify-center">
                    <DollarSign className="text-muted-foreground w-4 h-4" />
                </div>
                <span className="text-xs text-success bg-success/10 px-2 py-0.5 rounded border border-success/20">
                    +14%
                </span>
            </div>
            <div className="mb-auto z-10">
                <div className="text-2xl font-bold text-foreground">$2.4M</div>
                <div className="text-xs text-muted-foreground mt-1">Monthly Revenue</div>
            </div>
            {/* Decorative Chart */}
            <div className="absolute bottom-0 left-0 right-0 h-32 opacity-50">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            fill="url(#colorValue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassPanel>
    );
}

export function OverviewAlertCard() {
    return (
        <GlassPanel className="md:col-span-1 md:row-span-1 border-destructive/20 bg-gradient-to-br from-card/90 to-destructive/5 hover:border-destructive/40 transition-all cursor-pointer group">
            <div className="flex justify-between items-start">
                <div className="w-8 h-8 rounded bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
                    <AlertOctagon className="w-4 h-4" />
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-destructive/80 transition-colors -rotate-45 group-hover:rotate-0 w-4 h-4" />
            </div>
            <div className="mt-4">
                <div className="text-xl font-bold text-foreground group-hover:text-destructive">
                    3 Holds
                </div>
                <div className="text-xs text-destructive/80 mt-1">Customs Clearance</div>
            </div>
        </GlassPanel>
    );
}

export function OverviewInventoryCard() {
    return (
        <GlassPanel className="md:col-span-1 md:row-span-1 relative overflow-hidden group">
            <Image src="https://images.unsplash.com/photo-1590247813693-5541d1c609fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" fill sizes="(max-width: 768px) 100vw, 33vw" className="absolute right-0 top-0 object-cover opacity-20 mask-bottom" alt="" />
            <div className="relative z-10">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Inventory</div>
                <div className="text-xl font-bold text-foreground">12.4k</div>
                <div className="w-full bg-muted h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-primary h-full w-[70%]"></div>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 text-right">70% Capacity</div>
            </div>
        </GlassPanel>
    );
}

export function OverviewActivityFeed() {
    return (
        <GlassPanel className="md:col-span-2 md:row-span-1 flex flex-col justify-center">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">Live Feed</div>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Image src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=100&h=100&q=80" width={24} height={24} className="rounded-full border border-border" alt="User" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/80 truncate"><span className="font-medium text-foreground">Sarah M.</span> approved manifest <span className="text-primary font-mono">#M-9921</span></p>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">2m ago</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[10px] text-primary font-mono">SYS</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/80 truncate">Automated route optimization complete.</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">5m ago</span>
                </div>
            </div>
        </GlassPanel>
    );
}

export function OverviewWeatherCard() {
    return (
        <GlassPanel className="md:col-span-2 md:row-span-1 flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
            <div className="relative z-10 flex gap-4 items-center">
                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center">
                    <CloudRain className="text-primary w-5 h-5" />
                </div>
                <div>
                    <div className="text-sm font-medium text-foreground">Storm Warning</div>
                    <div className="text-xs text-muted-foreground">North Atlantic Route • Delay +2h</div>
                </div>
            </div>
            <div className="relative z-10 text-right">
                <div className="text-xs font-mono text-primary border border-primary/30 px-2 py-1 rounded bg-primary/10">ALERT-99</div>
            </div>
        </GlassPanel>
    )
}
