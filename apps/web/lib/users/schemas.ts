import { z } from 'zod';
import type { UserRole } from '@/types/auth';

export const userFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').optional().or(z.literal('')),
  nombre: z.string().min(1, 'Nombre requerido'),
  apellido: z.string().optional(),
  rol: z.enum(['ADMIN', 'SUPERVISOR', 'CONSULTA'] as const),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

export const createUserSchema = userFormSchema.extend({
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export function canManageUsers(rol?: UserRole): boolean {
  return rol === 'ADMIN';
}

export function userRolLabel(rol: UserRole | string): string {
  const labels: Record<string, string> = {
    ADMIN: 'Administrador',
    SUPERVISOR: 'Supervisor',
    CONSULTA: 'Consulta',
  };
  return labels[rol] ?? rol;
}

export function userRolVariant(rol: UserRole | string): 'default' | 'secondary' | 'outline' {
  if (rol === 'ADMIN') return 'default';
  if (rol === 'SUPERVISOR') return 'secondary';
  return 'outline';
}
