"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { TrackingEvent } from "@/types/tracking";
import { CheckCircle2, Clock, Truck, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrackingTimeline({ events }: { events: TrackingEvent[] }) {
  // Sort events by timestamp descending for the list
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  const iconKeywordMap: Record<string, typeof CheckCircle2> = {
    deliver: CheckCircle2,
    flight: Plane,
    air: Plane,
    truck: Truck,
    drive: Truck,
    road: Truck,
    process: Clock,
    book: Clock,
  };

  const getIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    for (const [keyword, icon] of Object.entries(iconKeywordMap)) {
      if (lowerLabel.includes(keyword)) return icon;
    }
    return Clock;
  };

  return (
    <Accordion
      type="single"
      collapsible
      className="bg-card/50 w-full overflow-hidden rounded-xl border"
    >
      <AccordionItem value="history" className="border-none">
        <AccordionTrigger className="hover:bg-muted/50 px-6 py-4 transition-colors">
          <span className="text-sm font-medium">Full Tracking History</span>
        </AccordionTrigger>
        <AccordionContent className="px-6 pt-2 pb-6">
          <div className="relative space-y-0 pt-4 pl-10 sm:pl-12">
            {/* Timeline vertical line */}
            <div className="bg-muted absolute top-0 bottom-4 left-[19px] w-0.5 sm:left-[23px]" />

            {sortedEvents.map((e, index) => {
              const isLatest = index === 0;
              const Icon = getIcon(e.label);
              return (
                <div key={e.id} className="relative pb-8 last:pb-2">
                  {/* Timeline Node Icon */}
                  <div
                    className={cn(
                      "ring-background absolute top-0 -left-[32px] z-10 flex h-8 w-8 items-center justify-center rounded-full ring-4 sm:-left-[36px]",
                      isLatest
                        ? "bg-primary text-primary-foreground shadow-primary/20 shadow-lg"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p
                        className={cn(
                          "text-sm leading-tight font-semibold",
                          isLatest
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {e.label}
                      </p>
                      <p className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
                        <span className="bg-muted-foreground/40 h-1 w-1 rounded-full" />
                        {e.location}
                      </p>
                    </div>
                    <div className="text-muted-foreground bg-muted/30 border-border/50 w-fit rounded-md border px-2 py-0.5 font-mono text-[10px] sm:text-xs">
                      {new Date(e.timestamp).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
