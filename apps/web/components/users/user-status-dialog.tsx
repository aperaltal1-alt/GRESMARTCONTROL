'use client';

import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { User } from '@/types/users';

interface UserStatusDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

export function UserStatusDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: UserStatusDialogProps) {
  const isActivating = user ? !user.activo : false;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isActivating ? '¿Activar usuario?' : '¿Desactivar usuario?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isActivating ? (
              <>
                El usuario{' '}
                <span className="font-medium text-foreground">
                  {user?.email} — {user?.nombre}
                </span>{' '}
                podrá volver a acceder al sistema.
              </>
            ) : (
              <>
                El usuario{' '}
                <span className="font-medium text-foreground">
                  {user?.email} — {user?.nombre}
                </span>{' '}
                no podrá iniciar sesión hasta que sea reactivado.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault();
              await onConfirm();
              onOpenChange(false);
            }}
            disabled={isPending}
            className={
              isActivating
                ? undefined
                : 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            }
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : isActivating ? (
              'Activar'
            ) : (
              'Desactivar'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
