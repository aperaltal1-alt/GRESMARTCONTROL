import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { Alert, ListAlertsParams, MarkAlertReadResponse } from '@/types/alerts';

const BASE = '/alerts';

export async function fetchAlerts(
  params: ListAlertsParams = {},
): Promise<PaginatedResponse<Alert>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Alert>>>(BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.activa !== undefined ? { activa: params.activa } : {}),
    },
  });
  return data.data;
}

export async function markAlertAsRead(id: string): Promise<MarkAlertReadResponse> {
  const { data } = await apiClient.patch<ApiResponse<MarkAlertReadResponse>>(`${BASE}/${id}/read`);
  return data.data;
}
