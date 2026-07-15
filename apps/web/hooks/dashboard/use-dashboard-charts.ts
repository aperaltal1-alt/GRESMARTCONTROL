'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardCharts } from '@/lib/dashboard/services';
import { queryKeys } from '@/lib/query/keys';

export function useDashboardCharts(dias = 30) {
  return useQuery({
    queryKey: queryKeys.dashboard.charts(dias),
    queryFn: () => fetchDashboardCharts(dias),
  });
}
