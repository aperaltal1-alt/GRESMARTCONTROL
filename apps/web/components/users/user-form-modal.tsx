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
import {
  createUserSchema,
  userFormSchema,
  userRolLabel,
  type UserFormValues,
} from '@/lib/users/schemas';
import type { RoleOption, User } from '@/types/users';
import type { UserRole } from '@/types/auth';

interface UserFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  user?: User;
  roles: RoleOption[];
  onSubmit: (values: UserFormValues) => Promise<void>;
  isPending: boolean;
}

const defaultValues: UserFormValues = {
  email: '',
  password: '',
  nombre: '',
  apellido: '',
  rol: 'CONSULTA',
};

export function UserFormModal({
  open,
  onOpenChange,
  mode,
  user,
  roles,
  onSubmit,
  isPending,
}: UserFormModalProps) {
  const schema = mode === 'create' ? createUserSchema : userFormSchema;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
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
      if (mode === 'edit' && user) {
        reset({
          email: user.email,
          password: '',
          nombre: user.nombre,
          apellido: user.apellido ?? '',
          rol: user.rol,
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, mode, user, reset]);

  const handleFormSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
    onOpenChange(false);
  });

  const roleOptions = roles.length
    ? roles
    : (['ADMIN', 'SUPERVISOR', 'CONSULTA'] as UserRole[]).map((codigo) => ({
        codigo,
        nombre: userRolLabel(codigo),
      }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent key={`${mode}-${user?.id ?? 'new'}`} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo usuario' : 'Editar usuario'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Registra un nuevo usuario con acceso al sistema.'
              : 'Actualiza los datos del usuario seleccionado.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@empresa.com"
              {...register('email')}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                placeholder="Juan"
                {...register('nombre')}
                className={errors.nombre ? 'border-destructive' : ''}
              />
              {errors.nombre ? (
                <p className="text-xs text-destructive">{errors.nombre.message}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input id="apellido" placeholder="Pérez" {...register('apellido')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rol">Rol</Label>
            <select
              id="rol"
              {...register('rol')}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {roleOptions.map((role) => (
                <option key={role.codigo} value={role.codigo}>
                  {role.nombre}
                </option>
              ))}
            </select>
            {errors.rol ? (
              <p className="text-xs text-destructive">{errors.rol.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {mode === 'create' ? 'Contraseña' : 'Nueva contraseña (opcional)'}
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === 'create' ? 'new-password' : 'off'}
              placeholder={mode === 'create' ? 'Mínimo 8 caracteres' : 'Dejar vacío para no cambiar'}
              {...register('password')}
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password ? (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            ) : null}
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
                'Crear usuario'
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
