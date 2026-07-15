'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchGreById } from '@/lib/gre/services';
import { queryKeys } from '@/lib/query/keys';

export function useGreDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.gre.detail(id ?? ''),
    queryFn: () => fetchGreById(id!),
    enabled: Boolean(id),
  });
}
