'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { createUser } from '@/lib/users/services';
import { queryKeys } from '@/lib/query/keys';
import type { CreateUserPayload } from '@/types/users';

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['users', 'create'],
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Usuario creado correctamente');
    },
    onError: (error) => {
      toast.error('No se pudo crear el usuario', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
