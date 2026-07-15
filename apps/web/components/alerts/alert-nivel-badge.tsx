'use client';

import { Badge } from '@/components/ui/badge';
import { alertaNivelColor } from '@/lib/dashboard/utils';
import { alertNivelVariant } from '@/lib/alerts/utils';
import { cn } from '@/lib/utils';
import type { AlertNivel } from '@/types/alerts';

const NIVEL_LABELS: Record<string, string> = {
  INFO: 'Info',
  WARNING: 'Advertencia',
  ERROR: 'Error',
  CRITICAL: 'Crítico',
};

interface AlertNivelBadgeProps {
  nivel: AlertNivel | string;
  className?: string;
}

export function AlertNivelBadge({ nivel, className }: AlertNivelBadgeProps) {
  return (
    <Badge
      variant={alertNivelVariant(nivel)}
      className={cn('font-medium', alertaNivelColor(nivel), className)}
    >
      {NIVEL_LABELS[nivel] ?? nivel}
    </Badge>
  );
}
