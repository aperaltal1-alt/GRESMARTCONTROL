import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  ListReconciliationParams,
  ReconciliationDetail,
  ReconciliationSummary,
  RunReconciliationResponse,
} from '@/types/reconciliation';

const BASE = '/reconciliation';

export async function fetchReconciliationList(
  params: ListReconciliationParams = {},
): Promise<PaginatedResponse<ReconciliationSummary>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<ReconciliationSummary>>>(
    BASE,
    {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        ...(params.greId ? { greId: params.greId } : {}),
        ...(params.estado ? { estado: params.estado } : {}),
      },
    },
  );
  return data.data;
}

export async function fetchReconciliationById(id: string): Promise<ReconciliationDetail> {
  const { data } = await apiClient.get<ApiResponse<ReconciliationDetail>>(`${BASE}/${id}`);
  return data.data;
}

export async function runReconciliation(greId: string): Promise<RunReconciliationResponse> {
  const { data } = await apiClient.post<ApiResponse<RunReconciliationResponse>>(
    `${BASE}/${greId}/run`,
  );
  return data.data;
}
