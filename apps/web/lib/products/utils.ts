import type { ProductStockEstado } from '@/types/products';

export function computeStockEstado(stockActual: number, stockMinimo: number): ProductStockEstado {
  if (stockActual <= 0) return 'SIN STOCK';
  if (stockActual <= stockMinimo) return 'BAJO STOCK';
  return 'NORMAL';
}

export function formatStock(value: number): string {
  return new Intl.NumberFormat('es-PE', {
    maximumFractionDigits: 2,
  }).format(value);
}

export function canManageProducts(rol?: string): boolean {
  return rol === 'ADMIN' || rol === 'SUPERVISOR';
}
