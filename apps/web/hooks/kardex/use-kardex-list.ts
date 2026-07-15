'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchKardexMovements } from '@/lib/kardex/services';
import { queryKeys } from '@/lib/query/keys';
import type { ListKardexParams } from '@/types/kardex';

export function useKardexList(params: ListKardexParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.kardex.list(params as Record<string, unknown>),
    queryFn: () => fetchKardexMovements(params),
    placeholderData: (prev) => prev,
    enabled,
  });
}
