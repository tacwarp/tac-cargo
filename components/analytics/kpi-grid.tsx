"use client";

import {
  RiMoneyDollarCircleLine,
  RiBox3Line,
  RiGasStationLine,
  RiArrowRightUpLine,
  RiArrowRightDownLine,
} from "@remixicon/react";

export function KpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* KPI 1 */}
      <div className="bg-card/50 group hover:border-primary/50 relative overflow-hidden rounded-[24px] border border-border p-6 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_30px_var(--primary)] text-card-foreground">
        <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 mb-4 flex items-start justify-between">
          <div className="bg-primary/10 border-primary/20 text-primary flex h-10 w-10 items-center justify-center rounded-xl border shadow-[0_0_15px_var(--primary)]">
            <RiMoneyDollarCircleLine size={20} />
          </div>
          <span className="flex items-center gap-1 rounded border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold tracking-wider text-primary uppercase backdrop-blur-sm">
            +12.5% <RiArrowRightUpLine size={12} />
          </span>
        </div>
        <div className="relative z-10">
          <div className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
            Total Revenue
          </div>
          <div className="flex items-baseline gap-1 font-mono text-3xl font-bold tracking-tight text-foreground">
            <span className="text-primary">$</span>842,400
          </div>
        </div>
        {/* Abstract Pattern */}
        <svg
          className="text-primary absolute right-0 bottom-0 h-24 w-48 opacity-10 transition-opacity group-hover:opacity-20"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40 L 20 20 L 40 30 L 70 10 L 100 25 V 40 H 0 Z"
            fill="currentColor"
          ></path>
          <path
            d="M0 40 L 20 25 L 40 35 L 70 15 L 100 30 V 40 H 0 Z"
            fill="currentColor"
            fillOpacity="0.5"
          ></path>
        </svg>
      </div>

      {/* KPI 2 */}
      <div className="bg-card/50 group hover:border-warning/50 relative overflow-hidden rounded-[24px] border border-border p-6 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_30px_var(--warning)] text-card-foreground">
        <div className="from-warning/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 mb-4 flex items-start justify-between">
          <div className="bg-warning/10 border-warning/20 text-warning flex h-10 w-10 items-center justify-center rounded-xl border shadow-[0_0_15px_var(--warning)]">
            <RiBox3Line size={20} />
          </div>
          <span className="flex items-center gap-1 rounded border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-bold tracking-wider text-primary uppercase backdrop-blur-sm">
            +4.2% <RiArrowRightUpLine size={12} />
          </span>
        </div>
        <div className="relative z-10">
          <div className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
            Active Shipments
          </div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            1,248
          </div>
        </div>
        <svg
          className="text-warning absolute right-0 bottom-0 h-24 w-48 opacity-10 transition-opacity group-hover:opacity-20"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <rect x="10" y="20" width="10" height="20" fill="currentColor" />
          <rect x="30" y="10" width="10" height="30" fill="currentColor" />
          <rect x="50" y="15" width="10" height="25" fill="currentColor" />
          <rect x="70" y="5" width="10" height="35" fill="currentColor" />
          <rect x="90" y="25" width="10" height="15" fill="currentColor" />
        </svg>
      </div>

      {/* KPI 3 */}
      <div className="bg-card/50 group hover:border-destructive/50 relative overflow-hidden rounded-[24px] border border-border p-6 backdrop-blur-xl transition-all duration-500 hover:shadow-[0_0_30px_var(--destructive)] text-card-foreground">
        <div className="from-destructive/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10 mb-4 flex items-start justify-between">
          <div className="bg-destructive/10 border-destructive/20 text-destructive flex h-10 w-10 items-center justify-center rounded-xl border shadow-[0_0_15px_var(--destructive)]">
            <RiGasStationLine size={20} />
          </div>
          <span className="flex items-center gap-1 rounded border border-destructive/20 bg-destructive/10 px-2 py-1 text-[10px] font-bold tracking-wider text-destructive uppercase backdrop-blur-sm">
            -2.1% <RiArrowRightDownLine size={12} />
          </span>
        </div>
        <div className="relative z-10">
          <div className="text-muted-foreground mb-1 text-[10px] font-bold tracking-widest uppercase">
            Fuel Efficiency
          </div>
          <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
            8.4{" "}
            <span className="text-muted-foreground font-sans text-lg font-medium">
              L/100km
            </span>
          </div>
        </div>
        <svg
          className="text-destructive absolute right-0 bottom-0 h-24 w-48 opacity-10 transition-opacity group-hover:opacity-20"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
        >
          <path
            d="M0 20 Q 30 10 60 25 T 100 15 V 40 H 0 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div >
    </div >
  );
}
