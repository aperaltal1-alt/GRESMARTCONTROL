'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function ProductsTableSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center gap-4 border-b border-border/40 p-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="ml-auto h-9 w-28" />
      </div>
      <div className="space-y-0 p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-border/20 px-4 py-3 last:border-0">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="ml-auto h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
