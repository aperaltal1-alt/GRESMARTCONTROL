'use client';

import { Badge } from '@/components/ui/badge';
import {
  reconciliationEstadoLabel,
  reconciliationEstadoVariant,
} from '@/lib/reconciliation/utils';
import { cn } from '@/lib/utils';
import type { ReconciliationEstado } from '@/types/reconciliation';

interface ReconciliationEstadoBadgeProps {
  estado: ReconciliationEstado | string;
  className?: string;
}

export function ReconciliationEstadoBadge({
  estado,
  className,
}: ReconciliationEstadoBadgeProps) {
  return (
    <Badge
      variant={reconciliationEstadoVariant(estado)}
      className={cn('font-medium', className)}
    >
      {reconciliationEstadoLabel(estado)}
    </Badge>
  );
}
