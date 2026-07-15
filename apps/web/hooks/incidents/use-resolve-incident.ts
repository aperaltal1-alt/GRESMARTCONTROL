'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { resolveIncident } from '@/lib/incidents/services';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { Incident } from '@/types/incidents';

export function useResolveIncident() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['incidents', 'resolve'],
    mutationFn: (id: string) => resolveIncident(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.incidents.lists });
      const snapshots = queryClient.getQueriesData<PaginatedResponse<Incident>>({
        queryKey: queryKeys.incidents.lists,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<Incident>>(key, {
          ...data,
          items: data.items.map((item) =>
            item.id === id ? { ...item, estado: 'RESUELTA' as const } : item,
          ),
        });
      });

      return { snapshots };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Incidencia resuelta');
    },
    onError: (error, _id, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('No se pudo resolver la incidencia', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
