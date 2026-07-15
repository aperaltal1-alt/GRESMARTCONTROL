'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { runReconciliation } from '@/lib/reconciliation/services';
import { queryKeys } from '@/lib/query/keys';

export function useRunReconciliation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['reconciliation', 'run'],
    mutationFn: (greId: string) => runReconciliation(greId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reconciliation.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.gre.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Conciliación ejecutada', {
        description: `${data.lineasOk}/${data.totalLineas} líneas OK · ${data.incidenciasCreadas} incidencias`,
      });
    },
    onError: (error) => {
      toast.error('No se pudo ejecutar la conciliación', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
