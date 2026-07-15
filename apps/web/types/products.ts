export interface Product {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductPayload {
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockActual: number;
  stockMinimo: number;
}

export interface UpdateProductPayload {
  codigo?: string;
  nombre?: string;
  categoria?: string;
  unidad?: string;
  stockActual?: number;
  stockMinimo?: number;
  activo?: boolean;
}

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  activo?: boolean;
  categoria?: string;
}

export type ProductStockEstado = 'NORMAL' | 'BAJO STOCK' | 'SIN STOCK';

export type ProductActivoFilter = 'all' | 'active' | 'inactive';

export type ProductEstadoFilter = 'all' | ProductStockEstado;
