import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  CriticalProductItem,
  DashboardCharts,
  DashboardKpis,
  RecentAlertItem,
  RecentGreItem,
  RecentIncidentItem,
} from '@/types/dashboard';

const BASE = '/dashboard';

export async function fetchDashboardKpis(): Promise<DashboardKpis> {
  const { data } = await apiClient.get<ApiResponse<DashboardKpis>>(`${BASE}/kpis`);
  return data.data;
}

export async function fetchDashboardCharts(dias = 30): Promise<DashboardCharts> {
  const { data } = await apiClient.get<ApiResponse<DashboardCharts>>(`${BASE}/charts`, {
    params: { dias },
  });
  return data.data;
}

export async function fetchRecentGre(limit = 8): Promise<RecentGreItem[]> {
  const { data } = await apiClient.get<ApiResponse<RecentGreItem[]>>(`${BASE}/recent-gre`, {
    params: { limit },
  });
  return data.data;
}

export async function fetchRecentIncidents(limit = 8): Promise<RecentIncidentItem[]> {
  const { data } = await apiClient.get<ApiResponse<RecentIncidentItem[]>>(
    `${BASE}/recent-incidents`,
    { params: { limit } },
  );
  return data.data;
}

export async function fetchRecentAlerts(limit = 8): Promise<RecentAlertItem[]> {
  const { data } = await apiClient.get<ApiResponse<RecentAlertItem[]>>(`${BASE}/recent-alerts`, {
    params: { limit },
  });
  return data.data;
}

export async function fetchCriticalProducts(): Promise<CriticalProductItem[]> {
  const { data } = await apiClient.get<ApiResponse<CriticalProductItem[]>>(
    `${BASE}/critical-products`,
  );
  return data.data;
}
