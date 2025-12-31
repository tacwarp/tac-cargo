/**
 * @fileoverview Dashboard loading state
 * @module app/(dashboard)/loading
 * 
 * Displays a loading skeleton while dashboard content is being fetched.
 * This file is automatically used by Next.js for route transitions.
 */

import { Skeleton } from '@/components/ui/skeleton'

/**
 * Dashboard loading skeleton component.
 * 
 * Renders a skeleton UI that matches the dashboard layout structure
 * to provide a smooth loading experience.
 */
export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page header skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <div className="mt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Chart area */}
        <div className="rounded-lg border bg-card p-6 lg:col-span-4">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="h-[300px] w-full" />
        </div>

        {/* Side content */}
        <div className="rounded-lg border bg-card p-6 lg:col-span-3">
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="border-b p-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {/* Table header */}
            <div className="flex gap-4 border-b pb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1" />
              ))}
            </div>
            {/* Table rows */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 py-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 flex-1" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
