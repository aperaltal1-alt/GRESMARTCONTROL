'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { forgotPasswordRequest } from '@/lib/auth/session';

export function useForgotPassword() {
  return useMutation({
    mutationKey: ['auth', 'forgot-password'],
    mutationFn: (email: string) => forgotPasswordRequest(email),
    onSuccess: () => {
      toast.success('Solicitud enviada', {
        description: 'Si el correo existe, recibirás instrucciones de recuperación.',
      });
    },
    onError: (error) => {
      toast.error('No se pudo procesar la solicitud', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
