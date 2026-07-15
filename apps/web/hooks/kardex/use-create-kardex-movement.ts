'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { createKardexMovement } from '@/lib/kardex/services';
import { queryKeys } from '@/lib/query/keys';
import type { CreateKardexMovementPayload } from '@/types/kardex';

export function useCreateKardexMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['kardex', 'create'],
    mutationFn: (payload: CreateKardexMovementPayload) => createKardexMovement(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.kardex.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Movimiento registrado correctamente');
    },
    onError: (error) => {
      toast.error('No se pudo registrar el movimiento', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
