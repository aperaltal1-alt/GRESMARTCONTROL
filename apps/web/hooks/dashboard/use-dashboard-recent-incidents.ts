'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRecentIncidents } from '@/lib/dashboard/services';
import { queryKeys } from '@/lib/query/keys';

export function useDashboardRecentIncidents(limit = 8, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentIncidents(limit),
    queryFn: () => fetchRecentIncidents(limit),
    enabled,
  });
}
