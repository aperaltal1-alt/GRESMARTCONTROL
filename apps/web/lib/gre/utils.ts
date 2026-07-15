import type { GreEstado } from '@/types/gre';
import { formatDateTime, formatShortDate } from '@/lib/utils/date';

export { formatShortDate, formatDateTime };

export function canManageGre(rol?: string): boolean {
  return rol === 'ADMIN' || rol === 'SUPERVISOR';
}

export function greEstadoLabel(estado: string): string {
  const labels: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    CONCILIADA: 'Conciliada',
    CON_DIFERENCIA: 'Con diferencia',
    ANULADA: 'Anulada',
  };
  return labels[estado] ?? estado;
}

export function greEstadoVariant(
  estado: string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (estado === 'CONCILIADA') return 'default';
  if (estado === 'CON_DIFERENCIA') return 'destructive';
  if (estado === 'PENDIENTE') return 'secondary';
  return 'outline';
}

export function greEstadoColor(estado: string): string {
  const colors: Record<string, string> = {
    PENDIENTE: 'border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-300',
    CONCILIADA: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    CON_DIFERENCIA: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    ANULADA: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  };
  return colors[estado] ?? colors.PENDIENTE;
}

export function formatGreNumber(serie: string, numero: string): string {
  return `${serie}-${numero}`;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isAllowedUploadFile(file: File): boolean {
  const ext = file.name.toLowerCase();
  return ext.endsWith('.xml') || ext.endsWith('.pdf');
}

export const GRE_TIMELINE_STEPS: { estado: GreEstado; label: string; description: string }[] = [
  {
    estado: 'PENDIENTE',
    label: 'Pendiente',
    description: 'Documento registrado, pendiente de conciliación',
  },
  {
    estado: 'CONCILIADA',
    label: 'Conciliada',
    description: 'Conciliación exitosa con Kardex e Inventario',
  },
  {
    estado: 'CON_DIFERENCIA',
    label: 'Con diferencia',
    description: 'Se detectaron discrepancias en la conciliación',
  },
];
