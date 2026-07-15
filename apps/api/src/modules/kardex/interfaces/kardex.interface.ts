import { InventoryState, KardexMovementType } from '../constants';

export interface KardexMovementItem {
  id: string;
  productoId: string;
  codigoProducto: string;
  nombreProducto: string;
  fecha: string;
  tipo: KardexMovementType;
  cantidad: number;
  saldoAnterior: number;
  saldoNuevo: number;
  observacion: string | null;
  createdAt: string;
}

export interface PaginatedKardexMovements {
  items: KardexMovementItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InventoryItem {
  productoId: string;
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  estado: InventoryState;
}

export interface PaginatedInventory {
  items: InventoryItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
