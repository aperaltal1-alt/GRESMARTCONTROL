export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  profile: '/auth/profile',
  changePassword: '/auth/change-password',
  forgotPassword: '/auth/forgot-password',
} as const;

export const REFRESH_TOKEN_COOKIE = 'gre_refresh_token';
