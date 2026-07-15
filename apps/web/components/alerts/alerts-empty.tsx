'use client';

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertsEmptyProps {
  title?: string;
  description?: string;
  className?: string;
}

export function AlertsEmpty({
  title = 'No hay alertas',
  description = 'No se encontraron alertas en el sistema.',
  className,
}: AlertsEmptyProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/10 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/50">
        <Bell className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
