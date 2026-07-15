'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearRememberedEmail,
  setRememberedEmail,
  setRememberSessionPreference,
} from '@/lib/auth/remember-session';
import {
  fetchProfileRequest,
  getInitialAuthState,
  loginRequest,
  logoutRequest,
  refreshSessionRequest,
} from '@/lib/auth/session';
import { getStoredUser, syncAuthCookie } from '@/lib/auth/token-storage';
import { AUTH_SESSION_CLEARED_EVENT } from '@/lib/auth/session-events';
import type { AuthUser } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      const { accessToken: token } = getInitialAuthState();
      syncAuthCookie();

      const storedUser = getStoredUser();
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser) as AuthUser);
        } catch {
          setUser(null);
        }
      }

      if (token) {
        setAccessTokenState(token);
        try {
          const profile = await fetchProfileRequest();
          if (!cancelled) setUser(profile);
        } catch {
          try {
            const refreshed = await refreshSessionRequest();
            if (refreshed) {
              const profile = await fetchProfileRequest();
              if (!cancelled) {
                setAccessTokenState(refreshed);
                setUser(profile);
              }
            }
          } catch {
            if (!cancelled) {
              setUser(null);
              setAccessTokenState(null);
            }
          }
        }
      } else {
        try {
          const refreshed = await refreshSessionRequest();
          if (refreshed) {
            const profile = await fetchProfileRequest();
            if (!cancelled) {
              setAccessTokenState(refreshed);
              setUser(profile);
            }
          }
        } catch {
          // Sin sesión activa
        }
      }

      if (!cancelled) setIsLoading(false);
    }

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleSessionCleared = () => {
      setUser(null);
      setAccessTokenState(null);
    };

    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);
    return () => window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, handleSessionCleared);
  }, []);

  const login = useCallback(async (email: string, password: string, rememberMe = true) => {
    const data = await loginRequest(email.trim(), password);

    if (rememberMe) {
      setRememberedEmail(email);
      setRememberSessionPreference(true);
    } else {
      clearRememberedEmail();
      setRememberSessionPreference(false);
    }

    setUser(data.user);
    setAccessTokenState(data.tokens.accessToken);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await logoutRequest();
    setUser(null);
    setAccessTokenState(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await fetchProfileRequest();
    setUser(profile);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user && accessToken),
      isLoading,
      login,
      logout,
      refreshProfile,
    }),
    [user, accessToken, isLoading, login, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
