"use client";

import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
  FileText,
  User,
  Scan,
  CreditCard,
} from "lucide-react";

interface ActivityEvent {
  id: string;
  type: "shipment_created" | "status_update" | "delivery" | "exception" | "invoice" | "payment" | "scan" | "customer";
  title: string;
  description?: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

interface LiveActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
  className?: string;
}

const eventConfig: Record<ActivityEvent["type"], { icon: React.ElementType; color: string }> = {
  shipment_created: { icon: Package, color: "text-blue-500 bg-blue-500/10" },
  status_update: { icon: Truck, color: "text-amber-500 bg-amber-500/10" },
  delivery: { icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10" },
  exception: { icon: AlertCircle, color: "text-red-500 bg-red-500/10" },
  invoice: { icon: FileText, color: "text-purple-500 bg-purple-500/10" },
  payment: { icon: CreditCard, color: "text-green-500 bg-green-500/10" },
  scan: { icon: Scan, color: "text-indigo-500 bg-indigo-500/10" },
  customer: { icon: User, color: "text-slate-500 bg-slate-500/10" },
};

export function LiveActivityFeed({ events, maxItems = 10, className }: LiveActivityFeedProps) {
  const displayEvents = events.slice(0, maxItems);

  if (displayEvents.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-8 text-muted-foreground", className)}>
        <Package className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {displayEvents.map((event) => {
        const config = eventConfig[event.type];
        const Icon = config.icon;
        const [textColor, bgColor] = config.color.split(" ");

        return (
          <div
            key={event.id}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", bgColor)}>
              <Icon className={cn("w-4 h-4", textColor)} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {event.title}
              </p>
              {event.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {event.description}
                </p>
              )}
            </div>

            <div className="flex-shrink-0 text-[10px] text-muted-foreground">
              {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type { ActivityEvent };
