"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight, Plus, Minus } from "lucide-react";

export function TrackingMapVisualizer() {
  return (
    <Card className="group border-border/50 bg-card relative h-[400px] w-full overflow-hidden shadow-lg">
      {/* Header Overlay */}
      <div className="absolute top-5 left-5 z-10 flex items-center gap-3">
        <div className="bg-card/90 border-border/60 flex items-center gap-3 rounded-lg border px-4 py-2 shadow-sm backdrop-blur">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Origin
            </span>
            <span className="text-foreground text-xs font-bold">New Delhi</span>
          </div>
          <ArrowRight className="text-muted-foreground size-3.5" />
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
              Destination
            </span>
            <span className="text-foreground text-xs font-bold">Imphal</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-semibold text-success shadow-sm backdrop-blur-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex size-2 rounded-full bg-success"></span>
          </span>
          In Transit
        </div>
      </div>

      {/* Map Visual (SVG) */}
      <div className="bg-muted/20 dark:bg-muted/5 pattern-grid absolute inset-0 opacity-60"></div>
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="routeLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="100%" stopColor="var(--muted)" stopOpacity="0.5" />
          </linearGradient>
          <filter id="dropShadow">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="6"
              floodColor="var(--primary)"
              floodOpacity="0.2"
            />
          </filter>
        </defs>
        {/* Path trace */}
        <path
          d="M-10,250 C 200,250 300,100 600,150 S 900,200 1200,80 S 1600,150 1800,100"
          stroke="url(#routeLight)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          filter="url(#dropShadow)"
        />

        {/* Truck Icon animating */}
        {/* Using Framer Motion for smoother SVG animation control if needed, but standard SVG animateMotion is fine here */}
        <g>
          <circle
            r="12"
            fill="currentColor"
            className="text-background"
            stroke="var(--primary)"
            strokeWidth="3"
          >
            <animateMotion
              repeatCount="indefinite"
              dur="12s"
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            >
              <mpath href="#trackPath" />
            </animateMotion>
          </circle>
          <circle r="4" fill="var(--primary)">
            <animateMotion
              repeatCount="indefinite"
              dur="12s"
              keyPoints="0;1"
              keyTimes="0;1"
              calcMode="linear"
            >
              <mpath href="#trackPath" />
            </animateMotion>
          </circle>
        </g>
        {/* Hidden path for animation calculation */}
        <path
          id="trackPath"
          d="M-10,250 C 200,250 300,100 600,150 S 900,200 1200,80 S 1600,150 1800,100"
          fill="none"
          stroke="none"
        />
      </svg>

      {/* Bottom Controls */}
      <div className="absolute right-5 bottom-5 flex flex-col gap-2">
        <button className="bg-card border-border text-muted-foreground hover:text-primary rounded-lg border p-2 shadow-md transition-colors">
          <Plus className="size-4" />
        </button>
        <button className="bg-card border-border text-muted-foreground hover:text-primary rounded-lg border p-2 shadow-md transition-colors">
          <Minus className="size-4" />
        </button>
      </div>
    </Card>
  );
}
