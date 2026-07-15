'use client';

import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardEmptyProps {
  title: string;
  description?: string;
  className?: string;
}

export function DashboardEmpty({ title, description, className }: DashboardEmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 p-8 text-center',
        className,
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Inbox className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-xs text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
