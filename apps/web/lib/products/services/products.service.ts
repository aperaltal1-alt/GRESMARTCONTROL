import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  CreateProductPayload,
  ListProductsParams,
  Product,
  UpdateProductPayload,
} from '@/types/products';

const BASE = '/products';

export async function fetchProducts(
  params: ListProductsParams = {},
): Promise<PaginatedResponse<Product>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>(BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.search ? { search: params.search } : {}),
      ...(params.categoria ? { categoria: params.categoria } : {}),
      ...(params.activo !== undefined ? { activo: params.activo } : {}),
    },
  });
  return data.data;
}

export async function fetchProductById(id: string): Promise<Product> {
  const { data } = await apiClient.get<ApiResponse<Product>>(`${BASE}/${id}`);
  return data.data;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { data } = await apiClient.post<ApiResponse<Product>>(BASE, payload);
  return data.data;
}

export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
  const { data } = await apiClient.patch<ApiResponse<Product>>(`${BASE}/${id}`, payload);
  return data.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}
