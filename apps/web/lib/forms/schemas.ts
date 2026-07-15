import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Ingresa un correo válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  rememberMe: z.boolean().default(true),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const DEMO_CREDENTIALS = [
  {
    label: 'Admin',
    email: 'admin@gre-demo.pe',
    password: 'Demo2024!',
    role: 'ADMIN' as const,
  },
  {
    label: 'Supervisor',
    email: 'supervisor@gre-demo.pe',
    password: 'Demo2024!',
    role: 'SUPERVISOR' as const,
  },
  {
    label: 'Consulta',
    email: 'consulta@gre-demo.pe',
    password: 'Demo2024!',
    role: 'CONSULTA' as const,
  },
] as const;
