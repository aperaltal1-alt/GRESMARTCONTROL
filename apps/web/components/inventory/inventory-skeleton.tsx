'use client';

import { Skeleton } from '@/components/ui/skeleton';

export function InventoryTableSkeleton() {
  return (
    <div className="space-y-0 p-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="mb-2 h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}
