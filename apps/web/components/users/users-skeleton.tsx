'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function UsersTableSkeleton() {
  return (
    <div className="space-y-0 p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-border/20 px-4 py-3 last:border-0"
        >
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="ml-auto h-8 w-16" />
        </div>
      ))}
    </div>
  );
}
