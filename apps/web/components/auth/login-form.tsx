'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAuth } from '@/components/providers/auth-provider';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getApiErrorMessage } from '@/lib/api/client';
import { getSafeRedirectPath } from '@/lib/auth/redirect';
import { useLoginMutation } from '@/lib/auth/hooks';
import { getRememberedEmail } from '@/lib/auth/remember-session';
import { DEMO_CREDENTIALS, loginSchema, type LoginFormValues } from '@/lib/forms/schemas';
import { cn } from '@/lib/utils';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const loginMutation = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const redirectTo = getSafeRedirectPath(searchParams.get('redirect'));

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid, touchedFields },
  } = form;

  useEffect(() => {
    const remembered = getRememberedEmail();
    if (remembered) {
      setValue('email', remembered, { shouldValidate: true });
      setValue('rememberMe', true);
    }
  }, [setValue]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [authLoading, isAuthenticated, redirectTo, router]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const user = await loginMutation.mutateAsync(values);
      toast.success(`Bienvenido, ${user.nombre}`, {
        description: `Sesión iniciada como ${user.rol}.`,
      });
      router.replace(redirectTo);
    } catch (error) {
      toast.error('No se pudo iniciar sesión', {
        description: getApiErrorMessage(error, 'Verifica tus credenciales e intenta nuevamente.'),
      });
    }
  });

  const fillDemoCredentials = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true, shouldTouch: true });
    setValue('password', password, { shouldValidate: true, shouldTouch: true });
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full"
    >
      <Card className="relative overflow-hidden border-border/60 bg-background/80 shadow-2xl backdrop-blur-xl dark:bg-background/70">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
        <CardHeader className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-4 lg:hidden">
              <Logo />
            </div>
            <ThemeToggle />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">Iniciar sesión</CardTitle>
            <CardDescription>
              Accede a GRE Smart Control con tus credenciales corporativas.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@empresa.pe"
                  className={cn('pl-9', errors.email && 'border-destructive focus-visible:ring-destructive')}
                  {...register('email')}
                />
              </div>
              {errors.email ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              ) : touchedFields.email ? (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Correo válido</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    'pl-9 pr-10',
                    errors.password && 'border-destructive focus-visible:ring-destructive',
                  )}
                  {...register('password')}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-destructive"
                >
                  {errors.password.message}
                </motion.p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <Label htmlFor="rememberMe" className="cursor-pointer text-sm font-normal">
                Recordar sesión en este dispositivo
              </Label>
            </div>

            <Button
              type="submit"
              className="h-11 w-full bg-brand text-brand-foreground shadow-brand hover:bg-brand/90"
              disabled={!isValid || loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                'Ingresar'
              )}
            </Button>
          </form>

          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" />
              <p className="text-sm font-medium">Credenciales demo del MVP</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {DEMO_CREDENTIALS.map((demo) => (
                <button
                  key={demo.email}
                  type="button"
                  onClick={() => fillDemoCredentials(demo.email, demo.password)}
                  className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-3 text-left transition-colors hover:border-brand/40 hover:bg-brand-muted/40"
                >
                  <Badge variant="secondary" className="mb-2">
                    {demo.label}
                  </Badge>
                  <p className="truncate text-xs text-muted-foreground">{demo.email}</p>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
