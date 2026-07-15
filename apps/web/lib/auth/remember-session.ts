import { siteConfig } from '@/config/site';

const isBrowser = typeof window !== 'undefined';

export function getRememberedEmail(): string | null {
  if (!isBrowser) return null;
  return localStorage.getItem(siteConfig.rememberEmailKey);
}

export function setRememberedEmail(email: string): void {
  if (!isBrowser) return;
  localStorage.setItem(siteConfig.rememberEmailKey, email.toLowerCase().trim());
}

export function clearRememberedEmail(): void {
  if (!isBrowser) return;
  localStorage.removeItem(siteConfig.rememberEmailKey);
}

export function shouldRememberSession(): boolean {
  if (!isBrowser) return false;
  return localStorage.getItem(`${siteConfig.rememberEmailKey}_persist`) === 'true';
}

export function setRememberSessionPreference(remember: boolean): void {
  if (!isBrowser) return;
  if (remember) {
    localStorage.setItem(`${siteConfig.rememberEmailKey}_persist`, 'true');
  } else {
    localStorage.removeItem(`${siteConfig.rememberEmailKey}_persist`);
  }
}
