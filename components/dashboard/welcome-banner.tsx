"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, X } from "lucide-react";
import { useState } from "react";

interface WelcomeBannerProps {
  userName?: string;
  greeting?: string;
  showQuickStats?: boolean;
  stats?: {
    todayShipments?: number;
    pendingTasks?: number;
    revenue?: number;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function WelcomeBanner({
  userName = "there",
  greeting,
  showQuickStats = true,
  stats,
  dismissible = true,
  onDismiss,
  className,
}: WelcomeBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const displayGreeting = greeting || getGreeting();

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
        "border border-primary/20",
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 80% 20%, hsl(var(--primary) / 0.2) 0%, transparent 50%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 0%, transparent 50%, hsl(var(--primary) / 0.03) 50%, hsl(var(--primary) / 0.03) 100%),
              linear-gradient(transparent 0%, transparent 50%, hsl(var(--primary) / 0.03) 50%, hsl(var(--primary) / 0.03) 100%)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="relative flex items-center justify-between p-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-1">
            {displayGreeting}, {userName}!
          </h1>
          
          <p className="text-sm text-muted-foreground mb-4">
            Here&apos;s what&apos;s happening with your logistics operations today.
          </p>

          {showQuickStats && stats && (
            <div className="flex items-center gap-6">
              {stats.todayShipments !== undefined && (
                <div>
                  <div className="text-xl font-bold text-foreground">
                    {stats.todayShipments}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Today&apos;s Shipments
                  </div>
                </div>
              )}
              {stats.pendingTasks !== undefined && (
                <div>
                  <div className="text-xl font-bold text-amber-500">
                    {stats.pendingTasks}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pending Tasks
                  </div>
                </div>
              )}
              {stats.revenue !== undefined && (
                <div>
                  <div className="text-xl font-bold text-emerald-500">
                    ₹{(stats.revenue / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Today&apos;s Revenue
                  </div>
                </div>
              )}
            </div>
          )}

          <Link
            href="/dashboard/shipments?action=create"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Create Shipment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Illustration */}
        <div className="hidden lg:block relative w-48 h-48 flex-shrink-0">
          <Image
            src="/images/dashboard-welcome.png"
            alt="Dashboard Welcome"
            fill
            sizes="192px"
            className="object-contain"
            priority
          />
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
}
