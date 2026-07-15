export const DASHBOARD_CONSTANTS = {
  DEFAULT_DAYS: 30,
  MAX_DAYS: 90,
  DEFAULT_RECENT_LIMIT: 10,
  MAX_RECENT_LIMIT: 50,
  RIESGO_BAJO_MAX: 20,
  RIESGO_MEDIO_MAX: 50,
} as const;

export type RiesgoTributarioNivel = 'BAJO' | 'MEDIO' | 'ALTO';
