'use client';

import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  File,
  FileText,
  MapPin,
  Pencil,
  Truck,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import {
  formatFileSize,
  formatGreNumber,
  formatShortDate,
} from '@/lib/gre/utils';
import type { Gre } from '@/types/gre';
import { GreEstadoBadge } from './gre-estado-badge';
import { GreTimeline } from './gre-timeline';

interface GreDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gre?: Gre;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  canManage: boolean;
  onEdit: () => void;
  onUpload: () => void;
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="h-40" />
    </div>
  );
}

export function GreDetailDialog({
  open,
  onOpenChange,
  gre,
  isLoading,
  isError,
  onRetry,
  canManage,
  onEdit,
  onUpload,
}: GreDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {isLoading ? (
          <DetailSkeleton />
        ) : isError || !gre ? (
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
                    {formatGreNumber(gre.serie, gre.numero)}
                  </DialogTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Guía de Remisión Electrónica
                  </p>
                </div>
                <GreEstadoBadge estado={gre.estado} />
              </div>
              {canManage ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={onEdit}>
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={onUpload}>
                    <Upload className="h-3.5 w-3.5" />
                    Subir archivo
                  </Button>
                </div>
              ) : null}
            </DialogHeader>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoItem icon={Calendar} label="Fecha emisión" value={formatShortDate(gre.fecha)} />
              <InfoItem icon={Building2} label="Empresa" value={gre.empresa} sub={gre.ruc} />
              <InfoItem
                icon={Truck}
                label="Transportista"
                value={gre.transportista ?? 'No especificado'}
              />
              <InfoItem icon={MapPin} label="Origen" value={gre.origen ?? '—'} />
              <InfoItem icon={MapPin} label="Destino" value={gre.destino ?? '—'} />
            </div>

            {gre.observaciones ? (
              <p className="mt-4 rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground">
                {gre.observaciones}
              </p>
            ) : null}

            <Separator className="my-6" />

            <GreTimeline gre={gre} />

            <Separator className="my-6" />

            <div>
              <h4 className="mb-3 text-sm font-semibold">
                Productos ({gre.productos.length})
              </h4>
              <div className="overflow-hidden rounded-lg border border-border/40">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30">
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Código
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                        Producto
                      </th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-muted-foreground">
                        Cantidad
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {gre.productos.map((p) => (
                      <tr key={p.id} className="border-b border-border/20 last:border-0">
                        <td className="px-3 py-2 font-mono text-xs">{p.codigoProducto}</td>
                        <td className="px-3 py-2">{p.nombreProducto}</td>
                        <td className="px-3 py-2 text-right font-medium tabular-nums">
                          {p.cantidad}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {gre.archivos.length > 0 ? (
              <>
                <Separator className="my-6" />
                <div>
                  <h4 className="mb-3 text-sm font-semibold">
                    Archivos ({gre.archivos.length})
                  </h4>
                  <div className="space-y-2">
                    {gre.archivos.map((archivo) => (
                      <div
                        key={archivo.id}
                        className="flex items-center gap-3 rounded-lg border border-border/40 bg-muted/20 p-3"
                      >
                        {archivo.tipo === 'PDF' ? (
                          <FileText className="h-4 w-4 text-red-500" />
                        ) : (
                          <File className="h-4 w-4 text-blue-500" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{archivo.nombreOriginal}</p>
                          <p className="text-xs text-muted-foreground">
                            {archivo.tipo} · {formatFileSize(archivo.tamanoBytes)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
        {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
      </div>
    </div>
  );
}
