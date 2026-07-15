'use client';

import { Badge } from '@/components/ui/badge';
import { alertTipoLabel } from '@/lib/alerts/utils';
import { cn } from '@/lib/utils';
import type { AlertTipo } from '@/types/alerts';

interface AlertTipoBadgeProps {
  tipo: AlertTipo | string;
  className?: string;
}

export function AlertTipoBadge({ tipo, className }: AlertTipoBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', className)}>
      {alertTipoLabel(tipo)}
    </Badge>
  );
}
