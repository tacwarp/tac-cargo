"use client";

import { RiCheckboxMultipleLine, RiTimeLine } from "@remixicon/react";

export function ShipmentStats() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-card/50 group flex h-24 flex-col justify-between rounded-2xl border border-border p-4 backdrop-blur-xl transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-[0_0_20px_var(--primary)] text-card-foreground">
        <RiCheckboxMultipleLine size={20} className="mb-2 text-primary" />
        <div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            24
          </div>
          <div className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
            Delivered Today
          </div>
        </div>
      </div>
      <div className="bg-card/50 group hover:border-warning/30 hover:bg-warning/5 flex h-24 flex-col justify-between rounded-2xl border border-border p-4 backdrop-blur-xl transition-all hover:shadow-[0_0_20px_var(--warning)] text-card-foreground">
        <RiTimeLine size={20} className="text-warning mb-2" />
        <div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            3
          </div>
          <div className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
            Pending Approval
          </div>
        </div>
      </div>
    </div>
  );
}
