import type { AlertNivel, AlertTipo } from '@/types/alerts';

export function alertTipoLabel(tipo: AlertTipo | string): string {
  const labels: Record<string, string> = {
    STOCK_INSUFICIENTE: 'Stock insuficiente',
    STOCK_MINIMO: 'Stock mínimo',
    DIFERENCIA_GRE: 'Diferencia GRE',
    DIFERENCIA_KARDEX: 'Diferencia Kardex',
    DIFERENCIA_FISICO: 'Diferencia físico',
    GRE_PENDIENTE: 'GRE pendiente',
    TRIBUTARIA: 'Tributaria',
    SUNAT_RECHAZADO: 'SUNAT rechazado',
    CONCILIACION_PENDIENTE: 'Conciliación pendiente',
  };
  return labels[tipo] ?? tipo;
}

export function alertNivelVariant(
  nivel: AlertNivel | string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (nivel === 'CRITICAL' || nivel === 'ERROR') return 'destructive';
  if (nivel === 'WARNING') return 'default';
  return 'secondary';
}
