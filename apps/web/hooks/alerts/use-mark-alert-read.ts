'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { markAlertAsRead } from '@/lib/alerts/services';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { Alert } from '@/types/alerts';

export function useMarkAlertRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['alerts', 'read'],
    mutationFn: (id: string) => markAlertAsRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.alerts.lists });
      const snapshots = queryClient.getQueriesData<PaginatedResponse<Alert>>({
        queryKey: queryKeys.alerts.lists,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<Alert>>(key, {
          ...data,
          items: data.items.map((item) =>
            item.id === id ? { ...item, leida: true } : item,
          ),
        });
      });

      return { snapshots };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Alerta marcada como leída');
    },
    onError: (error, _id, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('No se pudo marcar la alerta', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
