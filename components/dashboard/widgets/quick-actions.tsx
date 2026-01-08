"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  RiAddLine,
  RiScanLine,
  RiFileTextLine,
  RiSearchLine,
  RiArrowRightLine,
} from "@remixicon/react";

interface QuickAction {
  icon: React.ElementType;
  label: string;
  href: string;
  variant: "primary" | "secondary";
}

const actions: QuickAction[] = [
  {
    icon: RiAddLine,
    label: "New Shipment",
    href: "/dashboard/shipments/new",
    variant: "primary",
  },
  {
    icon: RiScanLine,
    label: "Scan Package",
    href: "/dashboard/scanning",
    variant: "secondary",
  },
  {
    icon: RiFileTextLine,
    label: "Create Manifest",
    href: "/dashboard/manifests/new",
    variant: "secondary",
  },
  {
    icon: RiSearchLine,
    label: "Track AWB",
    href: "/dashboard/tracking",
    variant: "secondary",
  },
];

interface QuickActionsProps {
  className?: string;
}

export function QuickActions({ className }: QuickActionsProps) {
  return (
    <Card
      className={cn(
        "depth-surface noise-overlay overflow-hidden border-none",
        className,
      )}
    >
      <CardHeader className="border-border/30 border-b px-5 pb-3">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-foreground text-xs font-bold tracking-[0.2em] uppercase">
            Quick Actions
          </h3>
          <p className="text-muted-foreground/50 text-[9px] font-medium tracking-wide uppercase">
            Frequently used operations
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              asChild
              variant="ghost"
              className={cn(
                "group h-11 w-full justify-start px-4 transition-all duration-200",
                action.variant === "primary"
                  ? "bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/40 border"
                  : "hover:bg-muted/60 text-foreground/80 hover:text-foreground",
              )}
            >
              <Link href={action.href}>
                <Icon
                  className={cn(
                    "mr-3 size-4 transition-transform group-hover:scale-110",
                    action.variant === "primary" && "text-primary",
                  )}
                />
                <span className="flex-1 text-left text-[11px] font-bold tracking-wide uppercase">
                  {action.label}
                </span>
                <RiArrowRightLine className="size-3.5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-60" />
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
