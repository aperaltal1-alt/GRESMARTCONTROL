'use client';

import { Badge } from '@/components/ui/badge';
import { greEstadoColor, greEstadoLabel } from '@/lib/gre/utils';
import { cn } from '@/lib/utils';

interface GreEstadoBadgeProps {
  estado: string;
  className?: string;
}

export function GreEstadoBadge({ estado, className }: GreEstadoBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', greEstadoColor(estado), className)}>
      {greEstadoLabel(estado)}
    </Badge>
  );
}
