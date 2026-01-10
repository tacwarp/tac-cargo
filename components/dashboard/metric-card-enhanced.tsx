"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardEnhancedProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  color?: "default" | "success" | "warning" | "destructive" | "primary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function MetricCardEnhanced({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon,
  trend,
  color = "default",
  size = "md",
  loading = false,
}: MetricCardEnhancedProps) {
  const colorClasses = {
    default: "text-foreground",
    success: "text-emerald-500",
    warning: "text-amber-500",
    destructive: "text-red-500",
    primary: "text-primary",
  };

  const bgClasses = {
    default: "bg-card",
    success: "bg-emerald-500/5 border-emerald-500/20",
    warning: "bg-amber-500/5 border-amber-500/20",
    destructive: "bg-red-500/5 border-red-500/20",
    primary: "bg-primary/5 border-primary/20",
  };

  const sizeClasses = {
    sm: { card: "p-3", title: "text-xs", value: "text-lg", icon: "w-4 h-4" },
    md: { card: "p-4", title: "text-xs", value: "text-2xl", icon: "w-5 h-5" },
    lg: { card: "p-6", title: "text-sm", value: "text-3xl", icon: "w-6 h-6" },
  };

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500" : "text-muted-foreground";

  if (loading) {
    return (
      <div className={cn("rounded-xl border", bgClasses[color], sizeClasses[size].card)}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border transition-all hover:shadow-md", bgClasses[color], sizeClasses[size].card)}>
      <div className="flex items-start justify-between">
        <span className={cn("font-medium text-muted-foreground uppercase tracking-wider", sizeClasses[size].title)}>
          {title}
        </span>
        {icon && (
          <div className={cn("opacity-60", colorClasses[color], sizeClasses[size].icon)}>
            {icon}
          </div>
        )}
      </div>
      
      <div className={cn("font-bold mt-2", colorClasses[color], sizeClasses[size].value)}>
        {value}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-1 mt-2">
          <TrendIcon className={cn("w-3 h-3", trendColor)} />
          <span className={cn("text-xs font-medium", trendColor)}>
            {change > 0 ? "+" : ""}{change}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}
