'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/lib/users/services';
import { queryKeys } from '@/lib/query/keys';
import type { ListUsersParams } from '@/types/users';

export function useUsersList(params: ListUsersParams) {
  return useQuery({
    queryKey: queryKeys.users.list(params as Record<string, unknown>),
    queryFn: () => fetchUsers(params),
    placeholderData: (prev) => prev,
  });
}
