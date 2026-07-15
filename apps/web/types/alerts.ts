export type AlertTipo =
  | 'STOCK_INSUFICIENTE'
  | 'STOCK_MINIMO'
  | 'DIFERENCIA_GRE'
  | 'DIFERENCIA_KARDEX'
  | 'DIFERENCIA_FISICO'
  | 'GRE_PENDIENTE'
  | 'TRIBUTARIA'
  | 'SUNAT_RECHAZADO'
  | 'CONCILIACION_PENDIENTE';

export type AlertNivel = 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

export type AlertActivaFilter = 'all' | 'active' | 'inactive';
export type AlertLeidaFilter = 'all' | 'read' | 'unread';
export type AlertNivelFilter = 'all' | AlertNivel;
export type AlertTipoFilter = 'all' | AlertTipo;

export interface Alert {
  id: string;
  tipo: AlertTipo;
  nivel: AlertNivel;
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

export interface ListAlertsParams {
  page?: number;
  limit?: number;
  activa?: boolean;
}

export interface MarkAlertReadResponse {
  id: string;
  leida: true;
  message: string;
}
