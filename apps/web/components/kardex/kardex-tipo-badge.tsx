'use client';

import { Badge } from '@/components/ui/badge';
import { kardexTipoColor, kardexTipoLabel } from '@/lib/kardex/utils';
import { cn } from '@/lib/utils';
import type { KardexMovementType } from '@/types/kardex';

interface KardexTipoBadgeProps {
  tipo: KardexMovementType | string;
  className?: string;
}

export function KardexTipoBadge({ tipo, className }: KardexTipoBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', kardexTipoColor(tipo), className)}>
      {kardexTipoLabel(tipo)}
    </Badge>
  );
}
