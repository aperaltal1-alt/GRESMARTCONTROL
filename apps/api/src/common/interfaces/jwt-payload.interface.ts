export interface JwtPayload {
  sub: string;
  email: string;
  nombre: string;
  apellido?: string;
  rol: string;
  empresaId: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser extends JwtPayload {
  id: string;
}
