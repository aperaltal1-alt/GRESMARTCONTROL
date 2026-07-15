import type { UserRole } from '@/types/auth';
import type { IncidentEstado, IncidentTipo } from '@/types/incidents';

export function canManageIncidents(rol?: UserRole): boolean {
  return rol === 'ADMIN' || rol === 'SUPERVISOR';
}

export function incidentEstadoLabel(estado: IncidentEstado | string): string {
  const labels: Record<string, string> = {
    PENDIENTE: 'Pendiente',
    REVISADA: 'Revisada',
    RESUELTA: 'Resuelta',
    DESCARTADA: 'Descartada',
  };
  return labels[estado] ?? estado;
}

export function incidentEstadoVariant(
  estado: IncidentEstado | string,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (estado === 'RESUELTA') return 'default';
  if (estado === 'PENDIENTE') return 'destructive';
  if (estado === 'REVISADA') return 'secondary';
  return 'outline';
}

export function incidentTipoLabel(tipo: IncidentTipo | string): string {
  const labels: Record<string, string> = {
    GRE_KARDEX: 'GRE vs Kardex',
    GRE_FISICO: 'GRE vs Físico',
    KARDEX_FISICO: 'Kardex vs Físico',
    TRIPLE: 'Triple diferencia',
  };
  return labels[tipo] ?? tipo;
}
