export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  apellido: string | null;
  rol: string;
  rolId: string;
  empresaId: string;
  empresaNombre: string;
  passwordHash: string;
  activo: boolean;
  ultimoLoginAt: Date | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthTokensResponse extends TokenPair {
  tokenType: 'Bearer';
}
