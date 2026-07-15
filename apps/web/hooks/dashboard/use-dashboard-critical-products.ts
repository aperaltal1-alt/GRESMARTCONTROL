'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchCriticalProducts } from '@/lib/dashboard/services';
import { queryKeys } from '@/lib/query/keys';

export function useDashboardCriticalProducts() {
  return useQuery({
    queryKey: queryKeys.dashboard.criticalProducts,
    queryFn: fetchCriticalProducts,
  });
}
