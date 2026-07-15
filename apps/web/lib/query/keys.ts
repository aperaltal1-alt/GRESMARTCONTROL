export const queryKeys = {
  dashboard: {
    all: ['dashboard'] as const,
    kpis: ['dashboard', 'kpis'] as const,
    charts: (days: number) => ['dashboard', 'charts', days] as const,
    recentGre: (limit: number) => ['dashboard', 'recent-gre', limit] as const,
    recentIncidents: (limit: number) => ['dashboard', 'recent-incidents', limit] as const,
    recentAlerts: (limit: number) => ['dashboard', 'recent-alerts', limit] as const,
    criticalProducts: ['dashboard', 'critical-products'] as const,
  },
  products: {
    all: ['products'] as const,
    lists: ['products', 'list'] as const,
    list: (params: Record<string, unknown>) => ['products', 'list', params] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
    categories: ['products', 'categories'] as const,
  },
  gre: {
    all: ['gre'] as const,
    lists: ['gre', 'list'] as const,
    list: (params: Record<string, unknown>) => ['gre', 'list', params] as const,
    detail: (id: string) => ['gre', 'detail', id] as const,
  },
  kardex: {
    all: ['kardex'] as const,
    list: (params: Record<string, unknown>) => ['kardex', 'list', params] as const,
  },
  inventory: {
    all: ['inventory'] as const,
    list: (params: Record<string, unknown>) => ['inventory', 'list', params] as const,
    summary: ['inventory', 'summary'] as const,
  },
  reconciliation: {
    all: ['reconciliation'] as const,
    list: (params: Record<string, unknown>) => ['reconciliation', 'list', params] as const,
    detail: (id: string) => ['reconciliation', 'detail', id] as const,
  },
  incidents: {
    all: ['incidents'] as const,
    lists: ['incidents', 'list'] as const,
    list: (params: Record<string, unknown>) => ['incidents', 'list', params] as const,
  },
  alerts: {
    all: ['alerts'] as const,
    lists: ['alerts', 'list'] as const,
    list: (params: Record<string, unknown>) => ['alerts', 'list', params] as const,
  },
  users: {
    all: ['users'] as const,
    lists: ['users', 'list'] as const,
    list: (params: Record<string, unknown>) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
    roles: ['users', 'roles'] as const,
  },
} as const;
