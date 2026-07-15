'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { ChartSkeleton, KpiGridSkeleton } from '@/components/dashboard/dashboard-skeleton';

export function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-36" />
      </div>

      <div className="rounded-xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm">
        <Skeleton className="mb-4 h-5 w-40" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
      </div>

      <KpiGridSkeleton />

      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      <div className="rounded-xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm">
        <Skeleton className="mb-4 h-5 w-44" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
