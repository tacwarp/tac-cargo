"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RiMapPinLine,
  RiTimeLine,
  RiRoadMapLine,
  RiGasStationLine,
  RiMoneyDollarCircleLine,
  RiSpeedLine,
} from "@remixicon/react";

interface RouteInfoCardProps {
  className?: string;
  origin?: string;
  destination?: string;
  distance?: string;
  duration?: string;
  fuelCost?: string;
  tollCost?: string;
  avgSpeed?: string;
}

export function RouteInfoCard({
  className,
  origin = "Delhi",
  destination = "Imphal",
  distance = "2,456 km",
  duration = "48h 15m",
  fuelCost = "₹18,450",
  tollCost = "₹3,200",
  avgSpeed = "52 km/h",
}: RouteInfoCardProps) {
  return (
    <Card
      className={cn(
        "depth-surface noise-overlay overflow-hidden border-none",
        className,
      )}
    >
      <CardContent className="p-5">
        {/* Route Header */}
        <div className="border-border/30 mb-5 flex items-center gap-3 border-b pb-4">
          <div className="bg-primary/10 text-primary rounded-lg p-2.5">
            <RiRoadMapLine className="size-5" />
          </div>
          <div className="flex-1">
            <div className="text-foreground flex items-center gap-2 text-sm font-bold">
              <span>{origin}</span>
              <span className="text-muted-foreground/50">→</span>
              <span>{destination}</span>
            </div>
            <p className="text-muted-foreground/50 mt-0.5 text-[9px] font-medium tracking-widest uppercase">
              Active Route
            </p>
          </div>
          <div className="bg-success/10 border-success/20 rounded-full border px-2.5 py-1">
            <span className="text-success flex items-center gap-1.5 text-[9px] font-bold tracking-wide uppercase">
              <span className="bg-success size-1.5 animate-pulse rounded-full" />
              Live
            </span>
          </div>
        </div>

        {/* Route Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <MetricItem
            icon={RiMapPinLine}
            label="Distance"
            value={distance}
            color="text-primary"
          />
          <MetricItem
            icon={RiTimeLine}
            label="Est. Duration"
            value={duration}
            color="text-warning"
          />
          <MetricItem
            icon={RiGasStationLine}
            label="Fuel Cost"
            value={fuelCost}
            color="text-info"
          />
          <MetricItem
            icon={RiMoneyDollarCircleLine}
            label="Toll Cost"
            value={tollCost}
            color="text-accent"
          />
        </div>

        {/* Average Speed Footer */}
        <div className="border-border/30 mt-4 flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <RiSpeedLine className="size-4" />
            <span className="text-[10px] font-medium tracking-wide uppercase">
              Avg Speed
            </span>
          </div>
          <span className="text-foreground text-sm font-bold">{avgSpeed}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricItem({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-muted/30 hover:bg-muted/50 flex items-start gap-3 rounded-lg p-3 transition-colors">
      <div className={cn("bg-background/50 rounded-lg p-2", color)}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-muted-foreground/60 text-[9px] font-medium tracking-wide uppercase">
          {label}
        </p>
        <p className="text-foreground mt-0.5 truncate text-sm font-bold">
          {value}
        </p>
      </div>
    </div>
  );
}
