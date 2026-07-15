'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function TraceabilitySkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
