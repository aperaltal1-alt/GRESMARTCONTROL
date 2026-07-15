export type KardexMovementType = 'ENTRADA' | 'SALIDA' | 'AJUSTE';

export interface KardexMovement {
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

export interface ListKardexParams {
  page?: number;
  limit?: number;
  producto?: string;
  tipo?: KardexMovementType;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface CreateKardexMovementPayload {
  productoId: string;
  fecha: string;
  tipo: KardexMovementType;
  cantidad: number;
  observacion?: string;
}

export type KardexTipoFilter = 'all' | KardexMovementType;
