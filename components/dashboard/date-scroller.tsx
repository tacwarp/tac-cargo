"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

export function DateScroller() {
  const [activeDate, setActiveDate] = useState(10);

  // Generate dummy dates
  const days = [
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
  ];
  const dates = Array.from({ length: 13 }, (_, i) => ({
    date: i + 1,
    day: days[i % 7],
  }));

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between px-2">
        <h2 className="font-display text-foreground text-2xl font-medium tracking-tight">
          Fleet Statistics
        </h2>
        <div className="text-muted-foreground flex gap-4 text-sm font-medium">
          <span className="text-foreground cursor-pointer font-bold">Days</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">
            Weeks
          </span>
          <span className="hover:text-foreground cursor-pointer transition-colors">
            Months
          </span>
        </div>
      </div>

      <div className="hide-scroll -mx-2 flex gap-3 overflow-x-auto scroll-smooth px-2 pb-2">
        {dates.map((item) => (
          <button
            key={item.date}
            onClick={() => setActiveDate(item.date)}
            className={cn(
              "flex h-[72px] min-w-[64px] flex-col items-center justify-center rounded-2xl transition-all duration-300",
              activeDate === item.date
                ? "bg-primary text-primary-foreground scale-105 shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                : "bg-card border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground border",
            )}
          >
            <span
              className={cn(
                "mb-1 text-xs font-medium",
                activeDate === item.date ? "text-lg font-bold" : "",
              )}
            >
              {item.date < 10 ? `0${item.date}` : item.date}
            </span>
            <span className="text-[10px] font-medium tracking-wide uppercase opacity-80">
              {item.day}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
