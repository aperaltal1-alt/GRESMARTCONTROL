export type InventoryState = 'NORMAL' | 'BAJO' | 'SIN STOCK';

export interface InventoryItem {
  productoId: string;
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  estado: InventoryState;
}

export interface ListInventoryParams {
  page?: number;
  limit?: number;
  estado?: InventoryState;
}

export type InventoryEstadoFilter = 'all' | InventoryState;

export interface InventorySummary {
  totalProductos: number;
  stockTotal: number;
  productosBajoStock: number;
  productosSinStock: number;
}
