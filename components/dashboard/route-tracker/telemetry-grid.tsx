"use client";

import {
  RiSpeedUpLine,
  RiGasStationLine,
  RiTimeLine,
  RiWalletLine,
  RiWindyLine,
  RiAlertLine,
  RiTempHotLine,
  RiCloudLine,
  RiMoreLine,
  RiStarFill,
  RiPhoneLine,
  RiMessage2Line,
} from "@remixicon/react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export function TelemetryGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Metrics Cards (Grid within Grid) */}
      <div className="grid grid-cols-2 gap-4 lg:col-span-4">
        {/* Metric Card 1 */}
        <Card className="bg-card/60 border-border/50 group relative overflow-hidden rounded-2xl p-5 shadow-lg backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <RiSpeedUpLine className="size-12 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
            Avg Speed
          </p>
          <h3 className="text-foreground text-2xl font-semibold tracking-tight">
            64{" "}
            <span className="text-muted-foreground text-sm font-normal">
              km/h
            </span>
          </h3>
          <div className="mt-3 flex items-center gap-1 text-xs text-success">
            <span className="font-bold">+2.4%</span> vs plan
          </div>
        </Card>

        {/* Metric Card 2 */}
        <Card className="bg-card/60 border-border/50 group relative overflow-hidden rounded-2xl p-5 shadow-lg backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <RiGasStationLine className="size-12 text-warning" />
          </div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
            Fuel Econ
          </p>
          <h3 className="text-foreground text-2xl font-semibold tracking-tight">
            3.8{" "}
            <span className="text-muted-foreground text-sm font-normal">
              km/L
            </span>
          </h3>
          <div className="mt-3 flex items-center gap-1 text-xs text-warning">
            High usage
          </div>
        </Card>

        {/* Metric Card 3 */}
        <Card className="bg-card/60 border-border/50 group relative overflow-hidden rounded-2xl p-5 shadow-lg backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <RiTimeLine className="size-12 text-primary" />
          </div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
            Duration
          </p>
          <h3 className="text-foreground text-2xl font-semibold tracking-tight">
            8h{" "}
            <span className="text-muted-foreground text-sm font-normal">
              24m
            </span>
          </h3>
          <div className="text-muted-foreground mt-3 text-xs">
            Since departure
          </div>
        </Card>

        {/* Metric Card 4 */}
        <Card className="bg-card/60 border-border/50 group relative overflow-hidden rounded-2xl p-5 shadow-lg backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <RiWalletLine className="size-12 text-success" />
          </div>
          <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wider uppercase">
            Toll Cost
          </p>
          <h3 className="text-foreground text-2xl font-semibold tracking-tight">
            ₹840
          </h3>
          <div className="text-muted-foreground mt-3 text-xs">
            4 tolls passed
          </div>
        </Card>
      </div>

      {/* Middle Column: Route Conditions */}
      <div className="flex flex-col lg:col-span-5">
        <Card className="bg-card/60 border-border/50 flex h-full flex-col rounded-2xl p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-foreground text-base font-semibold">
              Segment Intelligence
            </h3>
            <button className="text-xs text-primary transition-colors hover:text-primary/80">
              View Map Overlay
            </button>
          </div>

          <div className="flex-1 space-y-4">
            {/* Item 1 */}
            <div className="bg-muted/20 hover:bg-muted/40 hover:border-border/30 group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
                  <RiWindyLine className="size-4" />
                </div>
                <div>
                  <div className="text-foreground text-sm font-medium">
                    Lucknow Bypass
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Flowing smoothly
                  </div>
                </div>
              </div>
              <span className="rounded border border-success/20 bg-success/10 px-2 py-1 text-[10px] font-semibold text-success">
                CLEAR
              </span>
            </div>

            {/* Item 2 */}
            <div className="bg-muted/20 hover:bg-muted/40 hover:border-border/30 group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <RiAlertLine className="size-4" />
                </div>
                <div>
                  <div className="text-foreground text-sm font-medium">
                    NH-27 Connector
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Roadworks ahead (2km)
                  </div>
                </div>
              </div>
              <span className="rounded border border-warning/20 bg-warning/10 px-2 py-1 text-[10px] font-semibold text-warning">
                CAUTION
              </span>
            </div>

            {/* Item 3 */}
            <div className="bg-muted/20 hover:bg-muted/40 hover:border-border/30 group flex items-center justify-between rounded-xl border border-transparent p-3 transition-all">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <RiTempHotLine className="size-4" />
                </div>
                <div>
                  <div className="text-foreground text-sm font-medium">
                    Purvanchal Limit
                  </div>
                  <div className="text-muted-foreground text-xs">
                    High congestion detected
                  </div>
                </div>
              </div>
              <span className="rounded border border-destructive/20 bg-destructive/10 px-2 py-1 text-[10px] font-semibold text-destructive">
                SLOW
              </span>
            </div>

            {/* Item 4 */}
            <div className="bg-muted/20 hover:bg-muted/40 hover:border-border/30 group flex items-center justify-between rounded-xl border border-transparent p-3 opacity-60 transition-all">
              <div className="flex items-center gap-3">
                <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-lg">
                  <RiCloudLine className="size-4" />
                </div>
                <div>
                  <div className="text-foreground text-sm font-medium">
                    Bihar Entry
                  </div>
                  <div className="text-muted-foreground text-xs">
                    Forecast: Heavy Rain
                  </div>
                </div>
              </div>
              <span className="bg-muted text-muted-foreground border-border/30 rounded border px-2 py-1 text-[10px] font-semibold">
                PENDING
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column: Driver/Shipment Card */}
      <div className="lg:col-span-3">
        <Card className="bg-card/60 border-border/50 relative h-full overflow-hidden rounded-2xl p-6 shadow-lg backdrop-blur-xl">
          {/* Gradient Glow for Card */}
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-[50px]"></div>

          <div className="relative z-10 mb-6 flex items-center justify-between">
            <h3 className="text-foreground text-base font-semibold">
              Logistics Unit
            </h3>
            <button className="text-muted-foreground hover:text-foreground">
              <RiMoreLine className="size-4" />
            </button>
          </div>

          {/* Driver Profile */}
          <div className="mb-6 flex items-center gap-4">
            <div className="relative">
              <Image
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                alt="Driver"
                width={56}
                height={56}
                className="ring-border/20 rounded-full object-cover ring-2"
              />
              <div className="border-background absolute right-0 bottom-0 size-3.5 rounded-full border-2 bg-success"></div>
            </div>
            <div>
              <h4 className="text-foreground font-medium">Rajesh Kumar</h4>
              <p className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                <RiStarFill className="size-3 text-warning" />
                4.9 Rating
              </p>
            </div>
          </div>

          <div className="mb-6 flex gap-2">
            <button className="bg-muted/30 hover:bg-muted/50 border-border/30 text-foreground flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors">
              <RiPhoneLine className="size-3.5" /> Call
            </button>
            <button className="bg-muted/30 hover:bg-muted/50 border-border/30 text-foreground flex flex-1 items-center justify-center gap-2 rounded-lg border py-2 text-xs font-medium transition-colors">
              <RiMessage2Line className="size-3.5" /> Msg
            </button>
          </div>

          {/* Shipment Details */}
          <div className="border-border/50 space-y-4 border-t pt-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">AWB Number</span>
              <span className="rounded bg-primary/10 px-2 py-1 font-mono text-xs text-primary">
                #899-221-00
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Cargo Type</span>
              <span className="text-foreground/80 text-sm">Electronics</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Weight</span>
              <span className="text-foreground/80 text-sm">2,450 kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs">Vehicle</span>
              <span className="text-foreground/80 text-sm">
                Tata Prima 5530
              </span>
            </div>
          </div>

          {/* Status Footer */}
          <div className="border-border/50 mt-6 border-t pt-4">
            <div className="flex items-center gap-2">
              <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                <div className="h-full w-[80%] bg-success"></div>
              </div>
              <span className="text-[10px] font-medium text-success">
                On Schedule
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
