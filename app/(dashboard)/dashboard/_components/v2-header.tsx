"use client";

import React from "react";
import { Search, Bell, ChevronRight, Command } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";

export function V2Header({ title = "Overview", section = "Main Deck" }) {
    return (
        <header className="h-16 sticky top-0 z-40 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-border bg-muted/70">
                <span className="text-muted-foreground">{section}</span>
                <ChevronRight className="text-muted-foreground w-3 h-3" />
                <span className="text-foreground font-medium">{title}</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border w-64 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/30 transition-all">
                    <Search className="text-muted-foreground w-3 h-3" />
                    <input
                        type="text"
                        placeholder="Search shipments..."
                        className="bg-transparent border-none outline-none text-xs text-foreground w-full placeholder:text-muted-foreground font-sans focus:ring-0"
                    />
                    <div className="flex items-center gap-1">
                        <span className="text-[9px] border border-border rounded px-1 py-0.5 text-muted-foreground font-mono flex items-center justify-center">
                            <Command className="w-2 h-2" />
                        </span>
                        <span className="text-[9px] border border-border rounded px-1 py-0.5 text-muted-foreground font-mono">
                            K
                        </span>
                    </div>
                </div>
                <ThemeToggle />
                <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-all relative">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-destructive rounded-full border border-background"></span>
                </button>
            </div>
        </header>
    );
}
