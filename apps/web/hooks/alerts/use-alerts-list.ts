'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '@/lib/alerts/services';
import { queryKeys } from '@/lib/query/keys';
import type { ListAlertsParams } from '@/types/alerts';

export function useAlertsList(params: ListAlertsParams) {
  return useQuery({
    queryKey: queryKeys.alerts.list(params as Record<string, unknown>),
    queryFn: () => fetchAlerts(params),
    placeholderData: (prev) => prev,
  });
}
