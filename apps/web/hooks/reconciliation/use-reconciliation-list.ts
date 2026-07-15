'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchReconciliationList } from '@/lib/reconciliation/services';
import { queryKeys } from '@/lib/query/keys';
import type { ListReconciliationParams } from '@/types/reconciliation';

export function useReconciliationList(params: ListReconciliationParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.reconciliation.list(params as Record<string, unknown>),
    queryFn: () => fetchReconciliationList(params),
    placeholderData: (prev) => prev,
    enabled,
  });
}
