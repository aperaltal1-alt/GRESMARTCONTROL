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
import { formatGreNumber } from '@/lib/gre/utils';
import type { Incident } from '@/types/incidents';

interface ResolveIncidentDialogProps {
  incident: Incident | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

export function ResolveIncidentDialog({
  incident,
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: ResolveIncidentDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Resolver incidencia?</AlertDialogTitle>
          <AlertDialogDescription>
            La incidencia del producto{' '}
            <span className="font-medium text-foreground">
              {incident?.codigoProducto}
            </span>{' '}
            en la GRE{' '}
            <span className="font-medium text-foreground">
              {incident
                ? formatGreNumber(incident.greSerie, incident.greNumero)
                : ''}
            </span>{' '}
            será marcada como resuelta. Esta acción no puede deshacerse.
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
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Resolviendo...
              </>
            ) : (
              'Resolver incidencia'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
