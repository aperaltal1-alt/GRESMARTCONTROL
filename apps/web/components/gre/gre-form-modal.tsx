'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
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
import { useProductsList } from '@/hooks/products';
import { COMMON_SERIES, GRE_ESTADOS, greFormSchema, type GreFormValues } from '@/lib/gre/schemas';
import { greEstadoLabel } from '@/lib/gre/utils';
import type { Gre } from '@/types/gre';

interface GreFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  gre?: Gre;
  isLoadingGre?: boolean;
  onSubmit: (values: GreFormValues) => Promise<void>;
  isPending: boolean;
}

const defaultValues: GreFormValues = {
  numero: '',
  serie: 'T001',
  fecha: new Date().toISOString().slice(0, 10),
  ruc: '',
  transportista: '',
  origen: '',
  destino: '',
  observaciones: '',
  productos: [{ productoId: '', cantidad: 1 }],
};

export function GreFormModal({
  open,
  onOpenChange,
  mode,
  gre,
  isLoadingGre = false,
  onSubmit,
  isPending,
}: GreFormModalProps) {
  const productsQuery = useProductsList({ page: 1, limit: 100, activo: true });
  const products = productsQuery.data?.items ?? [];

  const form = useForm<GreFormValues>({
    resolver: zodResolver(greFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = form;

  const { fields, append, remove } = useFieldArray({ control, name: 'productos' });

  useEffect(() => {
    if (!open) return;

    if (mode === 'edit') {
      if (gre) {
        reset({
          numero: gre.numero,
          serie: gre.serie,
          fecha: gre.fecha,
          ruc: gre.ruc,
          transportista: gre.transportista ?? '',
          origen: gre.origen ?? '',
          destino: gre.destino ?? '',
          observaciones: gre.observaciones ?? '',
          estado: gre.estado as GreFormValues['estado'],
          productos: gre.productos.map((p) => ({
            productoId: p.productoId ?? '',
            cantidad: p.cantidad,
          })),
        });
      }
      return;
    }

    reset(defaultValues);
  }, [open, mode, gre, reset]);

  const handleFormSubmit = handleSubmit(async (values) => {
    const payload = {
      ...values,
      ruc: values.ruc || undefined,
      transportista: values.transportista || undefined,
      origen: values.origen || undefined,
      destino: values.destino || undefined,
      observaciones: values.observaciones || undefined,
    };
    await onSubmit(payload);
    onOpenChange(false);
  });

  const selectClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nueva GRE' : 'Editar GRE'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Registra una guía de remisión con al menos un producto.'
              : 'Actualiza los datos de la guía de remisión.'}
          </DialogDescription>
        </DialogHeader>

        {mode === 'edit' && isLoadingGre && !gre ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Cargando GRE" />
          </div>
        ) : (
        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="serie">Serie</Label>
              <select id="serie" {...register('serie')} className={selectClass}>
                {COMMON_SERIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.serie ? (
                <p className="text-xs text-destructive">{errors.serie.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="numero">Número</Label>
              <Input
                id="numero"
                placeholder="00000001"
                {...register('numero')}
                className={errors.numero ? 'border-destructive' : ''}
              />
              {errors.numero ? (
                <p className="text-xs text-destructive">{errors.numero.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha emisión</Label>
              <Input
                id="fecha"
                type="date"
                {...register('fecha')}
                className={errors.fecha ? 'border-destructive' : ''}
              />
              {errors.fecha ? (
                <p className="text-xs text-destructive">{errors.fecha.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="transportista">Transportista</Label>
              <Input id="transportista" {...register('transportista')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC emisor (opcional)</Label>
              <Input id="ruc" placeholder="20123456789" maxLength={11} {...register('ruc')} />
              {errors.ruc ? (
                <p className="text-xs text-destructive">{errors.ruc.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="origen">Origen</Label>
              <Input id="origen" {...register('origen')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destino">Destino</Label>
              <Input id="destino" {...register('destino')} />
            </div>
          </div>

          {mode === 'edit' ? (
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <select id="estado" {...register('estado')} className={selectClass}>
                {GRE_ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {greEstadoLabel(e)}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Input id="observaciones" {...register('observaciones')} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Productos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => append({ productoId: '', cantidad: 1 })}
              >
                <Plus className="h-3.5 w-3.5" />
                Agregar
              </Button>
            </div>

            {errors.productos?.message ? (
              <p className="text-xs text-destructive">{errors.productos.message}</p>
            ) : null}

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1">
                    <select
                      {...register(`productos.${index}.productoId`)}
                      className={selectClass}
                    >
                      <option value="">Seleccionar producto</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.codigo} — {p.nombre}
                        </option>
                      ))}
                    </select>
                    {errors.productos?.[index]?.productoId ? (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.productos[index]?.productoId?.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min={0.0001}
                      step="any"
                      placeholder="Cant."
                      {...register(`productos.${index}.cantidad`)}
                    />
                  </div>
                  {fields.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : mode === 'create' ? (
                'Crear GRE'
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
