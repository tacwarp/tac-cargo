import type { ReactNode } from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { cn } from "@/lib/utils";

type StatisticsCardProps = {
  icon: ReactNode;
  value: string;
  title: string;
  changePercentage: string;
  className?: string;
};

const StatisticsCard = ({
  icon,
  value,
  title,
  changePercentage,
  className,
}: StatisticsCardProps) => {
  const numericValue = parseFloat(changePercentage.replace(/[^\d.-]/g, ""));
  const isPositive =
    changePercentage.startsWith("+") ||
    (!changePercentage.startsWith("-") && numericValue > 0);
  const isNeutral = numericValue === 0;

  return (
    <Card
      className={cn(
        "group glass-card relative gap-4 overflow-hidden border-none",
        className,
      )}
    >
      <div className="from-primary/10 absolute inset-0 bg-gradient-to-br via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <CardHeader className="relative z-10 flex items-center">
        <div className="bg-primary/10 text-primary shadow-primary/30 flex size-12 shrink-0 items-center justify-center rounded-xl shadow-lg">
          {icon}
        </div>
        <span className="text-foreground text-4xl font-bold tracking-tight">
          {value}
        </span>
      </CardHeader>
      <CardContent className="relative z-10 flex flex-col gap-2">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          {title}
        </span>
        <p className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-bold",
              isNeutral
                ? "text-muted-foreground bg-muted/50 border-border"
                : isPositive
                  ? "text-success bg-success/10 border-success/20 shadow-success/20 shadow-sm"
                  : "text-destructive bg-destructive/10 border-destructive/20 shadow-destructive/20 shadow-sm",
            )}
            role="status"
            aria-label={`${isNeutral ? "No change" : isPositive ? "Increase of" : "Decrease of"} ${changePercentage}`}
          >
            {!isNeutral && (
              <span aria-hidden="true">{isPositive ? "↑" : "↓"}</span>
            )}
            {changePercentage}
          </span>
          <span className="text-muted-foreground/70 text-xs">vs last week</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default StatisticsCard;
