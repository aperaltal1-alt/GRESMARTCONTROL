'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { createGre } from '@/lib/gre/services';
import { queryKeys } from '@/lib/query/keys';
import type { CreateGrePayload } from '@/types/gre';

export function useCreateGre() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['gre', 'create'],
    mutationFn: (payload: CreateGrePayload) => createGre(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gre.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('GRE creada correctamente');
    },
    onError: (error) => {
      toast.error('No se pudo crear la GRE', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
