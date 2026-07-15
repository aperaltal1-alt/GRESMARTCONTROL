'use client';

import Link from 'next/link';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, CheckCircle2, Loader2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/auth/schemas';
import { useForgotPassword } from '@/hooks/auth';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const mutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values.email);
    setSubmitted(true);
  });

  if (submitted) {
    return (
      <Card className="border-border/60 shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <Logo />
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <CardTitle>Solicitud enviada</CardTitle>
            <CardDescription>
              Si el correo está registrado, recibirás instrucciones de recuperación.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="w-full gap-2">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="space-y-4">
        <Logo />
        <div>
          <CardTitle>Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo y te enviaremos instrucciones si la cuenta existe.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu@empresa.pe"
                className="pl-9"
                {...register('email')}
              />
            </div>
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar instrucciones'
            )}
          </Button>

          <Button asChild variant="ghost" className="w-full gap-2">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              Volver al login
            </Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
