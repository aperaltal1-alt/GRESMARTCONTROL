import { siteConfig } from '@/config/site';
import { env } from '@/config/env';
import { notifyAuthSessionCleared } from '@/lib/auth/session-events';

const isBrowser = typeof window !== 'undefined';

function authCookieFlags(): string {
  const secure = env.isProduction ? '; Secure' : '';
  return `; path=/; SameSite=Lax${secure}`;
}

export function getAccessToken(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(siteConfig.accessTokenKey);
}

export function setAccessToken(token: string): void {
  if (!isBrowser) return;
  localStorage.setItem(siteConfig.accessTokenKey, token);
  document.cookie = `${siteConfig.authCookie}=1${authCookieFlags()}`;
}

export function clearAccessToken(): void {
  if (!isBrowser) return;
  localStorage.removeItem(siteConfig.accessTokenKey);
  document.cookie = `${siteConfig.authCookie}=; Max-Age=0${authCookieFlags()}`;
}

export function syncAuthCookie(): void {
  if (!isBrowser) return;
  const token = getAccessToken();
  if (token) {
    document.cookie = `${siteConfig.authCookie}=1${authCookieFlags()}`;
  } else {
    document.cookie = `${siteConfig.authCookie}=; Max-Age=0${authCookieFlags()}`;
  }
}

export function getStoredUser(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem('gre_user');
}

export function setStoredUser(user: unknown): void {
  if (!isBrowser) return;
  localStorage.setItem('gre_user', JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (!isBrowser) return;
  localStorage.removeItem('gre_user');
}

export function clearAuthStorage(): void {
  clearAccessToken();
  clearStoredUser();
  notifyAuthSessionCleared();
}
