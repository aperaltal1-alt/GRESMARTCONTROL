'use client';

import { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Download, RefreshCw, ShieldAlert, Target } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { ChartSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { CriticalProductsTable } from '@/components/dashboard/critical-products-table';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { KpiGrid } from '@/components/dashboard/kpi-grid';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useDashboardCharts,
  useDashboardCriticalProducts,
  useDashboardKpis,
} from '@/hooks/dashboard';
import { formatNumber, formatPercent, riesgoNivelColor } from '@/lib/dashboard/utils';
import { downloadCsv, formatReportDate } from '@/lib/reports/utils';
import { queryKeys } from '@/lib/query/keys';
import type { CriticalProductItem, DashboardCharts, DashboardKpis } from '@/types/dashboard';
import { ReportsSkeleton } from './reports-skeleton';

const ChartsSection = dynamic(
  () => import('@/components/dashboard/charts-section').then((mod) => mod.ChartsSection),
  {
    loading: () => (
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    ),
    ssr: false,
  },
);

function buildReportRows(
  kpis: DashboardKpis,
  charts: DashboardCharts,
  criticalProducts: CriticalProductItem[],
): (string | number)[][] {
  const rows: (string | number)[][] = [
    ['--- RESUMEN EJECUTIVO ---', ''],
    ['Nivel de conciliación', formatPercent(kpis.nivelConciliacion)],
    ['Riesgo tributario (%)', formatPercent(kpis.riesgoTributario.porcentaje)],
    ['Riesgo tributario (nivel)', kpis.riesgoTributario.nivel],
    ['', ''],
    ['--- KPIs ---', ''],
    ['Total GRE', kpis.totalGre],
    ['GRE conciliadas', kpis.greConciliadas],
    ['GRE con diferencias', kpis.greConDiferencias],
    ['Total productos', kpis.totalProductos],
    ['Stock disponible', kpis.stockTotalDisponible],
    ['Productos críticos', kpis.productosStockBajo],
    ['Alertas activas', kpis.alertasActivas],
    ['Incidencias pendientes', kpis.incidenciasPendientes],
    ['', ''],
    ['--- GRE POR DÍA ---', ''],
    ['Fecha', 'Total'],
    ...charts.grePorDia.map((point) => [point.fecha, point.total]),
    ['', ''],
    ['--- MOVIMIENTOS KARDEX POR DÍA ---', ''],
    ['Fecha', 'Total'],
    ...charts.movimientosKardexPorDia.map((point) => [point.fecha, point.total]),
    ['', ''],
    ['--- DIFERENCIAS POR DÍA ---', ''],
    ['Fecha', 'Total'],
    ...charts.diferenciasPorDia.map((point) => [point.fecha, point.total]),
    ['', ''],
    ['--- PRODUCTOS CRÍTICOS (GRÁFICO) ---', ''],
    ['Código', 'Nombre', 'Stock actual', 'Stock mínimo'],
    ...charts.productosStockBajo.map((item) => [
      item.codigo,
      item.nombre,
      item.stockActual,
      item.stockMinimo,
    ]),
    ['', ''],
    ['--- PRODUCTOS CRÍTICOS (DETALLE) ---', ''],
    ['Código', 'Nombre', 'Stock actual', 'Stock mínimo', 'Estado'],
    ...criticalProducts.map((item) => [
      item.codigo,
      item.nombre,
      item.stockActual,
      item.stockMinimo,
      item.estado,
    ]),
  ];

  return rows;
}

export function ReportsPageContent() {
  const queryClient = useQueryClient();

  const kpisQuery = useDashboardKpis();
  const chartsQuery = useDashboardCharts(30);
  const criticalQuery = useDashboardCriticalProducts();

  const isInitialLoading =
    kpisQuery.isLoading || chartsQuery.isLoading || criticalQuery.isLoading;

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
  }, [queryClient]);

  const handleExportCsv = useCallback(() => {
    if (!kpisQuery.data || !chartsQuery.data || !criticalQuery.data) return;

    const filename = `reporte-gre-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsv(filename, ['Campo', 'Valor'], buildReportRows(
      kpisQuery.data,
      chartsQuery.data,
      criticalQuery.data,
    ));
  }, [kpisQuery.data, chartsQuery.data, criticalQuery.data]);

  const canExport =
    Boolean(kpisQuery.data && chartsQuery.data && criticalQuery.data) &&
    !kpisQuery.isError &&
    !chartsQuery.isError;

  if (isInitialLoading) {
    return <ReportsSkeleton />;
  }

  const hasSummaryError = kpisQuery.isError;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Reportes"
        description="Resumen ejecutivo, indicadores y exportación de datos operativos."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button size="sm" className="gap-2" onClick={handleExportCsv} disabled={!canExport}>
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </PageHeader>

      {hasSummaryError ? (
        <DashboardError onRetry={() => kpisQuery.refetch()} />
      ) : kpisQuery.data ? (
        <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base">Resumen ejecutivo</CardTitle>
            <CardDescription>
              Indicadores clave generados el {formatReportDate()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Target className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Nivel de conciliación</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums">
                    {formatPercent(kpisQuery.data.nivelConciliacion)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatNumber(kpisQuery.data.greConciliadas)} de{' '}
                    {formatNumber(kpisQuery.data.totalGre)} GRE conciliadas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-border/40 bg-muted/20 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <ShieldAlert className="h-5 w-5 text-amber-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Riesgo tributario</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-2xl font-bold tabular-nums">
                      {formatPercent(kpisQuery.data.riesgoTributario.porcentaje)}
                    </p>
                    <Badge variant="outline" className={riesgoNivelColor(kpisQuery.data.riesgoTributario.nivel)}>
                      {kpisQuery.data.riesgoTributario.nivel}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Basado en GRE con diferencias pendientes de resolución
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <KpiGrid
        kpis={kpisQuery.data}
        charts={chartsQuery.data}
        isLoading={kpisQuery.isLoading}
        isError={kpisQuery.isError}
        onRetry={() => kpisQuery.refetch()}
      />

      <ChartsSection
        charts={chartsQuery.data}
        isLoading={chartsQuery.isLoading}
        isError={chartsQuery.isError}
        onRetry={() => chartsQuery.refetch()}
      />

      <CriticalProductsTable
        products={criticalQuery.data}
        isLoading={criticalQuery.isLoading}
        isError={criticalQuery.isError}
        onRetry={() => criticalQuery.refetch()}
      />
    </motion.div>
  );
}
