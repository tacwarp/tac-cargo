"use client";

import { RiCheckLine, RiTruckLine, RiMapPinLine } from "@remixicon/react";

export function RouteTimelineHorizontal() {
  return (
    <section className="w-full px-2 py-6">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="to-muted absolute top-[19px] right-0 left-0 z-0 h-[2px] rounded-full bg-gradient-to-r from-success/50 via-primary/50"></div>

        {/* Node 1: Completed */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="bg-card flex size-10 items-center justify-center rounded-full border-2 border-success text-success shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <RiCheckLine className="size-5" />
          </div>
          <div className="text-center">
            <h4 className="text-foreground text-xs font-medium dark:text-slate-300">
              New Delhi
            </h4>
            <span className="text-muted-foreground font-mono text-[10px]">
              06:00 AM
            </span>
          </div>
        </div>

        {/* Node 2: Completed */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="my-3.5 size-3 rounded-full bg-success shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
          <div className="text-center opacity-70">
            <h4 className="text-muted-foreground text-xs font-medium">Agra</h4>
            <span className="text-muted-foreground/80 font-mono text-[10px]">
              09:30 AM
            </span>
          </div>
        </div>

        {/* Node 3: Current */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="relative flex size-10 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
            <div className="bg-card flex size-10 items-center justify-center rounded-full border-2 border-primary text-primary shadow-[0_0_20px_rgba(139,92,246,0.4)]">
              <RiTruckLine className="size-5" />
            </div>
          </div>
          <div className="text-center">
            <h4 className="text-foreground text-xs font-semibold">
              Lucknow{" "}
              <span className="ml-1 text-[10px] text-primary">Live</span>
            </h4>
            <span className="text-muted-foreground font-mono text-[10px]">
              14:20 PM
            </span>
          </div>
        </div>

        {/* Node 4: Upcoming */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="bg-card border-muted-foreground/30 my-3.5 size-3 rounded-full border"></div>
          <div className="text-center opacity-50">
            <h4 className="text-muted-foreground text-xs font-medium">
              Gorakhpur
            </h4>
            <span className="text-muted-foreground font-mono text-[10px]">
              --:--
            </span>
          </div>
        </div>

        {/* Node 5: Destination */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="bg-card border-border text-muted-foreground flex size-10 items-center justify-center rounded-full border">
            <RiMapPinLine className="size-5" />
          </div>
          <div className="text-center opacity-50">
            <h4 className="text-muted-foreground text-xs font-medium">
              Imphal
            </h4>
            <span className="text-muted-foreground font-mono text-[10px]">
              18:45 PM (Est)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
