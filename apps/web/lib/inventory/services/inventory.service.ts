import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type { InventoryItem, ListInventoryParams } from '@/types/inventory';

const BASE = '/inventory';

export async function fetchInventory(
  params: ListInventoryParams = {},
): Promise<PaginatedResponse<InventoryItem>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<InventoryItem>>>(BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.estado ? { estado: params.estado } : {}),
    },
  });
  return data.data;
}
