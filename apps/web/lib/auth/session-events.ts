export const AUTH_SESSION_CLEARED_EVENT = 'gre-auth-session-cleared';

export function notifyAuthSessionCleared(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_SESSION_CLEARED_EVENT));
  }
}
