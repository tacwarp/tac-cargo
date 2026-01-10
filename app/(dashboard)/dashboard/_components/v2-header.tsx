"use client";

import React, { useState } from "react";
import { Search, ChevronRight, Command } from "lucide-react";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import { NotificationBell } from "@/components/dashboard/notification-bell";
import { CommandPalette } from "@/components/dashboard/command-palette";
import { useRealtimeNotifications } from "@/hooks/use-realtime-notifications";

export function V2Header({ title = "Overview", section = "Main Deck" }) {
    const [commandOpen, setCommandOpen] = useState(false);
    const { notifications, markAsRead, markAllAsRead, clearNotification } = useRealtimeNotifications();

    return (
        <>
            <header className="h-16 sticky top-0 z-40 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border border-border bg-muted/70">
                    <span className="text-muted-foreground">{section}</span>
                    <ChevronRight className="text-muted-foreground w-3 h-3" />
                    <span className="text-foreground font-medium">{title}</span>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setCommandOpen(true)}
                        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border w-64 hover:border-primary/40 transition-all"
                    >
                        <Search className="text-muted-foreground w-3 h-3" />
                        <span className="text-xs text-muted-foreground flex-1 text-left">
                            Search...
                        </span>
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] border border-border rounded px-1 py-0.5 text-muted-foreground font-mono flex items-center justify-center">
                                <Command className="w-2 h-2" />
                            </span>
                            <span className="text-[9px] border border-border rounded px-1 py-0.5 text-muted-foreground font-mono">
                                K
                            </span>
                        </div>
                    </button>
                    <ThemeToggle />
                    <NotificationBell
                        notifications={notifications}
                        onMarkAsRead={markAsRead}
                        onMarkAllAsRead={markAllAsRead}
                        onClear={clearNotification}
                    />
                </div>
            </header>
            <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
        </>
    );
}
