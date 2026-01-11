"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  RiPhoneFill,
  RiGasStationFill,
  RiTimeLine,
  RiMapPinLine,
  RiInformationLine,
  RiDatabase2Line,
  RiGlobalLine,
} from "@remixicon/react";

interface FleetCardProps {
  id: string;
  driverName: string;
  driverAvatar: string;
  phoneNumber?: string;
  fuelLevel: number; // Liters
  timeRemaining: string;
  currentLocation: string;
  stopsRemaining: number;
  capacityStatus: ("violet" | "yellow" | "zinc")[];
  className?: string;
}

export function FleetCard({
  id,
  driverName,
  driverAvatar,
  phoneNumber = "01:54:38",
  fuelLevel,
  timeRemaining,
  currentLocation,
  stopsRemaining,
  capacityStatus,
  className,
}: FleetCardProps) {
  return (
    <div
      className={cn(
        "bg-card border-border/50 hover:border-primary/20 group hover:shadow-primary/5 rounded-[24px] border p-6 transition-all duration-300 hover:shadow-lg",
        className,
      )}
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex gap-4">
          <Image
            src={driverAvatar}
            alt={driverName}
            width={48}
            height={48}
            className="border-border rounded-full border-2 object-cover"
          />
          <div>
            <h3 className="text-foreground font-display text-lg leading-tight font-medium">
              {driverName}
            </h3>
            <div className="bg-muted/50 border-border/50 mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5">
              <RiPhoneFill size={12} className="text-foreground/80" />
              <span className="text-muted-foreground font-mono text-xs">
                {phoneNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6 flex items-center gap-6">
        <div className="flex items-center gap-2">
          <RiGasStationFill
            size={16}
            className="text-success fill-success/20"
          />
          <span className="text-success text-sm font-medium">
            {fuelLevel} L
          </span>
        </div>
        <div className="flex items-center gap-2">
          <RiTimeLine size={16} className="text-foreground" />
          <span className="text-muted-foreground text-sm font-medium">
            {timeRemaining}
          </span>
        </div>
      </div>

      {/* Route Info */}
      <div className="border-border/50 mb-4 flex items-center justify-between border-t py-4">
        <div className="text-foreground/80 flex items-center gap-2 text-sm">
          <RiMapPinLine size={16} />
          <span>{currentLocation}</span>
        </div>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <RiInformationLine size={14} />
          <span>{stopsRemaining} stops</span>
        </div>
      </div>

      {/* Capacity Visualization Dots */}
      <div className="flex flex-wrap gap-1.5">
        {capacityStatus.map((status, index) => (
          <div
            key={index}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-all duration-500",
              status === "violet" &&
              "bg-primary shadow-lg shadow-primary/40",
              status === "yellow" &&
              "bg-warning shadow-lg shadow-warning/40",
              status === "zinc" && "bg-muted",
            )}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="text-muted-foreground mt-4 flex items-center justify-between text-xs font-medium">
        <span>ID {id}</span>
        <div className="text-foreground flex gap-2 opacity-50">
          <RiDatabase2Line size={14} />
          <RiGlobalLine size={14} />
        </div>
      </div>
    </div>
  );
}
