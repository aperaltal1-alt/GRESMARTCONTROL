'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { collapsed, mounted } = useSidebar();

  const contentMargin = collapsed
    ? 'md:ml-[var(--sidebar-collapsed)]'
    : 'md:ml-[var(--sidebar-width)]';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex min-h-screen min-w-0 flex-col transition-[margin-left] duration-300',
          mounted ? contentMargin : 'md:ml-[var(--sidebar-width)]',
        )}
      >
        <Topbar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
