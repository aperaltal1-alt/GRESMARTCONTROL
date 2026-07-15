import type { UserRole } from '@/types/auth';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido?: string | null;
  rol: UserRole;
  rolNombre: string;
  activo: boolean;
  ultimoLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleOption {
  codigo: UserRole;
  nombre: string;
  descripcion?: string | null;
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  activo?: boolean;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  nombre: string;
  apellido?: string;
  rol: UserRole;
}

export interface UpdateUserPayload {
  email?: string;
  nombre?: string;
  apellido?: string;
  rol?: UserRole;
  password?: string;
}

export interface UpdateUserStatusPayload {
  activo: boolean;
}
