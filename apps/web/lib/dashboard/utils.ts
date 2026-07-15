import type { ChartPoint, TrendDirection, TrendInfo } from '@/types/dashboard';
import { formatShortDateCompact } from '@/lib/utils/date';
import { greEstadoLabel } from '@/lib/gre/utils';

export { greEstadoLabel };

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-PE').format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatShortDate(dateStr: string): string {
  return formatShortDateCompact(dateStr);
}

export function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Hace unos minutos';
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return formatShortDate(dateStr);
}

export function calculateSeriesTrend(
  points: ChartPoint[],
  windowDays = 7,
): { value: number; direction: TrendDirection } {
  if (points.length < windowDays) {
    return { value: 0, direction: 'neutral' };
  }

  const recent = points.slice(-windowDays).reduce((sum, p) => sum + p.total, 0);
  const previousStart = Math.max(0, points.length - windowDays * 2);
  const previous = points
    .slice(previousStart, points.length - windowDays)
    .reduce((sum, p) => sum + p.total, 0);

  if (previous === 0) {
    if (recent > 0) return { value: 100, direction: 'up' };
    return { value: 0, direction: 'neutral' };
  }

  const change = ((recent - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change * 10) / 10),
    direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
  };
}

export function buildTrendLabel(
  direction: TrendDirection,
  value: number,
  suffix = 'vs período anterior',
): string {
  if (direction === 'neutral' || value === 0) return 'Sin variación reciente';
  const arrow = direction === 'up' ? '↑' : '↓';
  return `${arrow} ${value}% ${suffix}`;
}

export function ratioTrend(current: number, total: number): TrendInfo {
  if (total === 0) {
    return { value: 0, direction: 'neutral', label: 'Sin datos registrados' };
  }
  const pct = (current / total) * 100;
  return {
    value: Math.round(pct * 10) / 10,
    direction: pct > 50 ? 'up' : pct > 0 ? 'neutral' : 'down',
    label: `${formatPercent(pct)} del total`,
  };
}

export function prioridadVariant(prioridad: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (prioridad === 'CRITICA' || prioridad === 'ALTA') return 'destructive';
  if (prioridad === 'MEDIA') return 'default';
  return 'secondary';
}

export function alertaNivelColor(nivel: string): string {
  const colors: Record<string, string> = {
    INFO: 'text-blue-500',
    WARNING: 'text-amber-500',
    ERROR: 'text-orange-500',
    CRITICAL: 'text-red-500',
  };
  return colors[nivel] ?? 'text-muted-foreground';
}

export function riesgoNivelColor(nivel: string): string {
  const colors: Record<string, string> = {
    BAJO: 'text-emerald-500',
    MEDIO: 'text-amber-500',
    ALTO: 'text-red-500',
  };
  return colors[nivel] ?? 'text-muted-foreground';
}
