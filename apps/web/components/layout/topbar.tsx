'use client';

import { Bell, LogOut, Menu, Search, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useLogoutMutation } from '@/lib/auth/hooks';
import { useAuth } from '@/components/providers/auth-provider';
import { useSidebar } from '@/hooks/use-sidebar';
import { formatInitials } from '@/lib/utils';

function getBreadcrumb(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return ['Inicio'];
  return segments.map((segment) => segment.replace(/-/g, ' '));
}

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const logoutMutation = useLogoutMutation();
  const { openMobile } = useSidebar();
  const crumbs = getBreadcrumb(pathname);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      toast.success('Sesión cerrada correctamente');
      router.replace('/login');
    } catch {
      toast.error('No se pudo cerrar la sesión');
    }
  };

  return (
    <header className="glass-header sticky top-0 z-30 flex h-header items-center gap-4 px-4 sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={openMobile}
        aria-label="Abrir menú de navegación"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="hidden min-w-0 items-center gap-2 text-sm text-muted-foreground md:flex">
        {crumbs.map((crumb, index) => (
          <span key={`${crumb}-${index}`} className="flex items-center gap-2 capitalize">
            {index > 0 ? <span>/</span> : null}
            <span className={index === crumbs.length - 1 ? 'font-semibold text-foreground' : ''}>
              {crumb}
            </span>
          </span>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden w-64 lg:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Buscar..." disabled aria-label="Buscar" />
        </div>

        <Button variant="ghost" size="icon" aria-label="Notificaciones" disabled>
          <Bell className="h-4 w-4" />
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2" aria-label="Menú de usuario">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{formatInitials(user?.nombre ?? 'U D')}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">{user?.nombre ?? 'Usuario'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.nombre ?? 'Usuario'}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email ?? ''}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/cuenta')}>
              <User className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut className="mr-2 h-4 w-4" />
              {logoutMutation.isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
