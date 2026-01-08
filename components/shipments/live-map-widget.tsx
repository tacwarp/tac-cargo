"use client";

import { RiNavigationLine, RiArrowRightSLine } from "@remixicon/react";
import { LottieContainer } from "@/components/ui/lottie-container";

export function LiveMapWidget() {
  return (
    <div className="bg-card/60 border-border/50 group hover:border-primary/50 relative flex h-[320px] flex-col overflow-hidden rounded-[24px] border shadow-2xl backdrop-blur-xl transition-all duration-500">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1.5 backdrop-blur-md">
        <span className="relative flex h-2 w-2">
          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
          <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
        </span>
        <span className="font-mono text-[10px] font-bold tracking-widest text-foreground uppercase">
          SAT-FEED // LIVE
        </span>
      </div>

      {/* Lottie Animation Background - fills entire card */}
      <div className="absolute inset-0 flex items-center justify-center">
        <LottieContainer
          src="/lottie/shipment.json"
          className="h-full w-full"
          loop={true}
          autoplay={true}
        />
      </div>

      <div className="from-background via-background/80 relative z-10 mt-auto bg-gradient-to-t to-transparent p-4 pt-12">
        <div className="bg-card/80 border-border/50 hover:bg-card group/card flex cursor-pointer items-center justify-between rounded-xl border p-3 shadow-xl backdrop-blur-md transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary border-primary/30 flex h-8 w-8 items-center justify-center rounded border shadow-[0_0_10px_var(--primary)]">
              <RiNavigationLine size={16} />
            </div>
            <div>
              <div className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                Optimization
              </div>
              <div className="text-foreground font-mono text-sm font-bold">
                94% EFFICIENCY
              </div>
            </div>
          </div>
          <div className="hover:bg-muted/20 flex h-8 w-8 items-center justify-center rounded transition-colors">
            <RiArrowRightSLine
              size={16}
              className="text-muted-foreground group-hover/card:text-foreground transition-all group-hover/card:translate-x-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
