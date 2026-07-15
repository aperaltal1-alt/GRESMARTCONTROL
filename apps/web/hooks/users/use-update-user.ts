'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { updateUser } from '@/lib/users/services';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { UpdateUserPayload, User } from '@/types/users';

interface UpdateUserInput {
  id: string;
  payload: UpdateUserPayload;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['users', 'update'],
    mutationFn: ({ id, payload }: UpdateUserInput) => updateUser(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.lists });
      const snapshots = queryClient.getQueriesData<PaginatedResponse<User>>({
        queryKey: queryKeys.users.lists,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<User>>(key, {
          ...data,
          items: data.items.map((item) =>
            item.id === id ? { ...item, ...payload } : item,
          ),
        });
      });

      return { snapshots };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('Usuario actualizado');
    },
    onError: (error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('No se pudo actualizar el usuario', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
