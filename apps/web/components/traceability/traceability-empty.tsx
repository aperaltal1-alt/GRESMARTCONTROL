'use client';

import { Route, Search } from 'lucide-react';
import { EmptyState } from '@/components/shared/empty-state';
import type { TraceabilitySearchMode } from '@/types/traceability';

interface TraceabilityEmptyProps {
  mode: TraceabilitySearchMode;
}

export function TraceabilityEmpty({ mode }: TraceabilityEmptyProps) {
  return (
    <EmptyState
      icon={mode === 'product' ? Search : Route}
      title="Busca un registro para rastrear"
      description={
        mode === 'product'
          ? 'Ingresa el código o nombre de un producto para ver su historial de movimientos en Kardex.'
          : 'Ingresa el número de una GRE para ver conciliaciones e incidencias asociadas.'
      }
      className="rounded-xl border border-dashed border-border/60 bg-muted/10 py-16"
    />
  );
}
