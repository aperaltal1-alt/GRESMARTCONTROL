import type { KardexMovementType } from '@/types/kardex';
import { formatShortDate } from '@/lib/utils/date';

export { formatShortDate };

export function canManageKardex(rol?: string): boolean {
  return rol === 'ADMIN' || rol === 'SUPERVISOR';
}

export function kardexTipoLabel(tipo: KardexMovementType | string): string {
  const labels: Record<string, string> = {
    ENTRADA: 'Entrada',
    SALIDA: 'Salida',
    AJUSTE: 'Ajuste',
  };
  return labels[tipo] ?? tipo;
}

export function kardexTipoColor(tipo: string): string {
  const colors: Record<string, string> = {
    ENTRADA: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    SALIDA: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
    AJUSTE: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
  };
  return colors[tipo] ?? 'border-border bg-muted text-muted-foreground';
}

export function formatStock(value: number): string {
  return new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(value);
}

export function cantidadLabel(tipo: KardexMovementType | string): string {
  return tipo === 'AJUSTE' ? 'Stock resultante' : 'Cantidad';
}
