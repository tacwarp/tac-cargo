"use client";

import { RefreshCcw, Maximize, Clock } from "lucide-react";

export function CommandCenterHeader() {
  return (
    <header className="border-border/40 bg-background/80 relative z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md">
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <h1 className="text-foreground text-xl font-semibold tracking-tight">
            Route Command Center
          </h1>
          <span className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2 py-0.5">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex h-full w-full rounded-full bg-success"></span>
            </span>
            <span className="text-[10px] font-medium tracking-wide text-success uppercase">
              Live Monitoring
            </span>
          </span>
        </div>
        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs font-medium">
          <span>Corridor ID: #DL-IMP-882</span>
          <span className="bg-muted-foreground/50 size-1 rounded-full"></span>
          <span className="text-muted-foreground flex items-center gap-1">
            Delhi (DEL) <span className="text-muted-foreground/70">→</span>{" "}
            Imphal (IMF)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-muted/50 border-border/50 text-muted-foreground hidden items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs md:flex">
          <Clock className="size-3.5" />
          <span>Last update: 2s ago</span>
        </div>
        <button className="hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors">
          <RefreshCcw className="size-4" />
        </button>
        <button className="hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors">
          <Maximize className="size-4" />
        </button>
      </div>
    </header>
  );
}
