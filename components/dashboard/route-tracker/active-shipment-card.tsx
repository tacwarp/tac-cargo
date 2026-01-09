"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  RiUser3Line,
  RiPhoneLine,
  RiMapPin2Line,
  RiBox3Line,
  RiScales2Line,
} from "@remixicon/react";

interface ActiveShipmentCardProps {
  className?: string;
  awb?: string;
  status?: "in-transit" | "delivered" | "pending" | "delayed";
  driver?: string;
  phone?: string;
  currentLocation?: string;
  packages?: number;
  weight?: string;
  eta?: string;
}

export function ActiveShipmentCard({
  className,
  awb = "TAC-2024-889547",
  status = "in-transit",
  driver = "Rajesh Kumar",
  phone = "+91 98765 43210",
  currentLocation = "Near Patna, Bihar",
  packages = 12,
  weight = "450 kg",
  eta = "36h 15m",
}: ActiveShipmentCardProps) {
  const statusConfig = {
    "in-transit": {
      label: "In Transit",
      class: "bg-warning/10 text-warning border-warning/20",
    },
    delivered: {
      label: "Delivered",
      class: "bg-success/10 text-success border-success/20",
    },
    pending: { label: "Pending", class: "bg-info/10 text-info border-info/20" },
    delayed: {
      label: "Delayed",
      class: "bg-destructive/10 text-destructive border-destructive/20",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <Card
      className={cn(
        "depth-surface noise-overlay overflow-hidden border-none",
        className,
      )}
    >
      {/* Status Accent Bar */}
      <div
        className={cn(
          "h-1 w-full",
          status === "in-transit" &&
            "from-warning via-warning/70 to-warning/40 bg-gradient-to-r",
          status === "delivered" &&
            "from-success via-success/70 to-success/40 bg-gradient-to-r",
          status === "pending" &&
            "from-info via-info/70 to-info/40 bg-gradient-to-r",
          status === "delayed" &&
            "from-destructive via-destructive/70 to-destructive/40 bg-gradient-to-r",
        )}
      />

      <CardContent className="p-5">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-muted-foreground/50 mb-1 text-[9px] font-bold tracking-[0.25em] uppercase">
              AWB Number
            </p>
            <p className="text-foreground font-mono text-lg font-black tracking-tight">
              {awb}
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold tracking-wide uppercase",
              currentStatus.class,
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                status === "in-transit" && "bg-warning animate-pulse",
                status === "delivered" && "bg-success",
                status === "pending" && "bg-info",
                status === "delayed" && "bg-destructive animate-pulse",
              )}
            />
            {currentStatus.label}
          </div>
        </div>

        {/* ETA Display */}
        <div className="from-primary/10 via-accent/5 border-primary/10 mb-5 rounded-xl border bg-gradient-to-br to-transparent p-4">
          <p className="text-muted-foreground/60 mb-1 text-[9px] font-bold tracking-[0.2em] uppercase">
            Estimated Arrival
          </p>
          <p className="text-primary text-3xl font-black tracking-tight">
            {eta}
          </p>
        </div>

        {/* Driver Info */}
        <div className="border-border/30 mb-5 space-y-3 border-b pb-5">
          <div className="flex items-center gap-3">
            <div className="bg-muted/50 rounded-lg p-2">
              <RiUser3Line className="text-muted-foreground size-4" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground/50 text-[9px] font-medium tracking-wide uppercase">
                Driver
              </p>
              <p className="text-foreground text-sm font-bold">{driver}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-muted/50 rounded-lg p-2">
              <RiPhoneLine className="text-muted-foreground size-4" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground/50 text-[9px] font-medium tracking-wide uppercase">
                Contact
              </p>
              <p className="text-foreground font-mono text-sm font-bold">
                {phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-warning/10 rounded-lg p-2">
              <RiMapPin2Line className="text-warning size-4" />
            </div>
            <div className="flex-1">
              <p className="text-muted-foreground/50 text-[9px] font-medium tracking-wide uppercase">
                Current Location
              </p>
              <p className="text-foreground text-sm font-bold">
                {currentLocation}
              </p>
            </div>
          </div>
        </div>

        {/* Cargo Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 flex items-center gap-3 rounded-lg p-3">
            <RiBox3Line className="text-primary size-5" />
            <div>
              <p className="text-muted-foreground/50 text-[9px] font-medium uppercase">
                Packages
              </p>
              <p className="text-foreground text-sm font-bold">{packages}</p>
            </div>
          </div>
          <div className="bg-muted/30 flex items-center gap-3 rounded-lg p-3">
            <RiScales2Line className="text-primary size-5" />
            <div>
              <p className="text-muted-foreground/50 text-[9px] font-medium uppercase">
                Weight
              </p>
              <p className="text-foreground text-sm font-bold">{weight}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
