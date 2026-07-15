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
import { COMMON_UNITS, productFormSchema, type ProductFormValues } from '@/lib/products/schemas';
import type { Product } from '@/types/products';

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  product?: Product;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  isPending: boolean;
}

const defaultValues: ProductFormValues = {
  codigo: '',
  nombre: '',
  categoria: '',
  unidad: 'UND',
  stockActual: 0,
  stockMinimo: 0,
};

export function ProductFormModal({
  open,
  onOpenChange,
  mode,
  product,
  onSubmit,
  isPending,
}: ProductFormModalProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && product) {
        reset({
          codigo: product.codigo,
          nombre: product.nombre,
          categoria: product.categoria,
          unidad: product.unidad,
          stockActual: product.stockActual,
          stockMinimo: product.stockMinimo,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, mode, product, reset]);

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo producto' : 'Editar producto'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Registra un producto con stock inicial en el catálogo.'
              : 'Actualiza los datos del producto seleccionado.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                placeholder="HARINA-001"
                {...register('codigo')}
                className={errors.codigo ? 'border-destructive' : ''}
              />
              {errors.codigo ? (
                <p className="text-xs text-destructive">{errors.codigo.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidad">Unidad</Label>
              <select
                id="unidad"
                {...register('unidad')}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {COMMON_UNITS.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unidad ? (
                <p className="text-xs text-destructive">{errors.unidad.message}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              placeholder="Harina de Trigo 1kg"
              {...register('nombre')}
              className={errors.nombre ? 'border-destructive' : ''}
            />
            {errors.nombre ? (
              <p className="text-xs text-destructive">{errors.nombre.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              placeholder="Abarrotes"
              {...register('categoria')}
              className={errors.categoria ? 'border-destructive' : ''}
            />
            {errors.categoria ? (
              <p className="text-xs text-destructive">{errors.categoria.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="stockActual">Stock actual</Label>
              <Input
                id="stockActual"
                type="number"
                min={0}
                step="any"
                {...register('stockActual')}
                className={errors.stockActual ? 'border-destructive' : ''}
              />
              {errors.stockActual ? (
                <p className="text-xs text-destructive">{errors.stockActual.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockMinimo">Stock mínimo</Label>
              <Input
                id="stockMinimo"
                type="number"
                min={0}
                step="any"
                {...register('stockMinimo')}
                className={errors.stockMinimo ? 'border-destructive' : ''}
              />
              {errors.stockMinimo ? (
                <p className="text-xs text-destructive">{errors.stockMinimo.message}</p>
              ) : null}
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
                'Crear producto'
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
