'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/page-header';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { useDebounce } from '@/hooks/use-debounce';
import { useAlertsList, useMarkAlertRead } from '@/hooks/alerts';
import type {
  Alert,
  AlertActivaFilter,
  AlertLeidaFilter,
  AlertNivelFilter,
  AlertTipoFilter,
} from '@/types/alerts';
import { AlertsEmpty } from './alerts-empty';
import { AlertsPagination } from './alerts-pagination';
import { AlertsTable } from './alerts-table';
import { AlertsTableSkeleton } from './alerts-skeleton';
import { AlertsToolbar } from './alerts-toolbar';

const PAGE_SIZE = 10;

export function AlertsPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [nivel, setNivel] = useState<AlertNivelFilter>('all');
  const [tipo, setTipo] = useState<AlertTipoFilter>('all');
  const [leida, setLeida] = useState<AlertLeidaFilter>('all');
  const [activa, setActiva] = useState<AlertActivaFilter>('all');

  const debouncedSearch = useDebounce(search, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      activa:
        activa === 'all' ? undefined : activa === 'active',
    }),
    [page, activa],
  );

  const alertsQuery = useAlertsList(listParams);
  const markReadMutation = useMarkAlertRead();

  const filteredItems = useMemo(() => {
    let items = alertsQuery.data?.items ?? [];

    if (nivel !== 'all') {
      items = items.filter((a) => a.nivel === nivel);
    }

    if (tipo !== 'all') {
      items = items.filter((a) => a.tipo === tipo);
    }

    if (leida === 'read') {
      items = items.filter((a) => a.leida);
    } else if (leida === 'unread') {
      items = items.filter((a) => !a.leida);
    }

    if (!debouncedSearch) return items;
    const q = debouncedSearch.toLowerCase();
    return items.filter(
      (a) =>
        a.mensaje.toLowerCase().includes(q) ||
        (a.codigoProducto?.toLowerCase().includes(q) ?? false) ||
        (a.greNumero?.toLowerCase().includes(q) ?? false),
    );
  }, [alertsQuery.data?.items, debouncedSearch, nivel, tipo, leida]);

  const hasFilters =
    debouncedSearch || nivel !== 'all' || tipo !== 'all' || leida !== 'all' || activa !== 'all';
  const meta = alertsQuery.data?.meta;

  const handleMarkRead = async (alert: Alert) => {
    await markReadMutation.mutateAsync(alert.id);
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <PageHeader
          title="Alertas"
          description="Notificaciones del sistema de control de inventario y conciliación."
        />

        <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-border/40 p-4">
            <AlertsToolbar
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              nivel={nivel}
              onNivelChange={(v) => {
                setNivel(v);
                setPage(1);
              }}
              tipo={tipo}
              onTipoChange={(v) => {
                setTipo(v);
                setPage(1);
              }}
              leida={leida}
              onLeidaChange={(v) => {
                setLeida(v);
                setPage(1);
              }}
              activa={activa}
              onActivaChange={(v) => {
                setActiva(v);
                setPage(1);
              }}
            />
          </div>

          {alertsQuery.isLoading ? (
            <AlertsTableSkeleton />
          ) : alertsQuery.isError ? (
            <div className="p-6">
              <DashboardError onRetry={() => alertsQuery.refetch()} />
            </div>
          ) : filteredItems.length === 0 ? (
            <AlertsEmpty
              title={
                hasFilters
                  ? 'Sin resultados para los filtros aplicados'
                  : 'No hay alertas registradas'
              }
              description={
                hasFilters
                  ? 'Prueba ajustando los filtros de búsqueda.'
                  : 'El sistema no tiene alertas pendientes en este momento.'
              }
            />
          ) : (
            <AlertsTable
              data={filteredItems}
              onMarkRead={handleMarkRead}
              markingReadId={markReadMutation.isPending ? (markReadMutation.variables ?? null) : null}
            />
          )}

          {meta && !alertsQuery.isLoading && !alertsQuery.isError ? (
            <div className="border-t border-border/40">
              <AlertsPagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </div>
      </motion.div>
  );
}
