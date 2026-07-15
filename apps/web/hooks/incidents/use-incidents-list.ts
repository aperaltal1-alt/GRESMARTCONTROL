'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchIncidents } from '@/lib/incidents/services';
import { queryKeys } from '@/lib/query/keys';
import type { ListIncidentsParams } from '@/types/incidents';

export function useIncidentsList(params: ListIncidentsParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.incidents.list(params as Record<string, unknown>),
    queryFn: () => fetchIncidents(params),
    placeholderData: (prev) => prev,
    enabled,
  });
}
