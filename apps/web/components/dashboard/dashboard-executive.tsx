'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  useDashboardCharts,
  useDashboardCriticalProducts,
  useDashboardKpis,
} from '@/hooks/dashboard';
import { queryKeys } from '@/lib/query/keys';
import { ChartSkeleton } from './dashboard-skeleton';
import { CriticalProductsTable } from './critical-products-table';
import { KpiGrid } from './kpi-grid';
import { RightPanel } from './right-panel';

const ChartsSection = dynamic(
  () => import('./charts-section').then((mod) => mod.ChartsSection),
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

export function DashboardExecutive() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'gre' | 'incidents' | 'alerts'>('gre');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const kpisQuery = useDashboardKpis();
  const chartsQuery = useDashboardCharts(30);
  const criticalQuery = useDashboardCriticalProducts();

  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
    setIsRefreshing(false);
  }, [queryClient]);

  const handlePanelRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.recentGre(6) });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.recentIncidents(6) });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.recentAlerts(6) });
  }, [queryClient]);

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <PageHeader
          title="Dashboard Ejecutivo"
          description="Vista estratégica con KPIs, gráficos y actividad en tiempo real."
        >
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleRefreshAll}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </PageHeader>

        <KpiGrid
          kpis={kpisQuery.data}
          charts={chartsQuery.data}
          isLoading={kpisQuery.isLoading}
          isError={kpisQuery.isError}
          onRetry={() => kpisQuery.refetch()}
        />

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <ChartsSection
            charts={chartsQuery.data}
            isLoading={chartsQuery.isLoading}
            isError={chartsQuery.isError}
            onRetry={() => chartsQuery.refetch()}
          />
          <RightPanel
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onRefresh={handlePanelRefresh}
            isRefreshing={isRefreshing}
          />
        </div>

        <CriticalProductsTable
          products={criticalQuery.data}
          isLoading={criticalQuery.isLoading}
          isError={criticalQuery.isError}
          onRetry={() => criticalQuery.refetch()}
        />
      </motion.div>
  );
}
