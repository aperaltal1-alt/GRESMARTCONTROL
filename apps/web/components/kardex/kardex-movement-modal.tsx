'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KARDEX_MOVEMENT_TYPES, kardexMovementSchema, type KardexMovementFormValues } from '@/lib/kardex/schemas';
import { cantidadLabel, kardexTipoLabel } from '@/lib/kardex/utils';
import type { Product } from '@/types/products';

interface KardexMovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSubmit: (values: KardexMovementFormValues) => Promise<void>;
  isPending: boolean;
}

const defaultValues: KardexMovementFormValues = {
  productoId: '',
  fecha: new Date().toISOString().slice(0, 10),
  tipo: 'ENTRADA',
  cantidad: 1,
  observacion: '',
};

const selectClass =
  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function KardexMovementModal({
  open,
  onOpenChange,
  products,
  onSubmit,
  isPending,
}: KardexMovementModalProps) {
  const form = useForm<KardexMovementFormValues>({
    resolver: zodResolver(kardexMovementSchema),
    defaultValues,
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = form;
  const tipo = watch('tipo');

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, reset]);

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit({
      ...values,
      observacion: values.observacion || undefined,
    });
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
          <DialogDescription>
            Registra una entrada, salida o ajuste de stock en el kardex.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo de movimiento</Label>
            <div className="grid grid-cols-3 gap-2">
              {KARDEX_MOVEMENT_TYPES.map((t) => (
                <label
                  key={t}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                    tipo === t
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <input type="radio" value={t} {...register('tipo')} className="sr-only" />
                  {kardexTipoLabel(t)}
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="productoId">Producto</Label>
            <select id="productoId" {...register('productoId')} className={selectClass}>
              <option value="">Seleccionar producto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.codigo} — {p.nombre} (Stock: {p.stockActual})</option>
              ))}
            </select>
            {errors.productoId ? <p className="text-xs text-destructive">{errors.productoId.message}</p> : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" type="date" {...register('fecha')} className={errors.fecha ? 'border-destructive' : ''} />
              {errors.fecha ? <p className="text-xs text-destructive">{errors.fecha.message}</p> : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">{cantidadLabel(tipo)}</Label>
              <Input id="cantidad" type="number" min={0.0001} step="any" {...register('cantidad')} className={errors.cantidad ? 'border-destructive' : ''} />
              {errors.cantidad ? <p className="text-xs text-destructive">{errors.cantidad.message}</p> : null}
              {tipo === 'AJUSTE' ? (
                <p className="text-[11px] text-muted-foreground">En ajuste, la cantidad es el stock resultante deseado.</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacion">Observación (opcional)</Label>
            <Input id="observacion" placeholder="Motivo del movimiento..." {...register('observacion')} />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</> : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
