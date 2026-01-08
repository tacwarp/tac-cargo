"use client";

import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LiveUpdatesFeed() {
  const updates = [
    {
      status: "Arrived at Lucknow Hub",
      desc: "Package is being scanned for zone sort.",
      time: "14:20 PM • Lucknow",
      color: "blue",
    },
    {
      status: "Departed Agra Facility",
      desc: "Vehicle #DL-882 left the premises.",
      time: "09:30 AM • Agra",
      color: "slate",
    },
    {
      status: "Shipment Picked Up",
      desc: "Courier has collected the package.",
      time: "06:00 AM • New Delhi",
      color: "slate",
    },
  ];

  return (
    <Card className="border-border/50 bg-card h-full max-h-[400px] overflow-y-auto p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-foreground text-sm font-semibold">Live Updates</h3>
        <span className="rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success dark:text-success">
          LIVE
        </span>
      </div>

      <div className="relative space-y-6 pl-2">
        {/* Timeline Line */}
        <div className="bg-muted absolute top-2 left-[19px] h-[85%] w-[1.5px]"></div>

        {updates.map((update, idx) => (
          <div key={idx} className="relative flex gap-4">
            <div
              className={cn(
                "ring-card relative z-10 mt-1.5 size-2.5 rounded-full ring-4",
                update.color === "blue"
                  ? "bg-primary"
                  : "bg-muted-foreground/30",
              )}
            ></div>
            <div className="flex-1">
              <p className="text-foreground text-xs font-medium">
                {update.status}
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {update.desc}
              </p>
              <span className="text-muted-foreground/70 mt-1 block font-mono text-[10px]">
                {update.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="text-muted-foreground hover:text-primary mt-6 flex w-full items-center justify-center gap-1 text-xs font-medium transition-colors">
        View all history <ChevronDown className="size-3" />
      </button>
    </Card>
  );
}
