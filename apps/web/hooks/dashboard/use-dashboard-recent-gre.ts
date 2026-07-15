'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRecentGre } from '@/lib/dashboard/services';
import { queryKeys } from '@/lib/query/keys';

export function useDashboardRecentGre(limit = 8, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentGre(limit),
    queryFn: () => fetchRecentGre(limit),
    enabled,
  });
}
