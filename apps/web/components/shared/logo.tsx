import { cn } from '@/lib/utils';

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  variant?: 'default' | 'light';
}

export function Logo({ collapsed = false, className, variant = 'default' }: LogoProps) {
  const isLight = variant === 'light';

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand to-blue-400 text-sm font-bold text-white shadow-brand">
        GS
      </div>
      {!collapsed ? (
        <div className="min-w-0">
          <p className={cn('truncate text-sm font-bold tracking-tight', isLight && 'text-white')}>
            GRE Smart Control
          </p>
          <p className={cn('truncate text-[11px] text-muted-foreground', isLight && 'text-white/70')}>
            Conciliación Inteligente
          </p>
        </div>
      ) : null}
    </div>
  );
}
