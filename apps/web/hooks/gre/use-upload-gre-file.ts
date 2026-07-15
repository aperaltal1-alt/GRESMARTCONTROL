'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/lib/api/client';
import { uploadGreFile } from '@/lib/gre/services';
import { queryKeys } from '@/lib/query/keys';

interface UploadGreInput {
  greId: string;
  file: File;
}

export function useUploadGreFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['gre', 'upload'],
    mutationFn: ({ greId, file }: UploadGreInput) => uploadGreFile(greId, file),
    onSuccess: (_data, { greId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gre.detail(greId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.gre.lists });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      toast.success('Archivo cargado correctamente');
    },
    onError: (error) => {
      toast.error('No se pudo cargar el archivo', {
        description: getApiErrorMessage(error),
      });
    },
  });
}
