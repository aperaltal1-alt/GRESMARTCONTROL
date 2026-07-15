'use client';

import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { alertaNivelColor, formatRelativeDate } from '@/lib/dashboard/utils';
import type { RecentAlertItem } from '@/types/dashboard';
import { DashboardEmpty } from './dashboard-empty';
import { PanelListSkeleton } from './dashboard-skeleton';
import { DashboardError } from './dashboard-error';

function alertaNivelVariant(nivel: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (nivel === 'CRITICAL' || nivel === 'ERROR') return 'destructive';
  if (nivel === 'WARNING') return 'default';
  return 'secondary';
}

interface RecentAlertsListProps {
  items?: RecentAlertItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function RecentAlertsList({ items, isLoading, isError, onRetry }: RecentAlertsListProps) {
  if (isLoading) return <PanelListSkeleton />;
  if (isError) return <DashboardError onRetry={onRetry} />;
  if (!items?.length) {
    return (
      <DashboardEmpty
        title="Sin alertas activas"
        description="No hay alertas que requieran atención."
      />
    );
  }

  return (
    <div className="space-y-2">
      {items.map((alert, index) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/40"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
            <Bell className={`h-4 w-4 ${alertaNivelColor(alert.nivel)}`} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <Badge variant={alertaNivelVariant(alert.nivel)} className="shrink-0 text-[10px]">
                {alert.nivel}
              </Badge>
              {!alert.leida ? (
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
              ) : null}
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed">{alert.mensaje}</p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">
              {alert.greNumero ? `GRE ${alert.greNumero}` : alert.codigoProducto ?? alert.tipo} ·{' '}
              {formatRelativeDate(alert.createdAt)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
