"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Skeleton for KPI/Stat cards grid
 */
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="depth-surface">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-3 h-12 w-24" />
            <Skeleton className="h-4 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/**
 * Skeleton for data tables
 */
export function TableSkeleton({
  rows = 5,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-border/50 border-b p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-3 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableCell key={colIdx}>
                  <Skeleton className="h-4 w-full max-w-[120px]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

/**
 * Skeleton for chart cards
 */
export function ChartSkeleton() {
  return (
    <Card className="chart-container p-0">
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for the main dashboard page
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <StatCardsSkeleton count={4} />
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton rows={5} columns={6} />
    </div>
  );
}

/**
 * Skeleton for shipments list page
 */
export function ShipmentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-3">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
      <TableSkeleton rows={8} columns={7} />
    </div>
  );
}

/**
 * Skeleton for tracking page
 */
export function TrackingSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="mx-auto flex max-w-xl flex-col gap-4">
          <Skeleton className="mx-auto h-6 w-48" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="mx-auto h-10 w-32" />
        </div>
      </Card>
      <Card className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/**
 * Skeleton for manifest page
 */
export function ManifestSkeleton() {
  return (
    <div className="space-y-6">
      <StatCardsSkeleton count={3} />
      <TableSkeleton rows={6} columns={5} />
    </div>
  );
}

/**
 * Skeleton for invoice page
 */
export function InvoiceSkeleton() {
  return (
    <div className="space-y-6">
      <StatCardsSkeleton count={4} />
      <TableSkeleton rows={6} columns={6} />
    </div>
  );
}

/**
 * Generic page skeleton with title
 */
export function PageSkeleton({ title }: { title?: string }) {
  return (
    <div className="space-y-6">
      {title && (
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      )}
      <StatCardsSkeleton count={4} />
      <TableSkeleton rows={5} columns={5} />
    </div>
  );
}
