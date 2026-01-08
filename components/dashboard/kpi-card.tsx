"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  variant?: "default" | "warning" | "success" | "danger";
  loading?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  icon: Icon,
  variant = "default",
  loading = false,
}: KPICardProps) {
  const variantStyles = {
    default: "bg-primary/10 text-primary",
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
    danger: "bg-destructive/10 text-destructive",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("rounded-full p-2", variantStyles[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="bg-muted h-8 animate-pulse rounded" />
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {change && (
              <p className="text-muted-foreground mt-1 text-xs">
                <span
                  className={cn(
                    "font-medium",
                    change.isPositive ? "text-success" : "text-destructive",
                  )}
                >
                  {change.isPositive ? "+" : ""}
                  {change.value}%
                </span>{" "}
                from last period
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
