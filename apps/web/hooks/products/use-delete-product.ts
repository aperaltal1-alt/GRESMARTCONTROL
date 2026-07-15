'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { deleteProduct } from '@/lib/products/services';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { Product } from '@/types/products';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['products', 'delete'],
    mutationFn: (id: string) => deleteProduct(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.lists });
      const snapshots = queryClient.getQueriesData<PaginatedResponse<Product>>({
        queryKey: queryKeys.products.lists,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<Product>>(key, {
          ...data,
          items: data.items.filter((item) => item.id !== id),
          meta: {
            ...data.meta,
            total: Math.max(0, data.meta.total - 1),
          },
        });
      });

      return { snapshots };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.kardex.all });
      toast.success('Producto desactivado correctamente');
    },
    onError: (error, _id, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('No se pudo desactivar el producto', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
