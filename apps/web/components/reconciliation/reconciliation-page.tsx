'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { useDebounce } from '@/hooks/use-debounce';
import { useGreList } from '@/hooks/gre';
import {
  useReconciliationDetail,
  useReconciliationList,
  useRunReconciliation,
} from '@/hooks/reconciliation';
import { canManageReconciliation } from '@/lib/reconciliation/utils';
import type {
  ReconciliationEstado,
  ReconciliationEstadoFilter,
  ReconciliationSummary,
} from '@/types/reconciliation';
import { ReconciliationDetailDialog } from './reconciliation-detail-dialog';
import { ReconciliationEmpty } from './reconciliation-empty';
import { ReconciliationPagination } from './reconciliation-pagination';
import { ReconciliationTable } from './reconciliation-table';
import { ReconciliationTableSkeleton } from './reconciliation-skeleton';
import { ReconciliationToolbar } from './reconciliation-toolbar';
import { RunReconciliationDialog } from './run-reconciliation-dialog';

const PAGE_SIZE = 10;

export function ReconciliationPageContent() {
  const { user } = useAuth();
  const canManage = canManageReconciliation(user?.rol);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<ReconciliationEstadoFilter>('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [runOpen, setRunOpen] = useState(false);
  const [selectedGreId, setSelectedGreId] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      estado: estado === 'all' ? undefined : (estado as ReconciliationEstado),
    }),
    [page, estado],
  );

  const listQuery = useReconciliationList(listParams);
  const detailQuery = useReconciliationDetail(detailId);
  const runMutation = useRunReconciliation();
  const greQuery = useGreList({ page: 1, limit: 100 });

  const filteredItems = useMemo(() => {
    const items = listQuery.data?.items ?? [];
    if (!debouncedSearch) return items;
    const q = debouncedSearch.toLowerCase().trim();
    return items.filter(
      (item) =>
        item.greNumero.toLowerCase().includes(q) ||
        item.greSerie.toLowerCase().includes(q) ||
        `${item.greSerie}-${item.greNumero}`.toLowerCase().includes(q),
    );
  }, [listQuery.data?.items, debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleEstadoChange = (value: ReconciliationEstadoFilter) => {
    setEstado(value);
    setPage(1);
  };

  const handleView = (item: ReconciliationSummary) => {
    setDetailId(item.id);
    setDetailOpen(true);
  };

  const handleRunClick = () => {
    setSelectedGreId('');
    setRunOpen(true);
  };

  const handleRunConfirm = async () => {
    if (!selectedGreId) return;
    await runMutation.mutateAsync(selectedGreId);
    setSelectedGreId('');
  };

  const meta = listQuery.data?.meta;
  const hasActiveFilters = debouncedSearch || estado !== 'all';

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <PageHeader
          title="Conciliación"
          description="Conciliación triple GRE / Kardex / Inventario con detección automática de diferencias."
        />

        <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-border/40 p-4">
            <ReconciliationToolbar
              search={search}
              onSearchChange={handleSearchChange}
              estado={estado}
              onEstadoChange={handleEstadoChange}
              canManage={canManage}
              onRunClick={handleRunClick}
            />
          </div>

          {listQuery.isLoading ? (
            <ReconciliationTableSkeleton />
          ) : listQuery.isError ? (
            <div className="p-6">
              <DashboardError onRetry={() => listQuery.refetch()} />
            </div>
          ) : filteredItems.length === 0 ? (
            <ReconciliationEmpty
              title={
                hasActiveFilters
                  ? 'Sin resultados para los filtros aplicados'
                  : 'No hay conciliaciones registradas'
              }
              description={
                canManage
                  ? 'Ejecuta una conciliación sobre una GRE para comenzar.'
                  : 'No se encontraron conciliaciones con los criterios actuales.'
              }
            />
          ) : (
            <ReconciliationTable data={filteredItems} onView={handleView} />
          )}

          {meta && !listQuery.isLoading && !listQuery.isError ? (
            <div className="border-t border-border/40">
              <ReconciliationPagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </div>

        <ReconciliationDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          reconciliation={detailQuery.data}
          isLoading={detailQuery.isLoading}
          isError={detailQuery.isError}
          onRetry={() => detailQuery.refetch()}
        />

        {canManage ? (
          <RunReconciliationDialog
            open={runOpen}
            onOpenChange={setRunOpen}
            greList={greQuery.data?.items ?? []}
            selectedGreId={selectedGreId}
            onSelectedGreIdChange={setSelectedGreId}
            onConfirm={handleRunConfirm}
            isPending={runMutation.isPending}
          />
        ) : null}
      </motion.div>
  );
}
