"use client";

import { RiFlashlightFill } from "@remixicon/react";

export function InsightWidget() {
  return (
    <div className="from-primary via-primary/80 to-accent/90 group relative mt-auto flex h-[180px] flex-col justify-between overflow-hidden rounded-[32px] bg-gradient-to-br p-8 shadow-[0_0_40px_var(--primary)] text-primary-foreground">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 transform rounded-full bg-white/20 p-32 blur-3xl"></div>

      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2 self-start rounded border border-white/20 bg-black/10 px-2 py-1 text-[10px] font-bold tracking-widest text-primary-foreground/90 uppercase backdrop-blur-md">
          <RiFlashlightFill size={12} className="text-warning" /> AI Insight
        </div>
        <div className="font-display pr-4 text-2xl leading-tight font-bold text-primary-foreground">
          Reduce idle time by 15%
        </div>
      </div>

      <button className="text-primary-foreground relative z-10 w-full rounded-xl bg-white/90 py-3 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] hover:bg-white hover:shadow-xl active:scale-[0.98]">
        Optimize Routes
      </button>
    </div>
  );
}
