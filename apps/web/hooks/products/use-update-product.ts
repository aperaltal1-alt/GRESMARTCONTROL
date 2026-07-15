'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { updateProduct } from '@/lib/products/services';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { Product, UpdateProductPayload } from '@/types/products';

interface UpdateProductInput {
  id: string;
  payload: UpdateProductPayload;
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['products', 'update'],
    mutationFn: ({ id, payload }: UpdateProductInput) => updateProduct(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.lists });
      const snapshots = queryClient.getQueriesData<PaginatedResponse<Product>>({
        queryKey: queryKeys.products.lists,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<Product>>(key, {
          ...data,
          items: data.items.map((item) =>
            item.id === id ? { ...item, ...payload } : item,
          ),
        });
      });

      return { snapshots };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.kardex.all });
      toast.success('Producto actualizado correctamente');
    },
    onError: (error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('No se pudo actualizar el producto', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
