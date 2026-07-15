'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Package, Truck } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatNumber } from '@/lib/dashboard/utils';
import { formatDateTime, formatGreNumber } from '@/lib/gre/utils';
import { incidentTipoLabel } from '@/lib/incidents/utils';
import type { Incident } from '@/types/incidents';
import { IncidentEstadoBadge } from './incident-estado-badge';
import { IncidentPrioridadBadge } from './incident-prioridad-badge';

interface IncidentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incident: Incident | null;
}

export function IncidentDetailDialog({
  open,
  onOpenChange,
  incident,
}: IncidentDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {!incident ? null : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Incidencia de conciliación
                  </DialogTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {incidentTipoLabel(incident.tipo)}
                  </p>
                </div>
                <IncidentEstadoBadge estado={incident.estado} />
              </div>
              <div className="flex flex-wrap gap-2">
                <IncidentPrioridadBadge prioridad={incident.prioridad} />
              </div>
            </DialogHeader>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoItem
                icon={Truck}
                label="GRE"
                value={formatGreNumber(incident.greSerie, incident.greNumero)}
              />
              <InfoItem
                icon={Package}
                label="Producto"
                value={incident.nombreProducto}
                sub={incident.codigoProducto}
              />
              <InfoItem
                icon={Calendar}
                label="Fecha de detección"
                value={formatDateTime(incident.createdAt)}
              />
              {incident.resolvedAt ? (
                <InfoItem
                  icon={Calendar}
                  label="Fecha de resolución"
                  value={formatDateTime(incident.resolvedAt)}
                />
              ) : null}
            </div>

            <Separator className="my-6" />

            <div>
              <h4 className="mb-3 text-sm font-semibold">Cantidades comparadas</h4>
              <div className="overflow-hidden rounded-lg border border-border/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30">
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Fuente
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">
                        Cantidad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <QuantityRow label="GRE" value={incident.cantidadGre} />
                    <QuantityRow label="Kardex" value={incident.cantidadKardex} />
                    <QuantityRow label="Inventario físico" value={incident.cantidadInventario} />
                    <tr className="border-t border-border/40 bg-destructive/5">
                      <td className="px-3 py-2 font-medium">Diferencia</td>
                      <td className="px-3 py-2 text-right font-bold tabular-nums text-destructive">
                        {formatNumber(incident.diferencia)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {incident.observacion ? (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Observación</h4>
                  <p className="rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                    {incident.observacion}
                  </p>
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
        {sub ? <p className="font-mono text-xs text-muted-foreground">{sub}</p> : null}
      </div>
    </div>
  );
}

function QuantityRow({ label, value }: { label: string; value: number }) {
  return (
    <tr className="border-b border-border/20 last:border-0">
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 text-right font-medium tabular-nums">{formatNumber(value)}</td>
    </tr>
  );
}
