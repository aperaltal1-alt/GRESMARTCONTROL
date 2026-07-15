'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchUserRoles } from '@/lib/users/services';
import { queryKeys } from '@/lib/query/keys';

export function useUserRoles() {
  return useQuery({
    queryKey: queryKeys.users.roles,
    queryFn: fetchUserRoles,
    staleTime: 5 * 60 * 1000,
  });
}
