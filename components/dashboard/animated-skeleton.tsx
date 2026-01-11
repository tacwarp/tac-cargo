"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50 relative overflow-hidden",
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:animate-[shimmer_2s_infinite]",
        "after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent",
        className
      )}
      style={style}
    />
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-10 h-10 rounded-xl" />
        <Skeleton className="w-4 h-4 rounded" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-4 w-24 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function ChartSkeleton({ height = 200 }: { height?: number }) {
  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="flex justify-between items-center mb-4">
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className={`relative`} style={{ height }}>
        <div className="absolute inset-0 flex items-end gap-2 p-4">
          {[40, 65, 55, 80, 45, 70, 50, 85, 60, 75, 55, 90].map((h, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-8 w-8 rounded" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      {[...Array(rows)].map((_, i) => (
        <TableRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function PipelineSkeleton() {
  return (
    <div className="flex items-center gap-2 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center min-w-[100px] px-4 py-3">
            <Skeleton className="w-10 h-10 rounded-full mb-2" />
            <Skeleton className="h-6 w-8 mb-1" />
            <Skeleton className="h-3 w-16" />
          </div>
          {i < 5 && <Skeleton className="w-8 h-0.5" />}
        </div>
      ))}
    </div>
  );
}

export function ActivityFeedSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-2 p-4">
      {[...Array(items)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-2">
          <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>

      {/* Pipeline */}
      <div className="rounded-xl border border-border bg-card">
        <PipelineSkeleton />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton height={250} />
        </div>
        <div className="rounded-xl border border-border bg-card">
          <div className="p-4 border-b border-border">
            <Skeleton className="h-5 w-32" />
          </div>
          <ActivityFeedSkeleton />
        </div>
      </div>
    </div>
  );
}
