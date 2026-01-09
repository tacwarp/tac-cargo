import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ElementType } from "react";
import { RiArrowUpLine, RiArrowDownLine } from "@remixicon/react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isActive?: boolean;
  className?: string;
  /** Hero variant for primary KPI spotlight */
  variant?: "default" | "hero" | "compact";
  /** Optional subtitle for additional context */
  subtitle?: string;
}

export function StatCard(props: Readonly<StatCardProps>) {
  if (props.variant === "hero") {
    return <StatCardHero {...props} />;
  }

  if (props.variant === "compact") {
    return <StatCardCompact {...props} />;
  }

  return <StatCardDefault {...props} />;
}

function StatCardHero({
  title,
  value,
  icon: Icon,
  trend,
  isActive,
  className,
  subtitle,
}: Readonly<StatCardProps>) {
  return (
    <Card
      className={cn(
        "depth-surface noise-overlay group relative overflow-hidden border-none transition-all duration-500",
        "hover:shadow-primary/20 hover:shadow-2xl",
        isActive && "ring-primary/40 shadow-primary/15 shadow-xl ring-2",
        className,
      )}
    >
      {/* Gradient accent bar */}
      <div className="from-primary via-accent to-primary absolute top-0 right-0 left-0 h-1 bg-gradient-to-r opacity-80" />

      <CardContent className="px-6 pt-8 pb-6">
        <div className="mb-6 flex items-start justify-between">
          <div
            className={cn(
              "rounded-xl p-3 transition-all duration-300",
              isActive
                ? "bg-primary text-primary-foreground shadow-primary/40 shadow-lg"
                : "bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110",
            )}
          >
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

function StatCardCompact({
  title,
  value,
  icon: Icon,
  trend,
  isActive,
  className,
  subtitle,
}: Readonly<StatCardProps>) {
  return (
    <Card
      className={cn(
        "depth-surface noise-overlay group overflow-hidden border-none transition-all duration-300",
        "hover:ring-primary/20 hover:shadow-primary/5 hover:shadow-lg hover:ring-1",
        isActive && "ring-primary/30 shadow-primary/10 shadow-md ring-1",
        className,
      )}
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={cn(
            "shrink-0 rounded-lg p-2.5 transition-all duration-300",
            isActive
              ? "bg-primary/15 text-primary"
              : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
          )}
        >
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

function StatCardDefault({
  title,
  value,
  icon: Icon,
  trend,
  isActive,
  className,
}: Readonly<StatCardProps>) {
  return (
    <Card
      className={cn(
        "depth-surface noise-overlay group relative overflow-hidden border-none transition-all duration-300",
        "hover:ring-primary/25 hover:shadow-primary/10 hover:-translate-y-0.5 hover:shadow-xl hover:ring-1",
        isActive && "ring-primary/30 shadow-primary/10 shadow-lg ring-2",
        className,
      )}
    >
      {/* Subtle top accent on active */}
      {isActive && (
        <div className="via-primary absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent to-transparent" />
      )}

      <CardContent className="px-5 pt-5 pb-4">
        <div className="mb-4 flex items-start justify-between">
          <p className="text-muted-foreground/60 text-[9px] font-bold tracking-[0.2em] uppercase">
            {title}
          </p>
          <div
            className={cn(
              "rounded-lg p-2 transition-all duration-300",
              isActive
                ? "bg-primary text-primary-foreground shadow-primary/30 shadow-sm"
                : "bg-primary/5 text-primary/70 group-hover:bg-primary/15 group-hover:text-primary group-hover:scale-105",
            )}
          >
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
        </div>
      </CardContent>
    </Card>
  );
}
