'use client';

import { FileText } from 'lucide-react';
import { GreEstadoBadge } from '@/components/gre/gre-estado-badge';
import type { GreListItem } from '@/types/gre';

interface TraceabilityGreContextProps {
  gre: GreListItem;
}

export function TraceabilityGreContext({ gre }: TraceabilityGreContextProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10">
          <FileText className="h-5 w-5 text-brand" />
        </div>
        <div>
          <p className="font-semibold">
            GRE {gre.serie}-{gre.numero}
          </p>
          <p className="text-sm text-muted-foreground">
            {gre.totalProductos} productos · {gre.fecha}
          </p>
        </div>
      </div>
      <GreEstadoBadge estado={gre.estado} />
    </div>
  );
}
