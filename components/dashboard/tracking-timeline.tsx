"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, Clock, Truck, Package, AlertCircle, MapPin } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  description?: string;
  user?: string;
  isCurrent?: boolean;
}

interface TrackingTimelineProps {
  events: TrackingEvent[];
  orientation?: "vertical" | "horizontal";
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-slate-500", label: "Pending" },
  booked: { icon: Package, color: "text-blue-500", label: "Booked" },
  picked_up: { icon: Package, color: "text-blue-500", label: "Picked Up" },
  in_transit: { icon: Truck, color: "text-amber-500", label: "In Transit" },
  at_hub: { icon: MapPin, color: "text-purple-500", label: "At Hub" },
  out_for_delivery: { icon: Truck, color: "text-indigo-500", label: "Out for Delivery" },
  delivered: { icon: CheckCircle, color: "text-emerald-500", label: "Delivered" },
  failed: { icon: AlertCircle, color: "text-red-500", label: "Failed" },
};

export function TrackingTimeline({ events, orientation = "vertical" }: TrackingTimelineProps) {
  if (orientation === "horizontal") {
    return <HorizontalTimeline events={events} />;
  }

  return (
    <div className="relative">
      {events.map((event, index) => {
        const config = statusConfig[event.status] || statusConfig.pending;
        const Icon = config.icon;
        const isLast = index === events.length - 1;
        const isFirst = index === 0;

        return (
          <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />
            )}
            
            <div className={cn(
              "relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2",
              event.isCurrent || isFirst ? "bg-background border-current" : "bg-muted border-muted",
              config.color
            )}>
              <Icon className={cn("w-4 h-4", event.isCurrent || isFirst ? config.color : "text-muted-foreground")} />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-2">
                <span className={cn("font-medium text-sm", event.isCurrent ? config.color : "text-foreground")}>
                  {config.label}
                </span>
                {event.isCurrent && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded">
                    Current
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mt-0.5">{event.location}</p>
              
              {event.description && (
                <p className="text-xs text-muted-foreground mt-1">{event.description}</p>
              )}

              <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                <span>{format(new Date(event.timestamp), "MMM d, yyyy • h:mm a")}</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</span>
                {event.user && (
                  <>
                    <span>•</span>
                    <span>by {event.user}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalTimeline({ events }: { events: TrackingEvent[] }) {
  return (
    <div className="flex items-start overflow-x-auto pb-4">
      {events.map((event, index) => {
        const config = statusConfig[event.status] || statusConfig.pending;
        const Icon = config.icon;
        const isLast = index === events.length - 1;
        const isFirst = index === 0;

        return (
          <div key={event.id} className="flex items-start">
            <div className="flex flex-col items-center min-w-[120px]">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2",
                event.isCurrent || isFirst ? "bg-background border-current" : "bg-muted border-muted",
                config.color
              )}>
                <Icon className={cn("w-5 h-5", event.isCurrent || isFirst ? config.color : "text-muted-foreground")} />
              </div>
              
              <div className="text-center mt-2">
                <p className={cn("text-xs font-medium", event.isCurrent ? config.color : "text-foreground")}>
                  {config.label}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[100px] truncate">
                  {event.location}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {format(new Date(event.timestamp), "MMM d, h:mm a")}
                </p>
              </div>
            </div>

            {!isLast && (
              <div className="flex items-center h-10 px-2">
                <div className="w-8 h-0.5 bg-border" />
                <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-border" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export type { TrackingEvent };
