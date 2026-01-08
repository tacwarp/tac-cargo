/**
 * @fileoverview Unified Metric Card Component
 * Consolidates 11 card variants (StatCard, KPICard, ProgressCard, FleetCard, etc.)
 * into a single parameterized component using Class Variance Authority
 */

"use client";

import { type LucideIcon } from "lucide-react";
import { RiArrowUpLine, RiArrowDownLine } from "@remixicon/react";
import { cva, type VariantProps } from "class-variance-authority";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Metric Card Variants
 * Defines visual styles for different use cases
 */
const metricCardVariants = cva(
  "depth-surface noise-overlay relative overflow-hidden border-none transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:ring-primary/25 hover:shadow-primary/10 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1",
        hero: "hover:shadow-primary/20 hover:shadow-2xl",
        compact: "hover:ring-primary/20 hover:shadow-primary/5 hover:shadow-lg hover:ring-1",
      },
      semantic: {
        default: "",
        success: "border-success/20 bg-success/5",
        warning: "border-warning/20 bg-warning/5",
        danger: "border-destructive/20 bg-destructive/5",
        info: "border-primary/20 bg-primary/5",
      },
      state: {
        default: "",
        active: "ring-primary/30 shadow-primary/10 shadow-lg ring-2",
      },
    },
    defaultVariants: {
      variant: "default",
      semantic: "default",
      state: "default",
    },
  }
);

const iconContainerVariants = cva(
  "shrink-0 transition-all duration-300",
  {
    variants: {
      variant: {
        default: "rounded-lg p-2",
        hero: "rounded-xl p-3",
        compact: "rounded-lg p-2.5",
      },
      semantic: {
        default: "bg-primary/5 text-primary/70 group-hover:bg-primary/15 group-hover:text-primary group-hover:scale-105",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        danger: "bg-destructive/10 text-destructive",
        info: "bg-primary/10 text-primary",
      },
      state: {
        default: "",
        active: "bg-primary text-primary-foreground shadow-primary/30 shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      semantic: "default",
      state: "default",
    },
  }
);

export interface MetricCardProps extends VariantProps<typeof metricCardVariants> {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  variant = "default",
  semantic = "default",
  state = "default",
  className,
}: MetricCardProps) {
  const isActive = state === "active";

  if (variant === "hero") {
    return (
      <Card className={cn(metricCardVariants({ variant, semantic, state }), "group", className)}>
        {/* Gradient accent bar */}
        <div className="from-primary via-accent to-primary absolute top-0 right-0 left-0 h-1 bg-gradient-to-r opacity-80" />

        <CardContent className="px-6 pt-8 pb-6">
          <div className="mb-6 flex items-start justify-between">
            <div className={iconContainerVariants({ variant, semantic, state })}>
              <Icon className="size-6" />
            </div>
            {trend && (
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
                  trend.isPositive
                    ? "bg-success/15 text-success border-success/20 border"
                    : "bg-destructive/15 text-destructive border-destructive/20 border",
                )}
              >
                {trend.isPositive ? (
                  <RiArrowUpLine className="size-3.5" />
                ) : (
                  <RiArrowDownLine className="size-3.5" />
                )}
                {Math.abs(trend.value)}%
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-muted-foreground/60 text-[10px] font-bold tracking-[0.25em] uppercase">
              {title}
            </p>
            <p className="text-kpi text-foreground text-5xl font-black tracking-tighter">
              {value}
            </p>
            {subtitle && (
              <p className="text-muted-foreground/50 pt-1 text-[10px] font-medium tracking-wide uppercase">
                {subtitle}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={cn(metricCardVariants({ variant, semantic, state }), "group", className)}>
        <CardContent className="flex items-center gap-4 p-4">
          <div className={iconContainerVariants({ variant, semantic, state })}>
            <Icon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground/50 truncate text-[9px] font-bold tracking-[0.2em] uppercase">
              {title}
            </p>
            <p className="text-kpi text-foreground text-xl font-bold tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-muted-foreground/40 truncate text-[8px] font-medium tracking-wide uppercase">
                {subtitle}
              </p>
            )}
          </div>
          {trend && (
            <div
              className={cn(
                "shrink-0 text-[10px] font-bold",
                trend.isPositive ? "text-success" : "text-destructive",
              )}
            >
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}%
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn(metricCardVariants({ variant, semantic, state }), "group", className)}>
      {isActive && (
        <div className="via-primary absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent to-transparent" />
      )}

      <CardContent className="px-5 pt-5 pb-4">
        <div className="mb-4 flex items-start justify-between">
          <p className="text-muted-foreground/60 text-[9px] font-bold tracking-[0.2em] uppercase">
            {title}
          </p>
          <div className={iconContainerVariants({ variant, semantic, state })}>
            <Icon className="size-4" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-kpi text-foreground text-3xl font-bold tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-bold",
                  trend.isPositive
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive",
                )}
              >
                {trend.isPositive ? (
                  <RiArrowUpLine className="size-3" />
                ) : (
                  <RiArrowDownLine className="size-3" />
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground/50 text-[9px] font-medium tracking-wide uppercase">
                vs prev
              </span>
            </div>
          )}
          {subtitle && (
            <p className="text-muted-foreground/50 pt-1 text-[10px] font-medium tracking-wide uppercase">
              {subtitle}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
