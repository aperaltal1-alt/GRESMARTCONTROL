import type { UserRole } from '@/types/auth';

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  apellido?: string | null;
  rol: UserRole;
  empresaId: string;
  empresaNombre?: string;
  ultimoLoginAt?: string | null;
  permisos?: string[];
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message: string;
}
