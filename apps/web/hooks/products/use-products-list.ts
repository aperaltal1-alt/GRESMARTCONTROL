'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/products/services';
import { queryKeys } from '@/lib/query/keys';
import type { ListProductsParams } from '@/types/products';

export function useProductsList(params: ListProductsParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.products.list(params as Record<string, unknown>),
    queryFn: () => fetchProducts(params),
    placeholderData: (prev) => prev,
    enabled,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: queryKeys.products.categories,
    queryFn: async () => {
      const result = await fetchProducts({ page: 1, limit: 100, activo: true });
      const categories = [...new Set(result.items.map((p) => p.categoria))].sort();
      return categories;
    },
    staleTime: 5 * 60 * 1000,
  });
}
