'use client';

import type { DashboardCharts } from '@/types/dashboard';
import { DashboardAreaChart, DashboardBarChart } from './dashboard-charts';
import { ChartSkeleton } from './dashboard-skeleton';
import { DashboardError } from './dashboard-error';
import { DashboardEmpty } from './dashboard-empty';

interface ChartsSectionProps {
  charts?: DashboardCharts;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function ChartsSection({ charts, isLoading, isError, onRetry }: ChartsSectionProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (isError || !charts) {
    return <DashboardError onRetry={onRetry} />;
  }

  const hasGreData = charts.grePorDia.some((p) => p.total > 0);
  const hasKardexData = charts.movimientosKardexPorDia.some((p) => p.total > 0);
  const hasDiffData = charts.diferenciasPorDia.some((p) => p.total > 0);
  const hasStockData = charts.productosStockBajo.length > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {hasGreData ? (
        <DashboardAreaChart
          title="GRE por día"
          description="Guías de remisión registradas en los últimos 30 días"
          data={charts.grePorDia}
          color="hsl(var(--brand))"
          gradientId="greGradient"
          index={0}
        />
      ) : (
        <DashboardEmpty
          title="Sin datos de GRE"
          description="No hay GRE registradas en el período seleccionado."
          className="min-h-[320px] justify-center"
        />
      )}

      {hasKardexData ? (
        <DashboardAreaChart
          title="Movimientos Kardex"
          description="Entradas y salidas registradas por día"
          data={charts.movimientosKardexPorDia}
          color="hsl(var(--info))"
          gradientId="kardexGradient"
          index={1}
        />
      ) : (
        <DashboardEmpty
          title="Sin movimientos Kardex"
          description="No hay movimientos en el período seleccionado."
          className="min-h-[320px] justify-center"
        />
      )}

      {hasDiffData ? (
        <DashboardAreaChart
          title="Diferencias detectadas"
          description="Incidencias de conciliación por día"
          data={charts.diferenciasPorDia}
          color="hsl(var(--warning))"
          gradientId="diffGradient"
          index={2}
        />
      ) : (
        <DashboardEmpty
          title="Sin diferencias"
          description="No se detectaron diferencias en el período."
          className="min-h-[320px] justify-center"
        />
      )}

      {hasStockData ? (
        <DashboardBarChart
          title="Productos críticos"
          description="Stock actual vs mínimo configurado"
          data={charts.productosStockBajo}
          index={3}
        />
      ) : (
        <DashboardEmpty
          title="Sin productos críticos"
          description="Todos los productos están por encima del stock mínimo."
          className="min-h-[320px] justify-center"
        />
      )}
    </div>
  );
}
