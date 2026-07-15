'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { useDebounce } from '@/hooks/use-debounce';
import { useIncidentsList, useResolveIncident } from '@/hooks/incidents';
import { canManageIncidents } from '@/lib/incidents/utils';
import type {
  Incident,
  IncidentEstadoFilter,
  IncidentPrioridadFilter,
} from '@/types/incidents';
import { IncidentDetailDialog } from './incident-detail-dialog';
import { IncidentsEmpty } from './incidents-empty';
import { IncidentsPagination } from './incidents-pagination';
import { IncidentsTable } from './incidents-table';
import { IncidentsTableSkeleton } from './incidents-skeleton';
import { IncidentsToolbar } from './incidents-toolbar';
import { ResolveIncidentDialog } from './resolve-incident-dialog';

const PAGE_SIZE = 10;

export function IncidentsPageContent() {
  const { user } = useAuth();
  const canManage = canManageIncidents(user?.rol);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState<IncidentEstadoFilter>('all');
  const [prioridad, setPrioridad] = useState<IncidentPrioridadFilter>('all');
  const [detailIncident, setDetailIncident] = useState<Incident | null>(null);
  const [resolveIncident, setResolveIncident] = useState<Incident | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      estado: estado === 'all' ? undefined : estado,
    }),
    [page, estado],
  );

  const incidentsQuery = useIncidentsList(listParams);
  const resolveMutation = useResolveIncident();

  const filteredItems = useMemo(() => {
    let items = incidentsQuery.data?.items ?? [];

    if (prioridad !== 'all') {
      items = items.filter((i) => i.prioridad === prioridad);
    }

    if (!debouncedSearch) return items;
    const q = debouncedSearch.toLowerCase();
    return items.filter(
      (i) =>
        i.codigoProducto.toLowerCase().includes(q) ||
        i.nombreProducto.toLowerCase().includes(q) ||
        i.greNumero.toLowerCase().includes(q) ||
        i.greSerie.toLowerCase().includes(q) ||
        `${i.greSerie}-${i.greNumero}`.toLowerCase().includes(q),
    );
  }, [incidentsQuery.data?.items, debouncedSearch, prioridad]);

  const hasFilters = debouncedSearch || estado !== 'all' || prioridad !== 'all';
  const meta = incidentsQuery.data?.meta;

  const handleResolveConfirm = async () => {
    if (!resolveIncident) return;
    await resolveMutation.mutateAsync(resolveIncident.id);
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <PageHeader
          title="Incidencias"
          description="Diferencias detectadas entre GRE, kardex e inventario físico."
        />

        <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-border/40 p-4">
            <IncidentsToolbar
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              estado={estado}
              onEstadoChange={(v) => {
                setEstado(v);
                setPage(1);
              }}
              prioridad={prioridad}
              onPrioridadChange={(v) => {
                setPrioridad(v);
                setPage(1);
              }}
            />
          </div>

          {incidentsQuery.isLoading ? (
            <IncidentsTableSkeleton />
          ) : incidentsQuery.isError ? (
            <div className="p-6">
              <DashboardError onRetry={() => incidentsQuery.refetch()} />
            </div>
          ) : filteredItems.length === 0 ? (
            <IncidentsEmpty
              title={
                hasFilters
                  ? 'Sin resultados para los filtros aplicados'
                  : 'No hay incidencias registradas'
              }
              description={
                hasFilters
                  ? 'Prueba ajustando los filtros de búsqueda.'
                  : 'No se detectaron diferencias en la conciliación.'
              }
            />
          ) : (
            <IncidentsTable
              data={filteredItems}
              canManage={canManage}
              onViewDetail={setDetailIncident}
              onResolve={setResolveIncident}
            />
          )}

          {meta && !incidentsQuery.isLoading && !incidentsQuery.isError ? (
            <div className="border-t border-border/40">
              <IncidentsPagination
                page={meta.page}
                totalPages={meta.totalPages}
                total={meta.total}
                limit={meta.limit}
                onPageChange={setPage}
              />
            </div>
          ) : null}
        </div>

        <IncidentDetailDialog
          open={!!detailIncident}
          onOpenChange={(open) => {
            if (!open) setDetailIncident(null);
          }}
          incident={detailIncident}
        />

        {canManage ? (
          <ResolveIncidentDialog
            incident={resolveIncident}
            open={!!resolveIncident}
            onOpenChange={(open) => {
              if (!open) setResolveIncident(null);
            }}
            onConfirm={handleResolveConfirm}
            isPending={resolveMutation.isPending}
          />
        ) : null}
      </motion.div>
  );
}
