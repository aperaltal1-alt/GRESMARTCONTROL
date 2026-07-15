'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle, mounted, isMobile, mobileOpen, closeMobile } = useSidebar();

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  if (!mounted) {
    return <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block md:w-sidebar md:border-r md:bg-card" />;
  }

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden flex-col border-r bg-card shadow-sm transition-[width] duration-300 md:flex',
          collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
        )}
      >
        <div className="relative border-b px-4 py-5">
          <Logo collapsed={collapsed} />
          <Button
            variant="outline"
            size="icon"
            className="absolute -right-3 top-7 h-6 w-6 rounded-full bg-background shadow-sm"
            onClick={toggle}
            aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
          >
            {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>
        <SidebarNav collapsed={collapsed} />
      </aside>

      {isMobile && mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            aria-label="Cerrar menú de navegación"
            onClick={closeMobile}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 flex w-sidebar flex-col border-r bg-card shadow-lg md:hidden"
            aria-label="Menú de navegación"
          >
            <div className="flex items-center justify-between border-b px-4 py-5">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobile}
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <SidebarNav onNavigate={closeMobile} />
          </aside>
        </>
      ) : null}
    </>
  );
}
