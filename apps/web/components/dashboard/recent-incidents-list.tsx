'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatRelativeDate, prioridadVariant } from '@/lib/dashboard/utils';
import type { RecentIncidentItem } from '@/types/dashboard';
import { DashboardEmpty } from './dashboard-empty';
import { PanelListSkeleton } from './dashboard-skeleton';
import { DashboardError } from './dashboard-error';

interface RecentIncidentsListProps {
  items?: RecentIncidentItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function RecentIncidentsList({
  items,
  isLoading,
  isError,
  onRetry,
}: RecentIncidentsListProps) {
  if (isLoading) return <PanelListSkeleton />;
  if (isError) return <DashboardError onRetry={onRetry} />;
  if (!items?.length) {
    return (
      <DashboardEmpty
        title="Sin incidencias"
        description="No hay incidencias pendientes de conciliación."
      />
    );
  }

  return (
    <div className="space-y-2">
      {items.map((inc, index) => (
        <motion.div
          key={inc.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/40"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium">{inc.codigoProducto}</p>
              <Badge variant={prioridadVariant(inc.prioridad)} className="shrink-0 text-[10px]">
                {inc.prioridad}
              </Badge>
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{inc.nombreProducto}</p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">
              GRE {inc.greSerie}-{inc.greNumero} · Dif. {formatNumber(inc.diferencia)} ·{' '}
              {formatRelativeDate(inc.createdAt)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
