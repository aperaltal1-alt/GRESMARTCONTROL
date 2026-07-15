export const MVP_USER_ROLES = ['ADMIN', 'SUPERVISOR', 'CONSULTA'] as const;

export type MvpUserRole = (typeof MVP_USER_ROLES)[number];

export const USER_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
