'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { createProduct } from '@/lib/products/services';
import { queryKeys } from '@/lib/query/keys';
import type { CreateProductPayload } from '@/types/products';

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['products', 'create'],
    mutationFn: (payload: CreateProductPayload) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.kardex.all });
      toast.success('Producto creado correctamente');
    },
    onError: (error) => {
      toast.error('No se pudo crear el producto', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
