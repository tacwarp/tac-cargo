"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Truck, Plane, Ship, Package } from "lucide-react";

interface RoutePoint {
  id: string;
  name: string;
  code: string;
  city?: string;
  lat?: number;
  lng?: number;
  type: "origin" | "destination" | "hub";
}

interface Vehicle {
  id: string;
  type: "truck" | "plane" | "ship" | "bike";
  progress: number;
  status: "moving" | "stopped" | "delayed";
  driverName?: string;
  packages?: number;
}

interface AnimatedRouteMapProps {
  origin: RoutePoint;
  destination: RoutePoint;
  vehicle?: Vehicle;
  className?: string;
}

const vehicleIcons = {
  truck: Truck,
  plane: Plane,
  ship: Ship,
  bike: Package,
};

export function AnimatedRouteMap({
  origin,
  destination,
  vehicle,
  className,
}: AnimatedRouteMapProps) {
  const [progress, setProgress] = useState(vehicle?.progress || 0);
  const VehicleIcon = vehicle ? vehicleIcons[vehicle.type] : Truck;

  useEffect(() => {
    if (vehicle?.status === "moving") {
      const interval = setInterval(() => {
        setProgress((p) => (p >= 100 ? 0 : p + 0.5));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [vehicle?.status]);

  return (
    <div className={cn("relative w-full h-full min-h-[300px]", className)}>
      {/* Animated background grid */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, hsl(var(--chart-2) / 0.1) 0%, transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Route visualization */}
      <div className="absolute inset-0 flex items-center justify-center px-16">
        <div className="flex items-center w-full max-w-2xl">
          {/* Origin point */}
          <div className="flex flex-col items-center z-10">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <MapPin className="w-6 h-6 text-emerald-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] font-bold text-white">
                ✓
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="text-sm font-semibold text-foreground">{origin.code}</div>
              <div className="text-xs text-muted-foreground">{origin.city || origin.name}</div>
            </div>
          </div>

          {/* Route line with vehicle */}
          <div className="flex-1 mx-6 relative">
            {/* Background track */}
            <div className="h-1 bg-muted rounded-full" />
            
            {/* Progress track */}
            <div
              className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />

            {/* Animated dots along the route */}
            <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse"
                  style={{
                    left: `${(i + 1) * 20}%`,
                    top: "-1px",
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* Vehicle marker */}
            <div
              className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
              style={{ left: `calc(${progress}% - 16px)` }}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shadow-lg",
                vehicle?.status === "delayed"
                  ? "bg-amber-500 shadow-amber-500/30"
                  : "bg-primary shadow-primary/30",
                vehicle?.status === "moving" && "animate-pulse"
              )}>
                <VehicleIcon className="w-4 h-4 text-white" />
              </div>
              
              {/* Glow effect */}
              <div className={cn(
                "absolute inset-0 rounded-full blur-md -z-10",
                vehicle?.status === "delayed" ? "bg-amber-500/50" : "bg-primary/50"
              )} />
            </div>

            {/* Distance markers */}
            <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-[10px] text-muted-foreground">
              <span>0 km</span>
              <span className="text-primary font-medium">{Math.round(progress)}%</span>
              <span>Est. 450 km</span>
            </div>
          </div>

          {/* Destination point */}
          <div className="flex flex-col items-center z-10">
            <div className={cn(
              "w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all",
              progress >= 100
                ? "bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                : "bg-muted border-border"
            )}>
              <MapPin className={cn(
                "w-6 h-6",
                progress >= 100 ? "text-emerald-500" : "text-muted-foreground"
              )} />
            </div>
            <div className="mt-3 text-center">
              <div className={cn(
                "text-sm font-semibold",
                progress >= 100 ? "text-foreground" : "text-muted-foreground"
              )}>
                {destination.code}
              </div>
              <div className="text-xs text-muted-foreground">{destination.city || destination.name}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      {vehicle && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className={cn(
            "px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2",
            vehicle.status === "moving" && "bg-primary/10 text-primary",
            vehicle.status === "stopped" && "bg-muted text-muted-foreground",
            vehicle.status === "delayed" && "bg-amber-500/10 text-amber-500"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              vehicle.status === "moving" && "bg-primary animate-pulse",
              vehicle.status === "stopped" && "bg-muted-foreground",
              vehicle.status === "delayed" && "bg-amber-500 animate-pulse"
            )} />
            {vehicle.status === "moving" && "In Transit"}
            {vehicle.status === "stopped" && "Stopped"}
            {vehicle.status === "delayed" && "Delayed"}
            {vehicle.packages && ` • ${vehicle.packages} packages`}
          </div>
        </div>
      )}
    </div>
  );
}
