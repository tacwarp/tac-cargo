"use client";

import { useDashboardStore } from "@/lib/stores/dashboard-store";
import { cn } from "@/lib/utils";

export function LiveIndicator({ className }: { className?: string }) {
  const isConnected = useDashboardStore((state) => state.isConnected);

  if (!isConnected) return null;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 backdrop-blur-md",
        "animate-in fade-in duration-500",
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-success"></span>
      </span>
      <span className="text-[10px] font-bold tracking-wider text-success uppercase">
        Live Updates
      </span>
    </div>
  );
}
