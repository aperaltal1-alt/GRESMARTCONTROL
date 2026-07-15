'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardKpis } from '@/lib/dashboard/services';
import { queryKeys } from '@/lib/query/keys';

export function useDashboardKpis() {
  return useQuery({
    queryKey: queryKeys.dashboard.kpis,
    queryFn: fetchDashboardKpis,
  });
}
