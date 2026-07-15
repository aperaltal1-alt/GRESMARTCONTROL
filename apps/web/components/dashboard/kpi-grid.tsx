'use client';

import {
  buildTrendLabel,
  calculateSeriesTrend,
  formatNumber,
  formatPercent,
  ratioTrend,
} from '@/lib/dashboard/utils';
import type { DashboardCharts, DashboardKpis } from '@/types/dashboard';
import { DashboardError } from './dashboard-error';
import { KpiCard, KPI_ICONS } from './kpi-card';
import { KpiGridSkeleton } from './dashboard-skeleton';

interface KpiGridProps {
  kpis?: DashboardKpis;
  charts?: DashboardCharts;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function KpiGrid({ kpis, charts, isLoading, isError, onRetry }: KpiGridProps) {
  if (isLoading) return <KpiGridSkeleton />;
  if (isError || !kpis) {
    return <DashboardError onRetry={onRetry} className="col-span-full" />;
  }

  const greTrend = charts
    ? calculateSeriesTrend(charts.grePorDia)
    : { value: 0, direction: 'neutral' as const };
  const diffTrend = charts
    ? calculateSeriesTrend(charts.diferenciasPorDia)
    : { value: 0, direction: 'neutral' as const };
  const kardexTrend = charts
    ? calculateSeriesTrend(charts.movimientosKardexPorDia)
    : { value: 0, direction: 'neutral' as const };

  const conciliadasRatio = ratioTrend(kpis.greConciliadas, kpis.totalGre);
  const diferenciasRatio = ratioTrend(kpis.greConDiferencias, kpis.totalGre);

  const items = [
    {
      key: 'totalGre',
      title: 'Total GRE',
      value: formatNumber(kpis.totalGre),
      icon: KPI_ICONS.totalGre,
      colorClass: 'text-blue-500',
      iconBgClass: 'bg-blue-500/10',
      trend: {
        direction: greTrend.direction,
        label: buildTrendLabel(greTrend.direction, greTrend.value),
        positive: true,
      },
      tooltip: 'Total de Guías de Remisión Electrónicas registradas en el sistema.',
    },
    {
      key: 'greConciliadas',
      title: 'GRE conciliadas',
      value: formatNumber(kpis.greConciliadas),
      icon: KPI_ICONS.greConciliadas,
      colorClass: 'text-emerald-500',
      iconBgClass: 'bg-emerald-500/10',
      trend: {
        direction: conciliadasRatio.direction,
        label: conciliadasRatio.label,
        positive: true,
      },
      tooltip: 'GRE que han sido conciliadas exitosamente con Kardex e Inventario.',
    },
    {
      key: 'greConDiferencias',
      title: 'GRE con diferencias',
      value: formatNumber(kpis.greConDiferencias),
      icon: KPI_ICONS.greConDiferencias,
      colorClass: 'text-amber-500',
      iconBgClass: 'bg-amber-500/10',
      trend: {
        direction: diffTrend.direction,
        label: buildTrendLabel(diffTrend.direction, diffTrend.value, 'en últimos 7 días'),
        positive: false,
      },
      tooltip: 'GRE que presentan discrepancias entre fuentes de datos.',
    },
    {
      key: 'totalProductos',
      title: 'Productos registrados',
      value: formatNumber(kpis.totalProductos),
      icon: KPI_ICONS.totalProductos,
      colorClass: 'text-indigo-500',
      iconBgClass: 'bg-indigo-500/10',
      trend: {
        direction: 'neutral' as const,
        label: 'Catálogo activo',
        positive: true,
      },
      tooltip: 'Total de productos en el catálogo de la empresa.',
    },
    {
      key: 'stockTotalDisponible',
      title: 'Stock disponible',
      value: formatNumber(kpis.stockTotalDisponible),
      icon: KPI_ICONS.stockTotalDisponible,
      colorClass: 'text-cyan-500',
      iconBgClass: 'bg-cyan-500/10',
      trend: {
        direction: kardexTrend.direction,
        label: buildTrendLabel(kardexTrend.direction, kardexTrend.value, 'movimientos'),
        positive: true,
      },
      tooltip: 'Suma total de unidades disponibles en inventario.',
    },
    {
      key: 'productosStockBajo',
      title: 'Productos críticos',
      value: formatNumber(kpis.productosStockBajo),
      icon: KPI_ICONS.productosStockBajo,
      colorClass: 'text-orange-500',
      iconBgClass: 'bg-orange-500/10',
      trend: {
        direction: kpis.productosStockBajo > 0 ? ('up' as const) : ('neutral' as const),
        label: kpis.productosStockBajo > 0 ? 'Requieren atención' : 'Sin alertas de stock',
        positive: false,
      },
      tooltip: 'Productos con stock por debajo del mínimo configurado.',
    },
    {
      key: 'alertasActivas',
      title: 'Alertas activas',
      value: formatNumber(kpis.alertasActivas),
      icon: KPI_ICONS.alertasActivas,
      colorClass: 'text-yellow-500',
      iconBgClass: 'bg-yellow-500/10',
      trend: {
        direction: kpis.alertasActivas > 0 ? ('up' as const) : ('neutral' as const),
        label: kpis.alertasActivas > 0 ? 'Pendientes de revisión' : 'Sin alertas',
        positive: false,
      },
      tooltip: 'Alertas del sistema que requieren atención del usuario.',
    },
    {
      key: 'incidenciasPendientes',
      title: 'Incidencias pendientes',
      value: formatNumber(kpis.incidenciasPendientes),
      icon: KPI_ICONS.incidenciasPendientes,
      colorClass: 'text-red-500',
      iconBgClass: 'bg-red-500/10',
      trend: {
        direction: kpis.incidenciasPendientes > 0 ? ('up' as const) : ('neutral' as const),
        label: kpis.incidenciasPendientes > 0 ? 'Sin resolver' : 'Todo al día',
        positive: false,
      },
      tooltip: 'Incidencias de conciliación que aún no han sido resueltas.',
    },
    {
      key: 'nivelConciliacion',
      title: 'Nivel de conciliación',
      value: formatPercent(kpis.nivelConciliacion),
      icon: KPI_ICONS.nivelConciliacion,
      colorClass: kpis.nivelConciliacion >= 70 ? 'text-emerald-500' : 'text-amber-500',
      iconBgClass: kpis.nivelConciliacion >= 70 ? 'bg-emerald-500/10' : 'bg-amber-500/10',
      trend: {
        direction: conciliadasRatio.direction,
        label: `${kpis.greConciliadas} de ${kpis.totalGre} GRE`,
        positive: true,
      },
      tooltip: 'Porcentaje de GRE conciliadas sobre el total registrado.',
    },
    {
      key: 'riesgoTributario',
      title: 'Riesgo tributario',
      value: formatPercent(kpis.riesgoTributario.porcentaje),
      icon: KPI_ICONS.riesgoTributario,
      colorClass:
        kpis.riesgoTributario.nivel === 'ALTO'
          ? 'text-red-500'
          : kpis.riesgoTributario.nivel === 'MEDIO'
            ? 'text-amber-500'
            : 'text-emerald-500',
      iconBgClass:
        kpis.riesgoTributario.nivel === 'ALTO'
          ? 'bg-red-500/10'
          : kpis.riesgoTributario.nivel === 'MEDIO'
            ? 'bg-amber-500/10'
            : 'bg-emerald-500/10',
      trend: {
        direction: diferenciasRatio.direction,
        label: `Nivel ${kpis.riesgoTributario.nivel}`,
        positive: false,
      },
      tooltip: 'Porcentaje de GRE con diferencias que representan riesgo tributario.',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map(({ key, ...item }, index) => (
        <KpiCard key={key} {...item} index={index} />
      ))}
    </div>
  );
}
