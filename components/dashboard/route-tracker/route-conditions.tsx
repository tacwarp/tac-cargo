"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RiRoadMapLine,
  RiAlertLine,
  RiCheckLine,
  RiTimeLine,
} from "@remixicon/react";

interface RouteSegment {
  id: string;
  from: string;
  to: string;
  status: "clear" | "slow" | "congested" | "closed";
  note?: string;
}

const segments: RouteSegment[] = [
  {
    id: "1",
    from: "Delhi",
    to: "Lucknow",
    status: "clear",
    note: "Normal traffic flow",
  },
  {
    id: "2",
    from: "Lucknow",
    to: "Patna",
    status: "slow",
    note: "Construction on NH27",
  },
  {
    id: "3",
    from: "Patna",
    to: "Guwahati",
    status: "congested",
    note: "Chicken Neck corridor heavy",
  },
  {
    id: "4",
    from: "Guwahati",
    to: "Dimapur",
    status: "clear",
    note: "Highway clear",
  },
  {
    id: "5",
    from: "Dimapur",
    to: "Kohima",
    status: "slow",
    note: "Hill section - reduce speed",
  },
  {
    id: "6",
    from: "Kohima",
    to: "Imphal",
    status: "clear",
    note: "Final stretch clear",
  },
];

interface RouteConditionsProps {
  className?: string;
}

export function RouteConditions({ className }: RouteConditionsProps) {
  const statusConfig = {
    clear: {
      label: "Clear",
      icon: RiCheckLine,
      class: "bg-success/10 text-success border-success/20",
      dot: "bg-success",
    },
    slow: {
      label: "Slow",
      icon: RiTimeLine,
      class: "bg-warning/10 text-warning border-warning/20",
      dot: "bg-warning",
    },
    congested: {
      label: "Congested",
      icon: RiAlertLine,
      class: "bg-destructive/10 text-destructive border-destructive/20",
      dot: "bg-destructive animate-pulse",
    },
    closed: {
      label: "Closed",
      icon: RiAlertLine,
      class: "bg-muted text-muted-foreground border-border",
      dot: "bg-muted-foreground",
    },
  };

  return (
    <Card
      className={cn(
        "depth-surface noise-overlay overflow-hidden border-none",
        className,
      )}
    >
      <CardHeader className="border-border/30 border-b px-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <RiRoadMapLine className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-foreground text-xs font-bold tracking-[0.2em] uppercase">
                Route Conditions
              </h3>
              <p className="text-muted-foreground/50 text-[9px] font-medium tracking-wide uppercase">
                Real-time segment status
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-border/20 divide-y">
          {segments.map((segment) => {
            const config = statusConfig[segment.status];
            const Icon = config.icon;
            return (
              <div
                key={segment.id}
                className="hover:bg-muted/30 group flex items-center gap-4 px-5 py-3.5 transition-colors"
              >
                <div
                  className={cn("size-2.5 shrink-0 rounded-full", config.dot)}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-[11px] font-bold">
                    {segment.from} → {segment.to}
                  </p>
                  {segment.note && (
                    <p className="text-muted-foreground/60 truncate text-[10px]">
                      {segment.note}
                    </p>
                  )}
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-1 text-[9px] font-bold tracking-wide uppercase",
                    config.class,
                  )}
                >
                  <Icon className="size-3" />
                  {config.label}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
