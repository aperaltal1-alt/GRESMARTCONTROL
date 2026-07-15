export type IncidentEstado = 'PENDIENTE' | 'REVISADA' | 'RESUELTA' | 'DESCARTADA';
export type IncidentPrioridad = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
export type IncidentTipo = 'GRE_KARDEX' | 'GRE_FISICO' | 'KARDEX_FISICO' | 'TRIPLE';

export type IncidentEstadoFilter = 'all' | IncidentEstado;
export type IncidentPrioridadFilter = 'all' | IncidentPrioridad;

export interface Incident {
  id: string;
  greId: string;
  greNumero: string;
  greSerie: string;
  productoId: string;
  codigoProducto: string;
  nombreProducto: string;
  tipo: IncidentTipo;
  cantidadGre: number;
  cantidadKardex: number;
  cantidadInventario: number;
  diferencia: number;
  estado: IncidentEstado;
  prioridad: IncidentPrioridad;
  observacion: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

export interface ListIncidentsParams {
  page?: number;
  limit?: number;
  greId?: string;
  estado?: IncidentEstado;
}

export interface ResolveIncidentResponse {
  id: string;
  estado: 'RESUELTA';
  resolvedAt: string;
  message: string;
}
