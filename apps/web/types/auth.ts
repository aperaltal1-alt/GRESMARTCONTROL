export type UserRole = 'ADMIN' | 'SUPERVISOR' | 'CONSULTA';

export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido?: string | null;
  rol: UserRole;
  empresaId: string;
  empresaNombre?: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
