import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  CreateGrePayload,
  Gre,
  GreArchivo,
  GreListItem,
  ListGreParams,
  UpdateGrePayload,
} from '@/types/gre';

const BASE = '/gre';

export async function fetchGreList(
  params: ListGreParams = {},
): Promise<PaginatedResponse<GreListItem>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<GreListItem>>>(BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.numero ? { numero: params.numero } : {}),
      ...(params.serie ? { serie: params.serie } : {}),
      ...(params.estado ? { estado: params.estado } : {}),
      ...(params.fechaDesde ? { fechaDesde: params.fechaDesde } : {}),
      ...(params.fechaHasta ? { fechaHasta: params.fechaHasta } : {}),
      ...(params.empresa ? { empresa: params.empresa } : {}),
    },
  });
  return data.data;
}

export async function fetchGreById(id: string): Promise<Gre> {
  const { data } = await apiClient.get<ApiResponse<Gre>>(`${BASE}/${id}`);
  return data.data;
}

export async function createGre(payload: CreateGrePayload): Promise<Gre> {
  const { data } = await apiClient.post<ApiResponse<Gre>>(BASE, payload);
  return data.data;
}

export async function updateGre(id: string, payload: UpdateGrePayload): Promise<Gre> {
  const { data } = await apiClient.patch<ApiResponse<Gre>>(`${BASE}/${id}`, payload);
  return data.data;
}

export async function deleteGre(id: string): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}

export async function uploadGreFile(id: string, file: File): Promise<GreArchivo> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<ApiResponse<GreArchivo>>(`${BASE}/${id}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}
