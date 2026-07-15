'use client';

import { Building2 } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SettingsCompanyCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No hay información de empresa disponible.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">Empresa</CardTitle>
        <CardDescription>Organización asociada a tu cuenta de acceso.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand/10">
            <Building2 className="h-6 w-6 text-brand" />
          </div>
          <div className="min-w-0 space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Razón social
              </p>
              <p className="mt-1 text-lg font-semibold">
                {user.empresaNombre ?? 'Empresa no configurada'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ID de empresa
              </p>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{user.empresaId}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
