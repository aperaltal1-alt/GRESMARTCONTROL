const DEFAULT_REDIRECT = '/dashboard/operativo';

export function getSafeRedirectPath(redirect: string | null | undefined): string {
  if (!redirect) return DEFAULT_REDIRECT;
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return DEFAULT_REDIRECT;
  return redirect;
}
