"use client";

import { Check, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function TrackingTimeline() {
  const steps = [
    { label: "Picked Up", date: "Oct 24, 09:30", status: "completed" },
    { label: "In Transit", date: "Oct 25, 14:20", status: "completed" },
    { label: "Lucknow Hub", date: "Processing", status: "current" },
    { label: "Out for Delivery", date: "Est. Oct 26", status: "upcoming" },
    { label: "Delivered", date: "--", status: "upcoming" },
  ];

  return (
    <Card className="border-border/50 bg-card p-8 shadow-sm">
      <h3 className="text-foreground mb-6 text-sm font-semibold">
        Shipment Milestones
      </h3>
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="bg-muted absolute top-[15px] left-0 h-0.5 w-full"></div>
        {/* Active Progress Bar (Mocked 50% for now based on 'Lucknow Hub') */}
        <div className="bg-primary absolute top-[15px] left-0 h-0.5 w-3/5"></div>

        <div className="relative z-10 grid grid-cols-5 gap-4">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed";
            const isCurrent = step.status === "current";

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center gap-3 text-center",
                  step.status === "upcoming" && "opacity-50",
                )}
              >
                {/* Icon Circle */}
                <div
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full ring-4 transition-all duration-300",
                    isCompleted
                      ? "bg-primary text-primary-foreground ring-primary/10"
                      : isCurrent
                        ? "bg-background border-primary text-primary ring-primary/10 relative border-2 shadow-sm"
                        : "bg-card border-border text-muted-foreground ring-muted/30 border-2",
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : isCurrent ? (
                    <>
                      <div className="bg-primary size-2.5 animate-pulse rounded-full"></div>
                    </>
                  ) : index === steps.length - 1 ? (
                    <MapPin className="size-4" />
                  ) : (
                    <span className="text-[10px] font-bold">{index + 1}</span>
                  )}
                </div>

                {/* Text Content */}
                <div>
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      isCurrent ? "text-primary" : "text-foreground",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="text-muted-foreground mt-0.5 font-mono text-[10px] font-medium">
                    {step.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
