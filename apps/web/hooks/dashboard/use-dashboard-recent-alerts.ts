'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchRecentAlerts } from '@/lib/dashboard/services';
import { queryKeys } from '@/lib/query/keys';

export function useDashboardRecentAlerts(limit = 8, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentAlerts(limit),
    queryFn: () => fetchRecentAlerts(limit),
    enabled,
  });
}
