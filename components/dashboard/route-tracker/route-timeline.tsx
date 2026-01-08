"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RiCheckboxCircleFill,
  RiTimeLine,
  RiMapPinLine,
} from "@remixicon/react";

interface Waypoint {
  id: string;
  name: string;
  distance: string;
  eta?: string;
  status: "completed" | "current" | "upcoming";
  arrivalTime?: string;
}

const waypoints: Waypoint[] = [
  {
    id: "1",
    name: "Delhi",
    distance: "0 km",
    status: "completed",
    arrivalTime: "06:00",
  },
  {
    id: "2",
    name: "Lucknow",
    distance: "550 km",
    status: "completed",
    arrivalTime: "14:30",
  },
  {
    id: "3",
    name: "Patna",
    distance: "980 km",
    status: "current",
    eta: "2h 15m",
  },
  {
    id: "4",
    name: "Guwahati",
    distance: "1,450 km",
    status: "upcoming",
    eta: "12h 30m",
  },
  {
    id: "5",
    name: "Dimapur",
    distance: "1,920 km",
    status: "upcoming",
    eta: "22h 45m",
  },
  {
    id: "6",
    name: "Kohima",
    distance: "2,100 km",
    status: "upcoming",
    eta: "28h 00m",
  },
  {
    id: "7",
    name: "Imphal",
    distance: "2,456 km",
    status: "upcoming",
    eta: "36h 15m",
  },
];

interface RouteTimelineProps {
  className?: string;
}

export function RouteTimeline({ className }: RouteTimelineProps) {
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
              Route Timeline
            </h3>
            <p className="text-muted-foreground/50 text-[9px] font-medium tracking-wide uppercase">
              Delhi → Imphal via NH27
            </p>
          </div>
          <div className="bg-warning/10 border-warning/20 flex items-center gap-1.5 rounded-full border px-2.5 py-1">
            <RiTimeLine className="text-warning size-3" />
            <span className="text-warning text-[9px] font-bold tracking-wide uppercase">
              36h 15m remaining
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="scrollbar-thin flex gap-0 overflow-x-auto px-5 py-5">
          {waypoints.map((waypoint, index) => (
            <div key={waypoint.id} className="flex shrink-0 items-center">
              {/* Waypoint Node */}
              <div className="flex min-w-[100px] flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-all",
                    waypoint.status === "completed" &&
                      "bg-success text-success-foreground shadow-success/30 shadow-lg",
                    waypoint.status === "current" &&
                      "bg-warning text-warning-foreground shadow-warning/30 ring-warning/20 animate-pulse shadow-lg ring-4",
                    waypoint.status === "upcoming" &&
                      "bg-muted text-muted-foreground border-border border-2",
                  )}
                >
                  {waypoint.status === "completed" ? (
                    <RiCheckboxCircleFill className="size-5" />
                  ) : (
                    <RiMapPinLine className="size-5" />
                  )}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      "text-[11px] font-bold",
                      waypoint.status === "current"
                        ? "text-warning"
                        : "text-foreground",
                    )}
                  >
                    {waypoint.name}
                  </p>
                  <p className="text-muted-foreground/60 text-[9px] font-medium">
                    {waypoint.distance}
                  </p>
                  {waypoint.status === "completed" && waypoint.arrivalTime && (
                    <p className="text-success mt-0.5 text-[9px] font-bold">
                      ✓ {waypoint.arrivalTime}
                    </p>
                  )}
                  {waypoint.status === "current" && waypoint.eta && (
                    <p className="text-warning mt-0.5 text-[9px] font-bold">
                      ETA: {waypoint.eta}
                    </p>
                  )}
                  {waypoint.status === "upcoming" && waypoint.eta && (
                    <p className="text-muted-foreground/50 mt-0.5 text-[9px] font-medium">
                      ~{waypoint.eta}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < waypoints.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-1 w-12 rounded-full transition-all",
                    waypoint.status === "current"
                      ? "from-success to-success/50 bg-gradient-to-r"
                      : waypoints[index + 1].status === "completed"
                        ? "from-success to-success/50 bg-gradient-to-r"
                        : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
