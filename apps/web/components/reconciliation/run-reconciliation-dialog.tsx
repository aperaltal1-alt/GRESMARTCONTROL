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
import { cn } from '@/lib/utils';
import type { GreListItem } from '@/types/gre';

interface RunReconciliationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  greList: GreListItem[];
  selectedGreId: string;
  onSelectedGreIdChange: (greId: string) => void;
  onConfirm: () => Promise<void>;
  isPending: boolean;
}

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function RunReconciliationDialog({
  open,
  onOpenChange,
  greList,
  selectedGreId,
  onSelectedGreIdChange,
  onConfirm,
  isPending,
}: RunReconciliationDialogProps) {
  const selectedGre = greList.find((g) => g.id === selectedGreId);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ejecutar conciliación</AlertDialogTitle>
          <AlertDialogDescription>
            Se compararán las cantidades de la GRE seleccionada contra Kardex e inventario
            físico. Este proceso puede generar incidencias y alertas automáticamente.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-2">
          <label htmlFor="gre-select" className="mb-2 block text-sm font-medium">
            Seleccionar GRE
          </label>
          <select
            id="gre-select"
            value={selectedGreId}
            onChange={(e) => onSelectedGreIdChange(e.target.value)}
            className={cn(selectClass)}
            disabled={isPending}
          >
            <option value="">— Selecciona una GRE —</option>
            {greList.map((gre) => (
              <option key={gre.id} value={gre.id}>
                {formatGreNumber(gre.serie, gre.numero)} · {gre.empresa}
              </option>
            ))}
          </select>
          {selectedGre ? (
            <p className="mt-2 text-xs text-muted-foreground">
              {selectedGre.totalProductos} producto(s) · Estado: {selectedGre.estado}
            </p>
          ) : null}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.preventDefault();
              if (!selectedGreId) return;
              await onConfirm();
              onOpenChange(false);
            }}
            disabled={isPending || !selectedGreId}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Ejecutando...
              </>
            ) : (
              'Confirmar conciliación'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
