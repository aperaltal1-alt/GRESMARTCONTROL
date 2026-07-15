'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/auth-provider';
import type { LoginFormValues } from '@/lib/forms/schemas';

export function useLoginMutation() {
  const { login } = useAuth();

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (values: LoginFormValues) =>
      login(values.email, values.password, values.rememberMe),
  });
}

export function useLogoutMutation() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
