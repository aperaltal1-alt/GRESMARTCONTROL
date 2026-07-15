export interface ReconciliationLineItem {
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

export interface ReconciliationSummaryItem {
  id: string;
  greId: string;
  greNumero: string;
  greSerie: string;
  version: number;
  estado: string;
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

export interface ReconciliationDetail extends ReconciliationSummaryItem {
  observacion: string | null;
  lineas: ReconciliationLineItem[];
  incidencias: IncidentSummaryItem[];
  alertas: AlertSummaryItem[];
}

export interface PaginatedReconciliations {
  items: ReconciliationSummaryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IncidentSummaryItem {
  id: string;
  greId: string;
  greNumero: string;
  greSerie: string;
  productoId: string;
  codigoProducto: string;
  nombreProducto: string;
  tipo: string;
  cantidadGre: number;
  cantidadKardex: number;
  cantidadInventario: number;
  diferencia: number;
  estado: string;
  prioridad: string;
  observacion: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface PaginatedIncidents {
  items: IncidentSummaryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AlertSummaryItem {
  id: string;
  tipo: string;
  nivel: string;
  mensaje: string;
  productoId: string | null;
  codigoProducto: string | null;
  greId: string | null;
  greNumero: string | null;
  conciliacionId: string | null;
  incidenciaId: string | null;
  leida: boolean;
  activa: boolean;
  createdAt: string;
}

export interface PaginatedAlerts {
  items: AlertSummaryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RunReconciliationResult {
  conciliacionId: string;
  greId: string;
  version: number;
  estado: string;
  resultadoGre: string;
  totalLineas: number;
  lineasOk: number;
  lineasConDiferencia: number;
  incidenciasCreadas: number;
  alertasCreadas: number;
  duracionMs: number;
}
