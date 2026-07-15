import type { ReconciliationEstado } from '@/types/reconciliation';
import type { UserRole } from '@/types/auth';

export function canManageReconciliation(rol?: UserRole): boolean {
  return rol === 'ADMIN' || rol === 'SUPERVISOR';
}

export function reconciliationEstadoLabel(estado: ReconciliationEstado | string): string {
  const labels: Record<string, string> = {
    EN_PROCESO: 'En proceso',
    COMPLETADA: 'Completada',
    CON_DIFERENCIAS: 'Con diferencias',
    ERROR: 'Error',
  };
  return labels[estado] ?? estado;
}

export function reconciliationEstadoVariant(
  estado: ReconciliationEstado | string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (estado === 'COMPLETADA') return 'default';
  if (estado === 'CON_DIFERENCIAS' || estado === 'ERROR') return 'destructive';
  if (estado === 'EN_PROCESO') return 'secondary';
  return 'outline';
}

export function formatGreRef(serie: string, numero: string): string {
  return `${serie}-${numero}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatDuration(ms: number | null): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

export function calcConciliationPercent(lineasOk: number, totalLineas: number): number {
  if (totalLineas === 0) return 0;
  return Math.round((lineasOk / totalLineas) * 1000) / 10;
}

export const RECONCILIATION_TIMELINE_STEPS = [
  { key: 'iniciado', label: 'Conciliación iniciada', description: 'Proceso de conciliación en marcha' },
  { key: 'proceso', label: 'Análisis de líneas', description: 'Comparación GRE vs Kardex vs Inventario' },
  { key: 'completado', label: 'Resultado final', description: 'Conciliación finalizada' },
] as const;
