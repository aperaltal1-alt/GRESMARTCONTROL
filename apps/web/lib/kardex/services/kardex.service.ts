import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  CreateKardexMovementPayload,
  KardexMovement,
  ListKardexParams,
} from '@/types/kardex';

const BASE = '/kardex';

export async function fetchKardexMovements(
  params: ListKardexParams = {},
): Promise<PaginatedResponse<KardexMovement>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<KardexMovement>>>(BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.producto ? { producto: params.producto } : {}),
      ...(params.tipo ? { tipo: params.tipo } : {}),
      ...(params.fechaDesde ? { fechaDesde: params.fechaDesde } : {}),
      ...(params.fechaHasta ? { fechaHasta: params.fechaHasta } : {}),
    },
  });
  return data.data;
}

export async function createKardexMovement(
  payload: CreateKardexMovementPayload,
): Promise<KardexMovement> {
  const { data } = await apiClient.post<ApiResponse<KardexMovement>>(BASE, payload);
  return data.data;
}
