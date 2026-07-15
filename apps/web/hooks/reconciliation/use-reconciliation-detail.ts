'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchReconciliationById } from '@/lib/reconciliation/services';
import { queryKeys } from '@/lib/query/keys';

export function useReconciliationDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.reconciliation.detail(id ?? ''),
    queryFn: () => fetchReconciliationById(id!),
    enabled: Boolean(id),
  });
}
