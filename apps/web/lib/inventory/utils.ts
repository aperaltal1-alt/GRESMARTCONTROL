import type { InventoryState } from '@/types/inventory';

export function inventoryEstadoLabel(estado: InventoryState | string): string {
  const labels: Record<string, string> = {
    NORMAL: 'NORMAL',
    BAJO: 'BAJO STOCK',
    'SIN STOCK': 'SIN STOCK',
  };
  return labels[estado] ?? estado;
}

export function inventoryEstadoColor(estado: string): string {
  const colors: Record<string, string> = {
    NORMAL: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    BAJO: 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    'SIN STOCK': 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
  };
  return colors[estado] ?? colors.NORMAL;
}

export function formatStock(value: number): string {
  return new Intl.NumberFormat('es-PE', { maximumFractionDigits: 2 }).format(value);
}
