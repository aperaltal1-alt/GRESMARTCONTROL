export type GreEstado = 'PENDIENTE' | 'CONCILIADA' | 'CON_DIFERENCIA';

export interface GreDetalle {
  id: string;
  productoId: string | null;
  codigoProducto: string;
  nombreProducto: string;
  cantidad: number;
}

export interface GreArchivo {
  id: string;
  tipo: 'XML' | 'PDF';
  nombreOriginal: string;
  mimeType: string;
  tamanoBytes: number;
  createdAt: string;
}

export interface Gre {
  id: string;
  numero: string;
  serie: string;
  fecha: string;
  empresa: string;
  ruc: string;
  transportista: string | null;
  origen: string | null;
  destino: string | null;
  estado: GreEstado | string;
  observaciones: string | null;
  productos: GreDetalle[];
  archivos: GreArchivo[];
  createdAt: string;
  updatedAt: string;
}

export interface GreListItem {
  id: string;
  numero: string;
  serie: string;
  fecha: string;
  empresa: string;
  ruc: string;
  transportista: string | null;
  origen: string | null;
  destino: string | null;
  estado: GreEstado | string;
  observaciones: string | null;
  totalProductos: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListGreParams {
  page?: number;
  limit?: number;
  numero?: string;
  serie?: string;
  estado?: GreEstado;
  fechaDesde?: string;
  fechaHasta?: string;
  empresa?: string;
}

export interface GreDetallePayload {
  productoId: string;
  cantidad: number;
}

export interface CreateGrePayload {
  numero: string;
  serie: string;
  fecha: string;
  ruc?: string;
  transportista?: string;
  origen?: string;
  destino?: string;
  observaciones?: string;
  productos: GreDetallePayload[];
}

export interface UpdateGrePayload {
  numero?: string;
  serie?: string;
  fecha?: string;
  ruc?: string;
  transportista?: string;
  origen?: string;
  destino?: string;
  estado?: GreEstado;
  observaciones?: string;
  productos?: GreDetallePayload[];
}

export type GreEstadoFilter = 'all' | GreEstado;
