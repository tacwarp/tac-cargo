"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export function KpiGradientCard() {
  return (
    <div
      className={cn(
        "group relative mt-auto flex h-[220px] flex-col justify-between overflow-hidden rounded-[32px] p-8 transition-all duration-500 hover:scale-[1.02]",
        "from-primary/30 via-accent/20 to-warning/40 bg-gradient-to-br",
        "shadow-primary/10 border border-white/10 shadow-2xl",
      )}
    >
      {/* Background Noise/Texture */}
      <div className="noise-overlay absolute inset-0 opacity-30 mix-blend-overlay" />

      <div className="relative z-10 flex items-start">
        <div className="flex -space-x-3">
          {[1, 2, 3].map((i) => (
            <Image
              key={i}
              src={`https://i.pravatar.cc/100?img=${50 + i}`}
              width={40}
              height={40}
              className="border-background/20 rounded-full border-2 backdrop-blur-sm"
              alt=""
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <div className="font-display text-foreground text-[56px] leading-none font-semibold tracking-tight">
          +278k
        </div>
        <div className="text-foreground/60 mt-2 text-sm font-medium">
          Km Traveled this Month
        </div>
      </div>
    </div>
  );
}
