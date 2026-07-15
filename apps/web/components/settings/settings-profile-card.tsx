'use client';

import { RefreshCw, User } from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatInitials } from '@/lib/utils';
import { userRolLabel } from '@/lib/users/schemas';
import { UserRolBadge } from '@/components/users/user-rol-badge';

export function SettingsProfileCard() {
  const { user, refreshProfile } = useAuth();

  const handleRefresh = async () => {
    await refreshProfile();
  };

  if (!user) {
    return (
      <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No hay información de perfil disponible.
        </CardContent>
      </Card>
    );
  }

  const fullName = [user.nombre, user.apellido].filter(Boolean).join(' ');

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">Perfil de usuario</CardTitle>
          <CardDescription>Información de tu cuenta en GRE Smart Control.</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{formatInitials(fullName)}</AvatarFallback>
          </Avatar>

          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Nombre completo
              </p>
              <p className="mt-1 font-medium">{fullName}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Rol
              </p>
              <div className="mt-1">
                <UserRolBadge rol={user.rol} />
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                ID de usuario
              </p>
              <p className="mt-1 font-mono text-sm text-muted-foreground">{user.id}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          <User className="h-4 w-4 shrink-0" />
          <span>
            Acceso como <Badge variant="secondary">{userRolLabel(user.rol)}</Badge>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
