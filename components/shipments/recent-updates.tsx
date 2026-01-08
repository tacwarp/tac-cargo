"use client";

export function RecentUpdates() {
  return (
    <div className="bg-card/50 flex-1 rounded-[24px] border border-border p-6 backdrop-blur-xl transition-colors hover:border-border/80">
      <h3 className="mb-6 flex items-center gap-2 text-xs font-bold tracking-widest text-foreground uppercase">
        <span className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full" />{" "}
        Log Stream
      </h3>

      <div className="relative space-y-8 pl-2">
        {/* Vertical Line */}
        <div className="absolute top-2 bottom-2 left-[11px] w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>

        {/* Item 1 */}
        <div className="group relative flex gap-4">
          <div className="relative z-10 mt-1.5 h-2 w-2 rounded-full bg-success shadow-[0_0_10px_color-mix(in_oklch,var(--success)_50%,transparent)] ring-4 ring-black/40"></div>
          <div className="flex-1">
            <div className="text-xs text-foreground/90">
              Shipment{" "}
              <span className="font-mono font-bold text-success">
                #2890
              </span>{" "}
              delivered
            </div>
            <div className="text-muted-foreground mt-1 font-mono text-[10px]">
              10:45 AM • Houston, TX
            </div>
          </div>
        </div>

        {/* Item 2 */}
        <div className="group relative flex gap-4">
          <div className="bg-warning relative z-10 mt-1.5 h-2 w-2 rounded-full shadow-[0_0_10px_rgba(var(--warning),0.5)] ring-4 ring-black/40"></div>
          <div className="flex-1">
            <div className="text-xs text-foreground/90">
              Delay reported for{" "}
              <span className="text-warning font-mono font-bold">#3001</span>
            </div>
            <div className="text-muted-foreground mt-1 font-mono text-[10px]">
              09:30 AM • Traffic Exception
            </div>
          </div>
        </div>

        {/* Item 3 */}
        <div className="group relative flex gap-4">
          <div className="bg-primary relative z-10 mt-1.5 h-2 w-2 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)] ring-4 ring-black/40"></div>
          <div className="flex-1">
            <div className="text-xs text-foreground/90">
              New route assigned to{" "}
              <span className="text-primary font-bold">M. Alverez</span>
            </div>
            <div className="text-muted-foreground mt-1 font-mono text-[10px]">
              08:15 AM • Automated
            </div>
          </div>
        </div>

        {/* Item 4 */}
        <div className="group relative flex gap-4 opacity-40 transition-opacity hover:opacity-100">
          <div className="relative z-10 mt-1.5 h-2 w-2 rounded-full bg-muted-foreground ring-4 ring-background/40"></div>
          <div className="flex-1">
            <div className="text-xs text-foreground/90">Shift report generated</div>
            <div className="text-muted-foreground mt-1 font-mono text-[10px]">
              06:00 AM • System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
