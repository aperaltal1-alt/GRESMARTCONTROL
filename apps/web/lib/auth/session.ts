import { apiClient } from '@/lib/api/client';
import { AUTH_ENDPOINTS } from '@/lib/auth/constants';
import {
  clearAuthStorage,
  getAccessToken,
  setAccessToken,
  setStoredUser,
} from '@/lib/auth/token-storage';
import type { ApiResponse } from '@/types/api';
import type { AuthUser, LoginResponse } from '@/types/auth';

export async function loginRequest(email: string, password: string) {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(AUTH_ENDPOINTS.login, {
    email,
    password,
  });

  setAccessToken(data.data.tokens.accessToken);
  setStoredUser(data.data.user);
  return data.data;
}

export async function logoutRequest() {
  try {
    await apiClient.post(AUTH_ENDPOINTS.logout);
  } finally {
    clearAuthStorage();
  }
}

export async function refreshSessionRequest() {
  const { data } = await apiClient.post<ApiResponse<{ tokens: { accessToken: string } }>>(
    AUTH_ENDPOINTS.refresh,
  );
  setAccessToken(data.data.tokens.accessToken);
  return data.data.tokens.accessToken;
}

export async function fetchProfileRequest() {
  const { data } = await apiClient.get<ApiResponse<AuthUser & { permisos?: string[]; ultimoLoginAt?: string | null }>>(
    AUTH_ENDPOINTS.profile,
  );
  setStoredUser(data.data);
  return data.data;
}

export async function changePasswordRequest(currentPassword: string, newPassword: string) {
  const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
    AUTH_ENDPOINTS.changePassword,
    { currentPassword, newPassword },
  );
  return data.data;
}

export async function forgotPasswordRequest(email: string) {
  const { data } = await apiClient.post<ApiResponse<{ message: string }>>(
    AUTH_ENDPOINTS.forgotPassword,
    { email: email.trim().toLowerCase() },
  );
  return data.data;
}

export function getInitialAuthState() {
  return {
    accessToken: getAccessToken(),
  };
}
