export type ReconciliationEstado =
  | 'EN_PROCESO'
  | 'COMPLETADA'
  | 'CON_DIFERENCIAS'
  | 'ERROR';

export type ReconciliationEstadoFilter = 'all' | ReconciliationEstado;

export interface ReconciliationSummary {
  id: string;
  greId: string;
  greNumero: string;
  greSerie: string;
  version: number;
  estado: ReconciliationEstado;
  metodo: string;
  totalLineas: number;
  lineasOk: number;
  lineasConDiferencia: number;
  resultadoGre: string;
  ejecutadoPor: string;
  iniciadoAt: string;
  completadoAt: string | null;
  duracionMs: number | null;
}

export interface ReconciliationLine {
  id: string;
  productoId: string;
  codigoProducto: string;
  nombreProducto: string;
  cantidadGre: number;
  cantidadKardex: number;
  cantidadInventario: number;
  diffGreKardex: number;
  diffGreInventario: number;
  diffKardexInventario: number;
  resultado: string;
  diferencia: number;
}

export interface ReconciliationDetail extends ReconciliationSummary {
  observacion: string | null;
  lineas: ReconciliationLine[];
  incidencias: Record<string, unknown>[];
  alertas: Record<string, unknown>[];
}

export interface ListReconciliationParams {
  page?: number;
  limit?: number;
  greId?: string;
  estado?: ReconciliationEstado;
}

export interface RunReconciliationResponse {
  conciliacionId: string;
  greId: string;
  version: number;
  estado: string;
  resultadoGre: 'CONCILIADA' | 'CON_DIFERENCIA';
  totalLineas: number;
  lineasOk: number;
  lineasConDiferencia: number;
  incidenciasCreadas: number;
  alertasCreadas: number;
  duracionMs: number;
}
