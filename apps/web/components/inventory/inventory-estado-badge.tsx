'use client';

import { Badge } from '@/components/ui/badge';
import { inventoryEstadoColor, inventoryEstadoLabel } from '@/lib/inventory/utils';
import { cn } from '@/lib/utils';
import type { InventoryState } from '@/types/inventory';

interface InventoryEstadoBadgeProps {
  estado: InventoryState | string;
  className?: string;
}

export function InventoryEstadoBadge({ estado, className }: InventoryEstadoBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', inventoryEstadoColor(estado), className)}>
      {inventoryEstadoLabel(estado)}
    </Badge>
  );
}
