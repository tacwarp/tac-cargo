"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GlassmorphismCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "subtle" | "gradient";
  blur?: "sm" | "md" | "lg";
  glow?: boolean;
  glowColor?: string;
}

export const GlassmorphismCard = forwardRef<HTMLDivElement, GlassmorphismCardProps>(
  ({ className, variant = "default", blur = "md", glow = false, glowColor, children, ...props }, ref) => {
    const blurClasses = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
    };

    const variantClasses = {
      default: "bg-card/80 border-border/50",
      elevated: "bg-card/90 border-border/60 shadow-lg shadow-black/5",
      subtle: "bg-card/60 border-border/30",
      gradient: "bg-gradient-to-br from-card/90 via-card/80 to-card/70 border-border/50",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-xl border transition-all duration-300",
          blurClasses[blur],
          variantClasses[variant],
          glow && "shadow-[0_0_30px_-5px_var(--glow-color,hsl(var(--primary)/0.3))]",
          className
        )}
        style={glowColor ? { "--glow-color": glowColor } as React.CSSProperties : undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassmorphismCard.displayName = "GlassmorphismCard";

interface GlassmorphismStatProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label?: string };
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function GlassmorphismStat({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = "default",
}: GlassmorphismStatProps) {
  const variantStyles = {
    default: {
      card: "from-slate-500/10 to-slate-600/5",
      icon: "bg-slate-500/20 text-slate-500",
      value: "text-foreground",
    },
    success: {
      card: "from-emerald-500/10 to-emerald-600/5",
      icon: "bg-emerald-500/20 text-emerald-500",
      value: "text-emerald-500",
    },
    warning: {
      card: "from-amber-500/10 to-amber-600/5",
      icon: "bg-amber-500/20 text-amber-500",
      value: "text-amber-500",
    },
    danger: {
      card: "from-red-500/10 to-red-600/5",
      icon: "bg-red-500/20 text-red-500",
      value: "text-red-500",
    },
    info: {
      card: "from-blue-500/10 to-blue-600/5",
      icon: "bg-blue-500/20 text-blue-500",
      value: "text-blue-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <GlassmorphismCard
      variant="gradient"
      className={cn("p-5 bg-gradient-to-br", styles.card)}
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div className={cn("p-2.5 rounded-xl", styles.icon)}>
            {icon}
          </div>
        )}
        {trend && (
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend.value >= 0
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500"
          )}>
            {trend.value >= 0 ? "+" : ""}{trend.value}%
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <div className={cn("text-3xl font-bold tracking-tight", styles.value)}>
          {value}
        </div>
        <div className="text-sm font-medium text-foreground/80 mt-1">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
    </GlassmorphismCard>
  );
}

interface GlassmorphismBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  pulse?: boolean;
}

export function GlassmorphismBadge({
  children,
  variant = "default",
  size = "sm",
  pulse = false,
}: GlassmorphismBadgeProps) {
  const variantClasses = {
    default: "bg-muted/80 text-muted-foreground border-border/50",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm font-medium",
        variantClasses[variant],
        sizeClasses[size]
      )}
    >
      {pulse && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full animate-pulse",
          variant === "success" && "bg-emerald-500",
          variant === "warning" && "bg-amber-500",
          variant === "danger" && "bg-red-500",
          variant === "info" && "bg-blue-500",
          variant === "default" && "bg-muted-foreground"
        )} />
      )}
      {children}
    </span>
  );
}
