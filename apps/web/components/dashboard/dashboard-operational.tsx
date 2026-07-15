'use client';

import Link from 'next/link';
import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  FileText,
  RefreshCw,
  Scale,
  Warehouse,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  useDashboardCharts,
  useDashboardCriticalProducts,
  useDashboardKpis,
  useDashboardRecentAlerts,
  useDashboardRecentGre,
  useDashboardRecentIncidents,
} from '@/hooks/dashboard';
import { formatNumber } from '@/lib/dashboard/utils';
import { queryKeys } from '@/lib/query/keys';
import { CriticalProductsTable } from './critical-products-table';
import { DashboardError } from './dashboard-error';
import { RecentAlertsList } from './recent-alerts-list';
import { RecentGreList } from './recent-gre-list';
import { RecentIncidentsList } from './recent-incidents-list';
import { CriticalProductsSkeleton } from './dashboard-skeleton';

const quickLinks = [
  { href: '/gre', label: 'GRE', icon: FileText, color: 'text-blue-500' },
  { href: '/kardex', label: 'Kardex', icon: ArrowLeftRight, color: 'text-violet-500' },
  { href: '/conciliacion', label: 'Conciliación', icon: Scale, color: 'text-emerald-500' },
  { href: '/incidencias', label: 'Incidencias', icon: AlertTriangle, color: 'text-red-500' },
  { href: '/alertas', label: 'Alertas', icon: Bell, color: 'text-amber-500' },
  { href: '/inventario', label: 'Inventario', icon: Warehouse, color: 'text-cyan-500' },
];

function OperationalKpiCard({
  label,
  value,
  href,
  accent,
}: {
  label: string;
  value: number;
  href: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm transition-all hover:border-border hover:shadow-md"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-2 text-3xl font-bold tabular-nums ${accent}`}>{formatNumber(value)}</p>
      <p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground">Ver detalle →</p>
    </Link>
  );
}

export function DashboardOperational() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const kpisQuery = useDashboardKpis();
  const chartsQuery = useDashboardCharts(7);
  const criticalQuery = useDashboardCriticalProducts();
  const greQuery = useDashboardRecentGre(10);
  const incidentsQuery = useDashboardRecentIncidents(10);
  const alertsQuery = useDashboardRecentAlerts(10);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    setIsRefreshing(false);
  }, [queryClient]);

  const kpis = kpisQuery.data;

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <PageHeader
          title="Dashboard Operativo"
          description="Vista táctica con acciones pendientes, actividad reciente y accesos rápidos."
        >
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </PageHeader>

        {kpisQuery.isError ? (
          <DashboardError onRetry={() => kpisQuery.refetch()} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <OperationalKpiCard
              label="GRE pendientes"
              value={kpis ? kpis.totalGre - kpis.greConciliadas - kpis.greConDiferencias : 0}
              href="/gre"
              accent="text-amber-500"
            />
            <OperationalKpiCard
              label="Incidencias pendientes"
              value={kpis?.incidenciasPendientes ?? 0}
              href="/incidencias"
              accent="text-red-500"
            />
            <OperationalKpiCard
              label="Alertas activas"
              value={kpis?.alertasActivas ?? 0}
              href="/alertas"
              accent="text-orange-500"
            />
            <OperationalKpiCard
              label="Stock bajo"
              value={kpis?.productosStockBajo ?? 0}
              href="/inventario"
              accent="text-cyan-500"
            />
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={link.href}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/80 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-muted/30"
              >
                <link.icon className={`h-5 w-5 ${link.color}`} />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm xl:col-span-1">
            <h3 className="mb-3 text-sm font-semibold">Últimas GRE</h3>
            <RecentGreList
              items={greQuery.data}
              isLoading={greQuery.isLoading}
              isError={greQuery.isError}
              onRetry={() => greQuery.refetch()}
            />
          </div>
          <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm xl:col-span-1">
            <h3 className="mb-3 text-sm font-semibold">Incidencias recientes</h3>
            <RecentIncidentsList
              items={incidentsQuery.data}
              isLoading={incidentsQuery.isLoading}
              isError={incidentsQuery.isError}
              onRetry={() => incidentsQuery.refetch()}
            />
          </div>
          <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm xl:col-span-1">
            <h3 className="mb-3 text-sm font-semibold">Alertas recientes</h3>
            <RecentAlertsList
              items={alertsQuery.data}
              isLoading={alertsQuery.isLoading}
              isError={alertsQuery.isError}
              onRetry={() => alertsQuery.refetch()}
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-border/40 px-4 py-3">
            <h3 className="text-sm font-semibold">Productos críticos</h3>
            <p className="text-xs text-muted-foreground">Requieren atención inmediata en inventario</p>
          </div>
          <div className="p-4">
            {criticalQuery.isLoading ? (
              <CriticalProductsSkeleton />
            ) : criticalQuery.isError ? (
              <DashboardError onRetry={() => criticalQuery.refetch()} />
            ) : (
              <CriticalProductsTable
                products={criticalQuery.data}
                isLoading={false}
                isError={false}
                onRetry={() => criticalQuery.refetch()}
              />
            )}
          </div>
        </div>

        {chartsQuery.data?.diferenciasPorDia?.length ? (
          <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
            <h3 className="text-sm font-semibold">Diferencias últimos 7 días</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Total: {formatNumber(chartsQuery.data.diferenciasPorDia.reduce((s, p) => s + p.total, 0))} eventos
            </p>
          </div>
        ) : null}
      </motion.div>
  );
}
