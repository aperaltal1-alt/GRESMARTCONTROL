'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { deleteGre } from '@/lib/gre/services';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { GreListItem } from '@/types/gre';

export function useDeleteGre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['gre', 'delete'],
    mutationFn: (id: string) => deleteGre(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.gre.lists });
      const snapshots = queryClient.getQueriesData<PaginatedResponse<GreListItem>>({
        queryKey: queryKeys.gre.lists,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<GreListItem>>(key, {
          ...data,
          items: data.items.filter((item) => item.id !== id),
          meta: { ...data.meta, total: Math.max(0, data.meta.total - 1) },
        });
      });

      return { snapshots };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gre.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('GRE desactivada correctamente');
    },
    onError: (error, _id, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('No se pudo desactivar la GRE', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
