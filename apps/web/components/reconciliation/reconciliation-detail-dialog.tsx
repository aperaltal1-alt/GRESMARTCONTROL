'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  Clock,
  GitCompare,
  Hash,
  User,
} from 'lucide-react';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  calcConciliationPercent,
  formatDateTime,
  formatDuration,
  formatGreRef,
  reconciliationEstadoLabel,
} from '@/lib/reconciliation/utils';
import { cn } from '@/lib/utils';
import type { ReconciliationDetail } from '@/types/reconciliation';
import { ReconciliationEstadoBadge } from './reconciliation-estado-badge';
import { ReconciliationTimeline } from './reconciliation-timeline';

interface ReconciliationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reconciliation?: ReconciliationDetail;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-40" />
      <Skeleton className="h-48" />
    </div>
  );
}

function formatLineResult(resultado: string): string {
  const labels: Record<string, string> = {
    OK: 'OK',
    DIFERENCIA: 'Diferencia',
    ERROR: 'Error',
  };
  return labels[resultado] ?? resultado;
}

function getIncidentField(item: Record<string, unknown>, key: string): string {
  const value = item[key];
  return value == null ? '—' : String(value);
}

function getAlertField(item: Record<string, unknown>, key: string): string {
  const value = item[key];
  return value == null ? '—' : String(value);
}

export function ReconciliationDetailDialog({
  open,
  onOpenChange,
  reconciliation,
  isLoading,
  isError,
  onRetry,
}: ReconciliationDetailDialogProps) {
  const percent = reconciliation
    ? calcConciliationPercent(reconciliation.lineasOk, reconciliation.totalLineas)
    : 0;

  const historial = useMemo(() => {
    if (!reconciliation) return [];

    const events: Array<{ id: string; label: string; detail: string; date: string }> = [
      {
        id: 'inicio',
        label: 'Conciliación iniciada',
        detail: `Versión ${reconciliation.version} · ${reconciliation.metodo}`,
        date: reconciliation.iniciadoAt,
      },
    ];

    if (reconciliation.completadoAt) {
      events.push({
        id: 'fin',
        label: `Finalizada · ${reconciliationEstadoLabel(reconciliation.estado)}`,
        detail: `Resultado GRE: ${reconciliation.resultadoGre} · ${formatDuration(reconciliation.duracionMs)}`,
        date: reconciliation.completadoAt,
      });
    }

    reconciliation.incidencias.forEach((inc, index) => {
      events.push({
        id: `inc-${getIncidentField(inc, 'id') || index}`,
        label: 'Incidencia generada',
        detail: `${getIncidentField(inc, 'codigoProducto')} · ${getIncidentField(inc, 'tipo')} · dif. ${getIncidentField(inc, 'diferencia')}`,
        date: getIncidentField(inc, 'createdAt'),
      });
    });

    reconciliation.alertas.forEach((alert, index) => {
      events.push({
        id: `alert-${getAlertField(alert, 'id') || index}`,
        label: 'Alerta generada',
        detail: `${getAlertField(alert, 'tipo')} · ${getAlertField(alert, 'mensaje')}`,
        date: getAlertField(alert, 'createdAt'),
      });
    });

    return events
      .filter((event) => event.date !== '—')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [reconciliation]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        {isLoading ? (
          <DetailSkeleton />
        ) : isError || !reconciliation ? (
          <DashboardError onRetry={onRetry} />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="text-xl">
                    {formatGreRef(reconciliation.greSerie, reconciliation.greNumero)}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Conciliación v{reconciliation.version} · {reconciliation.metodo}
                  </p>
                </div>
                <ReconciliationEstadoBadge estado={reconciliation.estado} />
              </div>
            </DialogHeader>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryCard
                icon={GitCompare}
                label="Total líneas"
                value={String(reconciliation.totalLineas)}
              />
              <SummaryCard
                icon={Hash}
                label="Líneas OK / Dif"
                value={`${reconciliation.lineasOk} / ${reconciliation.lineasConDiferencia}`}
              />
              <SummaryCard
                icon={User}
                label="Ejecutado por"
                value={reconciliation.ejecutadoPor}
              />
              <SummaryCard
                icon={Clock}
                label="Duración"
                value={formatDuration(reconciliation.duracionMs)}
              />
            </div>

            <div className="mt-6 rounded-lg border border-border/40 bg-muted/20 p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-sm font-medium">Porcentaje conciliado</p>
                <span className="text-sm font-semibold tabular-nums text-brand">{percent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    'h-full rounded-full transition-all',
                    percent === 100 ? 'bg-emerald-500' : percent >= 70 ? 'bg-brand' : 'bg-amber-500',
                  )}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {reconciliation.lineasOk} de {reconciliation.totalLineas} líneas sin diferencias
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <CountBadge
                icon={AlertTriangle}
                label="Incidencias"
                count={reconciliation.incidencias.length}
                variant="destructive"
              />
              <CountBadge
                icon={Bell}
                label="Alertas"
                count={reconciliation.alertas.length}
                variant="secondary"
              />
            </div>

            {reconciliation.observacion ? (
              <p className="mt-4 rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                {reconciliation.observacion}
              </p>
            ) : null}

            <Separator className="my-6" />

            <ReconciliationTimeline
              estado={reconciliation.estado}
              iniciadoAt={reconciliation.iniciadoAt}
              completadoAt={reconciliation.completadoAt}
            />

            <Separator className="my-6" />

            <div>
              <h4 className="mb-3 text-sm font-semibold">
                Líneas de conciliación ({reconciliation.lineas.length})
              </h4>
              <div className="overflow-hidden rounded-lg border border-border/40">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/40 bg-muted/30">
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                          Producto
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">
                          GRE
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">
                          Kardex
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">
                          Inventario
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">
                          Dif.
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                          Resultado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reconciliation.lineas.map((linea) => (
                        <tr
                          key={linea.id}
                          className={cn(
                            'border-b border-border/20 last:border-0',
                            linea.resultado !== 'OK' && 'bg-destructive/5',
                          )}
                        >
                          <td className="px-3 py-2">
                            <p className="font-medium">{linea.nombreProducto}</p>
                            <p className="font-mono text-xs text-muted-foreground">
                              {linea.codigoProducto}
                            </p>
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {linea.cantidadGre}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {linea.cantidadKardex}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {linea.cantidadInventario}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            <span
                              className={cn(
                                'font-medium',
                                linea.diferencia !== 0 && 'text-destructive',
                              )}
                            >
                              {linea.diferencia}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <Badge
                              variant={linea.resultado === 'OK' ? 'default' : 'destructive'}
                              className="font-medium"
                            >
                              {formatLineResult(linea.resultado)}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div>
              <h4 className="mb-3 text-sm font-semibold">Historial</h4>
              {historial.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin eventos registrados.</p>
              ) : (
                <div className="space-y-2">
                  {historial.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start justify-between gap-4 rounded-lg border border-border/40 bg-muted/20 p-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{event.label}</p>
                        <p className="text-xs text-muted-foreground">{event.detail}</p>
                      </div>
                      <p className="shrink-0 text-xs text-muted-foreground">
                        {formatDateTime(event.date)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof GitCompare;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function CountBadge({
  icon: Icon,
  label,
  count,
  variant,
}: {
  icon: typeof AlertTriangle;
  label: string;
  count: number;
  variant: 'destructive' | 'secondary';
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm">{label}</span>
      <Badge variant={variant} className="ml-1 tabular-nums">
        {count}
      </Badge>
    </div>
  );
}
