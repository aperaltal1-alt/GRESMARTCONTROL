import { GreEstadoMvp } from '../constants';

export interface GreDetalleItem {
  id: string;
  productoId: string | null;
  codigoProducto: string;
  nombreProducto: string;
  cantidad: number;
}

export interface GreArchivoItem {
  id: string;
  tipo: string;
  nombreOriginal: string;
  mimeType: string;
  tamanoBytes: number;
  createdAt: string;
}

export interface GreItem {
  id: string;
  numero: string;
  serie: string;
  fecha: string;
  empresa: string;
  ruc: string;
  transportista: string | null;
  origen: string | null;
  destino: string | null;
  estado: GreEstadoMvp | string;
  observaciones: string | null;
  productos: GreDetalleItem[];
  archivos: GreArchivoItem[];
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
  estado: GreEstadoMvp | string;
  observaciones: string | null;
  totalProductos: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedGre {
  items: GreListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
