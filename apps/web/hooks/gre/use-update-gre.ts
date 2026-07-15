'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { updateGre } from '@/lib/gre/services';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { GreListItem, UpdateGrePayload } from '@/types/gre';

interface UpdateGreInput {
  id: string;
  payload: UpdateGrePayload;
}

export function useUpdateGre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['gre', 'update'],
    mutationFn: ({ id, payload }: UpdateGreInput) => updateGre(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.gre.lists });
      const snapshots = queryClient.getQueriesData<PaginatedResponse<GreListItem>>({
        queryKey: queryKeys.gre.lists,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<GreListItem>>(key, {
          ...data,
          items: data.items.map((item) =>
            item.id === id ? { ...item, ...payload } : item,
          ),
        });
      });

      return { snapshots };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.gre.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.gre.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('GRE actualizada correctamente');
    },
    onError: (error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('No se pudo actualizar la GRE', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
