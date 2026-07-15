'use client';

import { Badge } from '@/components/ui/badge';
import { prioridadVariant } from '@/lib/dashboard/utils';
import { cn } from '@/lib/utils';
import type { IncidentPrioridad } from '@/types/incidents';

const PRIORIDAD_LABELS: Record<string, string> = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
};

interface IncidentPrioridadBadgeProps {
  prioridad: IncidentPrioridad | string;
  className?: string;
}

export function IncidentPrioridadBadge({ prioridad, className }: IncidentPrioridadBadgeProps) {
  return (
    <Badge variant={prioridadVariant(prioridad)} className={cn('font-medium', className)}>
      {PRIORIDAD_LABELS[prioridad] ?? prioridad}
    </Badge>
  );
}
