'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { updateUserStatus } from '@/lib/users/services';
import { queryKeys } from '@/lib/query/keys';
import type { PaginatedResponse } from '@/types/api';
import type { User } from '@/types/users';

interface UpdateUserStatusInput {
  id: string;
  activo: boolean;
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['users', 'status'],
    mutationFn: ({ id, activo }: UpdateUserStatusInput) => updateUserStatus(id, { activo }),
    onMutate: async ({ id, activo }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.lists });
      const snapshots = queryClient.getQueriesData<PaginatedResponse<User>>({
        queryKey: queryKeys.users.lists,
      });

      snapshots.forEach(([key, data]) => {
        if (!data) return;
        queryClient.setQueryData<PaginatedResponse<User>>(key, {
          ...data,
          items: data.items.map((item) =>
            item.id === id ? { ...item, activo } : item,
          ),
        });
      });

      return { snapshots };
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(vars.activo ? 'Usuario activado' : 'Usuario desactivado');
    },
    onError: (error, _vars, context) => {
      context?.snapshots.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error('No se pudo cambiar el estado', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
