"use client";

import {
  RiAddLine,
  RiSubtractLine,
  RiTruckLine,
  RiTimeLine,
  RiRouteLine,
  RiMapPinLine,
  RiNavigationLine,
  RiGasStationLine,
  RiSpeedUpLine,
  RiTempColdLine,
} from "@remixicon/react";
import { LottieContainer } from "@/components/ui/lottie-container";
import { Card } from "@/components/ui/card";

export function RouteVisualizer() {
  return (
    <Card className="group border-border/50 bg-card/60 relative w-full overflow-hidden p-0 shadow-lg backdrop-blur-xl">
      <div className="grid min-h-[380px] grid-cols-1 lg:grid-cols-2">
        {/* Left: Lottie Animation Container (1/2) */}
        <div className="from-background via-muted/20 to-background relative min-h-[260px] overflow-hidden bg-gradient-to-br lg:min-h-0">
          {/* Lottie Animation - fills container */}
          <div className="absolute inset-0">
            <LottieContainer
              src="/lottie/tracking-map-new.json"
              className="h-full w-full"
              loop={true}
              autoplay={true}
            />
          </div>

          {/* Map Controls */}
          <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-1.5">
            <button className="bg-card/90 border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/20 flex size-7 items-center justify-center rounded-lg border backdrop-blur transition">
              <RiAddLine className="size-3.5" />
            </button>
            <button className="bg-card/90 border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/20 flex size-7 items-center justify-center rounded-lg border backdrop-blur transition">
              <RiSubtractLine className="size-3.5" />
            </button>
          </div>

          {/* Live Indicator */}
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-full border border-border bg-card/60 px-2.5 py-1 backdrop-blur-md">
            <span className="size-1.5 animate-pulse rounded-full bg-destructive shadow-[0_0_6px_var(--destructive)]"></span>
            <span className="text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Live
            </span>
          </div>
        </div>

        {/* Right: Widgets Panel (1/2) */}
        <div className="border-border/50 bg-card/40 flex flex-col gap-3 border-t p-4 lg:border-t-0 lg:border-l">
          {/* Route Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-foreground text-sm font-semibold">
                Active Route
              </h3>
              <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-[10px]">
                <RiTruckLine className="size-2.5" /> Heavy Goods Vehicle (HGV)
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]"></span>
              <span className="text-[9px] font-bold text-primary uppercase">
                On Track
              </span>
            </div>
          </div>

          {/* Corridor Info - Compact */}
          <div className="bg-muted/30 border-border/50 space-y-2 rounded-lg border p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                Corridor
              </span>
              <span className="text-primary font-mono text-[10px] font-bold">
                #DL-IMP-882
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="bg-background/50 flex-1 rounded px-2 py-1.5 text-center">
                <div className="text-foreground text-xs font-semibold">
                  Delhi (DEL)
                </div>
              </div>
              <RiRouteLine className="text-primary size-3.5 flex-shrink-0" />
              <div className="bg-background/50 flex-1 rounded px-2 py-1.5 text-center">
                <div className="text-foreground text-xs font-semibold">
                  Imphal (IMF)
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid - 2x2 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/20 border-border/50 rounded-lg border p-2.5">
              <div className="text-muted-foreground mb-1 flex items-center gap-1">
                <RiMapPinLine className="size-2.5" />
                <span className="text-[8px] font-bold tracking-wider uppercase">
                  Distance
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-foreground text-lg font-bold tracking-tight">
                  412
                </span>
                <span className="text-muted-foreground text-[9px]">km</span>
              </div>
            </div>
            <div className="bg-muted/20 border-border/50 rounded-lg border p-2.5">
              <div className="text-muted-foreground mb-1 flex items-center gap-1">
                <RiTimeLine className="size-2.5" />
                <span className="text-[8px] font-bold tracking-wider uppercase">
                  ETA
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold tracking-tight text-primary">
                  18:45
                </span>
              </div>
            </div>
            <div className="bg-muted/20 border-border/50 rounded-lg border p-2.5">
              <div className="text-muted-foreground mb-1 flex items-center gap-1">
                <RiSpeedUpLine className="size-2.5" />
                <span className="text-[8px] font-bold tracking-wider uppercase">
                  Speed
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-foreground text-lg font-bold tracking-tight">
                  64
                </span>
                <span className="text-muted-foreground text-[9px]">km/h</span>
              </div>
            </div>
            <div className="bg-muted/20 border-border/50 rounded-lg border p-2.5">
              <div className="text-muted-foreground mb-1 flex items-center gap-1">
                <RiTempColdLine className="size-2.5" />
                <span className="text-[8px] font-bold tracking-wider uppercase">
                  Cargo Temp
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold tracking-tight text-primary">
                  4.2
                </span>
                <span className="text-muted-foreground text-[9px]">°C</span>
              </div>
            </div>
          </div>

          {/* Next Checkpoint Widget */}
          <div className="from-primary/10 via-primary/5 border-primary/20 space-y-1.5 rounded-lg border bg-gradient-to-br to-transparent p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <RiNavigationLine className="text-primary size-3" />
                <span className="text-primary text-[9px] font-bold tracking-wider uppercase">
                  Next Stop
                </span>
              </div>
              <span className="text-muted-foreground font-mono text-[9px]">
                38 km
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 flex size-8 flex-shrink-0 items-center justify-center rounded">
                <RiGasStationLine className="text-primary size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate text-xs font-semibold">
                  Lucknow Bypass
                </div>
                <div className="text-muted-foreground text-[9px]">
                  Fuel • Rest
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-foreground text-xs font-bold">~28m</div>
                <div className="text-[8px] font-medium text-primary uppercase">
                  Clear
                </div>
              </div>
            </div>
          </div>

          {/* Last Update */}
          <div className="text-muted-foreground border-border/50 mt-auto border-t pt-2 text-center font-mono text-[9px]">
            Updated <span className="text-foreground font-bold">2s ago</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
