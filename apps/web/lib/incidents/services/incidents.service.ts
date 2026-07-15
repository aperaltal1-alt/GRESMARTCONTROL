import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Incident, ListIncidentsParams, ResolveIncidentResponse } from '@/types/incidents';

const BASE = '/incidents';

export async function fetchIncidents(
  params: ListIncidentsParams = {},
): Promise<PaginatedResponse<Incident>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Incident>>>(BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.greId ? { greId: params.greId } : {}),
      ...(params.estado ? { estado: params.estado } : {}),
    },
  });
  return data.data;
}

export async function resolveIncident(id: string): Promise<ResolveIncidentResponse> {
  const { data } = await apiClient.patch<ApiResponse<ResolveIncidentResponse>>(
    `${BASE}/${id}/resolve`,
  );
  return data.data;
}
