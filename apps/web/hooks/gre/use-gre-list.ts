'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchGreList } from '@/lib/gre/services';
import { queryKeys } from '@/lib/query/keys';
import type { ListGreParams } from '@/types/gre';

export function useGreList(params: ListGreParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.gre.list(params as Record<string, unknown>),
    queryFn: () => fetchGreList(params),
    placeholderData: (prev) => prev,
    enabled,
  });
}
