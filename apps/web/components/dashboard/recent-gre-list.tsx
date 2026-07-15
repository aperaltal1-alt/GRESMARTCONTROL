'use client';

import { motion } from 'framer-motion';
import { FileText, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRelativeDate, greEstadoLabel } from '@/lib/dashboard/utils';
import type { RecentGreItem } from '@/types/dashboard';
import { DashboardEmpty } from './dashboard-empty';
import { PanelListSkeleton } from './dashboard-skeleton';
import { DashboardError } from './dashboard-error';

function greEstadoVariant(estado: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (estado === 'CONCILIADA') return 'default';
  if (estado === 'CON_DIFERENCIA') return 'destructive';
  if (estado === 'PENDIENTE') return 'secondary';
  return 'outline';
}

interface RecentGreListProps {
  items?: RecentGreItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function RecentGreList({ items, isLoading, isError, onRetry }: RecentGreListProps) {
  if (isLoading) return <PanelListSkeleton />;
  if (isError) return <DashboardError onRetry={onRetry} />;
  if (!items?.length) {
    return (
      <DashboardEmpty
        title="Sin GRE recientes"
        description="No hay guías de remisión registradas."
      />
    );
  }

  return (
    <div className="space-y-2">
      {items.map((gre, index) => (
        <motion.div
          key={gre.id}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="group flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 transition-colors hover:border-border hover:bg-muted/40"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand/10">
            <FileText className="h-4 w-4 text-brand" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium">
                {gre.serie}-{gre.numero}
              </p>
              <Badge variant={greEstadoVariant(gre.estado)} className="shrink-0 text-[10px]">
                {greEstadoLabel(gre.estado)}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              {gre.transportista ? (
                <>
                  <Truck className="h-3 w-3" />
                  <span className="truncate">{gre.transportista}</span>
                </>
              ) : null}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground/70">
              {gre.totalProductos} productos · {formatRelativeDate(gre.createdAt)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
