import { env } from './env';

export const siteConfig = {
  name: env.appName,
  description: 'Conciliación inteligente de GRE, Kardex e Inventario',
  apiUrl: env.apiUrl,
  defaultTheme: 'light' as const,
  authCookie: 'gre-auth',
  accessTokenKey: 'gre_access_token',
  rememberEmailKey: 'gre_remember_email',
  sidebarStorageKey: 'gre_sidebar_collapsed',
} as const;

export const publicRoutes = ['/login', '/forgot-password'] as const;

export const authRoutes = ['/login', '/forgot-password'] as const;
