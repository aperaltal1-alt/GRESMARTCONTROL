'use client';

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { changePasswordRequest } from '@/lib/auth/session';

export function useChangePassword() {
  return useMutation({
    mutationKey: ['auth', 'change-password'],
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      changePasswordRequest(currentPassword, newPassword),
    onSuccess: () => {
      toast.success('Contraseña actualizada', {
        description: 'Deberás iniciar sesión nuevamente.',
      });
    },
    onError: (error) => {
      toast.error('No se pudo cambiar la contraseña', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
