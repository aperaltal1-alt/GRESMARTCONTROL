'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeftRight,
  FileText,
  Scale,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatTraceabilityDate } from '@/lib/traceability/utils';
import { cn } from '@/lib/utils';
import type { TraceabilityEvent, TraceabilityEventType } from '@/types/traceability';
import { EmptyState } from '@/components/shared/empty-state';

const typeIcons: Record<TraceabilityEventType, typeof FileText> = {
  KARDEX: ArrowLeftRight,
  GRE: FileText,
  RECONCILIATION: Scale,
  INCIDENT: AlertTriangle,
};

const typeColors: Record<TraceabilityEventType, string> = {
  KARDEX: 'border-violet-500 bg-violet-500/10 text-violet-500',
  GRE: 'border-blue-500 bg-blue-500/10 text-blue-500',
  RECONCILIATION: 'border-emerald-500 bg-emerald-500/10 text-emerald-500',
  INCIDENT: 'border-red-500 bg-red-500/10 text-red-500',
};

interface TraceabilityTimelineProps {
  events: TraceabilityEvent[];
}

export function TraceabilityTimeline({ events }: TraceabilityTimelineProps) {
  if (!events.length) {
    return (
      <EmptyState
        title="Sin eventos registrados"
        description="No se encontraron movimientos para este registro en la API."
        className="rounded-xl border border-dashed border-border/60 py-12"
      />
    );
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
      <h3 className="mb-4 text-sm font-semibold">Timeline de trazabilidad</h3>
      <div className="relative space-y-0">
        {events.map((event, index) => {
          const Icon = typeIcons[event.type];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {index < events.length - 1 ? (
                <div className="absolute left-[15px] top-8 h-[calc(100%-8px)] w-px bg-border" />
              ) : null}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
                  typeColors[event.type],
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{event.title}</p>
                  {event.status ? (
                    <Badge variant="outline" className="text-[10px]">
                      {event.status}
                    </Badge>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">{event.description}</p>
                {event.meta ? (
                  <p className="mt-0.5 text-xs text-muted-foreground/80">{event.meta}</p>
                ) : null}
                <p className="mt-1 text-[11px] text-muted-foreground/70">
                  {formatTraceabilityDate(event.date)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
