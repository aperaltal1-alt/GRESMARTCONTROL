'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigation } from '@gre-smart/shared';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/components/providers/auth-provider';
import { getNavIcon } from '@/lib/navigation/icons';
import { cn, formatInitials } from '@/lib/utils';

interface SidebarNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.rol ?? 'CONSULTA';

  return (
    <>
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-4" aria-label="Navegación principal">
          {navigation.map((group) => {
            const items = group.items.filter((item) => item.roles.includes(role));
            if (!items.length) return null;

            return (
              <div key={group.title}>
                {!collapsed ? (
                  <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-muted-foreground">
                    {group.title}
                  </p>
                ) : null}
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = getNavIcon(item.icon);
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const link = (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          active
                            ? 'border-l-2 border-brand bg-brand-muted text-brand'
                            : 'border-l-2 border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
                          collapsed && 'justify-center px-2',
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!collapsed ? <span className="truncate">{item.label}</span> : null}
                        {!collapsed && item.badge ? (
                          <Badge variant="destructive" className="ml-auto h-5 min-w-5 justify-center px-1.5">
                            •
                          </Badge>
                        ) : null}
                      </Link>
                    );

                    if (collapsed) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>{link}</TooltipTrigger>
                          <TooltipContent side="right">{item.label}</TooltipContent>
                        </Tooltip>
                      );
                    }

                    return link;
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="border-t bg-muted/30 p-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {formatInitials(user?.nombre ?? 'Usuario Demo')}
            </AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.nombre ?? 'Usuario'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.rol ?? 'CONSULTA'}</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
