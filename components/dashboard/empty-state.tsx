import { type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  variant?: "default" | "compact" | "card";
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  className,
}: EmptyStateProps) {
  const isCompact = variant === "compact";
  const isCard = variant === "card";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        isCompact ? "py-8" : "py-16",
        isCard && "bg-card border-border/50 rounded-lg border p-8",
        className,
      )}
    >
      <div
        className={cn(
          "from-primary/10 to-accent/10 border-primary/20 mb-4 rounded-full border bg-gradient-to-br",
          isCompact ? "p-3" : "p-5",
        )}
      >
        <Icon
          className={cn("text-primary/70", isCompact ? "size-6" : "size-10")}
        />
      </div>
      <h3
        className={cn(
          "text-foreground mb-2 font-semibold",
          isCompact ? "text-base" : "text-xl",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "text-muted-foreground max-w-md leading-relaxed",
          isCompact ? "mb-4 text-xs" : "mb-6 text-sm",
        )}
      >
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (action.href || action.onClick) && (
            <Button
              size={isCompact ? "sm" : "default"}
              onClick={action.onClick}
              asChild={!!action.href}
            >
              {action.href ? (
                <Link href={action.href}>{action.label}</Link>
              ) : (
                action.label
              )}
            </Button>
          )}
          {secondaryAction &&
            (secondaryAction.href || secondaryAction.onClick) && (
              <Button
                variant="outline"
                size={isCompact ? "sm" : "default"}
                onClick={secondaryAction.onClick}
                asChild={!!secondaryAction.href}
              >
                {secondaryAction.href ? (
                  <Link href={secondaryAction.href}>
                    {secondaryAction.label}
                  </Link>
                ) : (
                  secondaryAction.label
                )}
              </Button>
            )}
        </div>
      )}
    </div>
  );
}
