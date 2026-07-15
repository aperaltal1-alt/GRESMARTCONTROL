'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { computeStockEstado } from '@/lib/products/utils';
import type { ProductStockEstado } from '@/types/products';

interface ProductStockBadgeProps {
  stockActual: number;
  stockMinimo: number;
  className?: string;
}

const estadoStyles: Record<ProductStockEstado, string> = {
  NORMAL: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  'BAJO STOCK': 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  'SIN STOCK': 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
};

export function ProductStockBadge({ stockActual, stockMinimo, className }: ProductStockBadgeProps) {
  const estado = computeStockEstado(stockActual, stockMinimo);

  return (
    <Badge
      variant="outline"
      className={cn('font-medium', estadoStyles[estado], className)}
    >
      {estado}
    </Badge>
  );
}
