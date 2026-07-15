'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { configSubNav } from '@gre-smart/shared';
import { getNavIcon } from '@/lib/navigation/icons';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';

interface SettingsConfigLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SettingsConfigLayout({ title, description, children }: SettingsConfigLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto rounded-xl border border-border/60 bg-card/80 p-2 backdrop-blur-sm lg:w-56 lg:flex-col">
          <Link
            href="/configuracion"
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              pathname === '/configuracion'
                ? 'bg-brand/10 text-brand'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            )}
          >
            General
          </Link>
          {configSubNav.map((item) => {
            const Icon = getNavIcon(item.icon);
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-brand/10 text-brand'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
