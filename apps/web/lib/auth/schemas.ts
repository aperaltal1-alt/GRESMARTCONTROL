import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Ingresa un correo válido'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
