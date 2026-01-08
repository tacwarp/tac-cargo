"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ChevronRightIcon, PackageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiPulseLine } from "@remixicon/react";

import { cn } from "@/lib/utils";

const ProductInsightsCard = ({ className }: { className?: string }) => {
  return (
    <Card
      className={cn(
        "glass-card noise-overlay relative overflow-hidden border-none shadow-none",
        className,
      )}
    >
      <CardHeader className="border-border/40 border-b pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-foreground text-xs font-bold tracking-widest uppercase">
              Hub Performance
            </span>
            <span className="text-muted-foreground text-[10px] font-medium tracking-tighter uppercase opacity-70">
              Region: Imphal Hub • SYSLOG_MAY_25
            </span>
          </div>
          <RiPulseLine className="text-primary size-4" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.2em] uppercase">
              Reliability Index
            </span>
            <span className="text-kpi text-primary shadow-glow-primary/20 text-4xl font-black tracking-tighter">
              98.5%
            </span>
          </div>
          <div className="bg-secondary dark:bg-card border-primary/20 text-primary shadow-primary/10 rounded-lg border p-3 shadow-lg">
            <PackageIcon className="size-5" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.2em] uppercase">
            System Throughput
          </span>
          <span className="text-kpi text-2xl font-bold">
            2,123{" "}
            <span className="text-muted-foreground/40 ml-1 text-[10px] font-medium tracking-normal uppercase">
              Manifests
            </span>
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.2em] uppercase">
              Capacity Load
            </span>
            <span className="text-kpi text-foreground text-sm font-bold">
              87%
            </span>
          </div>
          <div
            className="bg-secondary/30 border-border/20 h-1.5 w-full overflow-hidden rounded-full border"
            role="progressbar"
            aria-valuenow={87}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Capacity load"
          >
            <div className="from-primary via-accent to-primary h-full w-[87%] bg-gradient-to-r" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="hover:bg-primary/10 border-border/40 h-9 w-full text-[10px] font-bold tracking-widest uppercase transition-all"
        >
          Access Detailed Telemetry
          <ChevronRightIcon className="ml-2 size-3 opacity-60" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductInsightsCard;
