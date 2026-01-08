"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RiBox3Line,
  RiTruckLine,
  RiCheckboxCircleLine,
  RiAlertLine,
  RiTimeLine,
} from "@remixicon/react";

interface ActivityItem {
  id: string;
  type: "shipment" | "delivery" | "alert" | "transit" | "pending";
  title: string;
  description: string;
  time: string;
}

const activityData: ActivityItem[] = [
  {
    id: "1",
    type: "delivery",
    title: "Shipment Delivered",
    description: "AWB #TAC-2024-8847 delivered to Mumbai Hub",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "shipment",
    title: "New Booking",
    description: "Express shipment created for ABC Corp",
    time: "8 min ago",
  },
  {
    id: "3",
    type: "alert",
    title: "Delay Alert",
    description: "Flight AI-302 delayed affecting 12 shipments",
    time: "15 min ago",
  },
  {
    id: "4",
    type: "transit",
    title: "In Transit Update",
    description: "Manifest MF-1247 departed from Delhi Hub",
    time: "23 min ago",
  },
  {
    id: "5",
    type: "pending",
    title: "Pending Pickup",
    description: "3 shipments awaiting pickup at Warehouse B",
    time: "45 min ago",
  },
];

const iconMap = {
  shipment: RiBox3Line,
  delivery: RiCheckboxCircleLine,
  alert: RiAlertLine,
  transit: RiTruckLine,
  pending: RiTimeLine,
};

const colorMap = {
  shipment: "text-primary bg-primary/10 border-primary/20",
  delivery: "text-success bg-success/10 border-success/20",
  alert: "text-destructive bg-destructive/10 border-destructive/20",
  transit: "text-warning bg-warning/10 border-warning/20",
  pending: "text-info bg-info/10 border-info/20",
};

interface ActivityFeedProps {
  className?: string;
}

export function ActivityFeed({ className }: ActivityFeedProps) {
  return (
    <Card
      className={cn(
        "depth-surface noise-overlay overflow-hidden border-none",
        className,
      )}
    >
      <CardHeader className="border-border/30 border-b px-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-foreground text-xs font-bold tracking-[0.2em] uppercase">
              Live Activity
            </h3>
            <p className="text-muted-foreground/50 text-[9px] font-medium tracking-wide uppercase">
              Real-time operations feed
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="bg-muted-foreground/50 relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <span className="text-muted-foreground text-[9px] font-bold tracking-wide uppercase">
              Static
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-border/20 divide-y">
          {activityData.map((item) => {
            const Icon = iconMap[item.type];
            return (
              <div
                key={item.id}
                className="hover:bg-muted/30 group flex items-start gap-3 px-5 py-3.5 transition-colors"
              >
                <div
                  className={cn(
                    "shrink-0 rounded-lg border p-2 transition-transform group-hover:scale-105",
                    colorMap[item.type],
                  )}
                >
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="text-foreground truncate text-[11px] font-bold">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground/70 truncate text-[10px]">
                    {item.description}
                  </p>
                </div>
                <span className="text-muted-foreground/40 shrink-0 text-[9px] font-medium tracking-wide uppercase">
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
