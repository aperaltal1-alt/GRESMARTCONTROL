'use client';

import { Badge } from '@/components/ui/badge';
import { incidentEstadoLabel, incidentEstadoVariant } from '@/lib/incidents/utils';
import { cn } from '@/lib/utils';
import type { IncidentEstado } from '@/types/incidents';

interface IncidentEstadoBadgeProps {
  estado: IncidentEstado | string;
  className?: string;
}

export function IncidentEstadoBadge({ estado, className }: IncidentEstadoBadgeProps) {
  return (
    <Badge variant={incidentEstadoVariant(estado)} className={cn('font-medium', className)}>
      {incidentEstadoLabel(estado)}
    </Badge>
  );
}
