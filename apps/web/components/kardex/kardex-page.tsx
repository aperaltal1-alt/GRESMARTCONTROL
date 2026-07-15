'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { useDebounce } from '@/hooks/use-debounce';
import { useCreateKardexMovement, useKardexList } from '@/hooks/kardex';
import { useProductsList } from '@/hooks/products';
import { canManageKardex } from '@/lib/kardex/utils';
import type { KardexMovementFormValues } from '@/lib/kardex/schemas';
import type { KardexMovementType, KardexTipoFilter } from '@/types/kardex';
import { KardexEmpty } from './kardex-empty';
import { KardexMovementModal } from './kardex-movement-modal';
import { KardexPagination } from './kardex-pagination';
import { KardexTable } from './kardex-table';
import { KardexTableSkeleton } from './kardex-skeleton';
import { KardexToolbar } from './kardex-toolbar';

const PAGE_SIZE = 10;

export function KardexPageContent() {
  const { user } = useAuth();
  const canManage = canManageKardex(user?.rol);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [producto, setProducto] = useState('');
  const [tipo, setTipo] = useState<KardexTipoFilter>('all');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      producto: producto || undefined,
      tipo: tipo === 'all' ? undefined : (tipo as KardexMovementType),
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [page, producto, tipo, fechaDesde, fechaHasta],
  );

  const kardexQuery = useKardexList(listParams);
  const productsQuery = useProductsList({ page: 1, limit: 100, activo: true });
  const createMutation = useCreateKardexMovement();

  const filteredItems = useMemo(() => {
    const items = kardexQuery.data?.items ?? [];
    if (!debouncedSearch) return items;
    const q = debouncedSearch.toLowerCase();
    return items.filter(
      (m) =>
        m.codigoProducto.toLowerCase().includes(q) ||
        m.nombreProducto.toLowerCase().includes(q),
    );
  }, [kardexQuery.data?.items, debouncedSearch]);

  const handleFormSubmit = async (values: KardexMovementFormValues) => {
    await createMutation.mutateAsync(values);
  };

  const meta = kardexQuery.data?.meta;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
        <PageHeader title="Kardex" description="Movimientos de entrada, salida y ajustes de inventario." />

        <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <div className="border-b border-border/40 p-4">
            <KardexToolbar
              search={search}
              onSearchChange={(v) => { setSearch(v); setPage(1); }}
              producto={producto}
              onProductoChange={(v) => { setProducto(v); setPage(1); }}
              tipo={tipo}
              onTipoChange={(v) => { setTipo(v); setPage(1); }}
              fechaDesde={fechaDesde}
              onFechaDesdeChange={(v) => { setFechaDesde(v); setPage(1); }}
              fechaHasta={fechaHasta}
              onFechaHastaChange={(v) => { setFechaHasta(v); setPage(1); }}
              products={productsQuery.data?.items ?? []}
              canCreate={canManage}
              onCreateClick={() => setModalOpen(true)}
            />
          </div>

          {kardexQuery.isLoading ? (
            <KardexTableSkeleton />
          ) : kardexQuery.isError ? (
            <div className="p-6"><DashboardError onRetry={() => kardexQuery.refetch()} /></div>
          ) : filteredItems.length === 0 ? (
            <KardexEmpty
              title={debouncedSearch || producto || tipo !== 'all' || fechaDesde || fechaHasta
                ? 'Sin resultados para los filtros aplicados'
                : 'No hay movimientos registrados'}
              description={canManage ? 'Registra tu primer movimiento de kardex.' : 'No se encontraron movimientos.'}
            />
          ) : (
            <KardexTable data={filteredItems} />
          )}

          {meta && !kardexQuery.isLoading && !kardexQuery.isError ? (
            <div className="border-t border-border/40">
              <KardexPagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={setPage} />
            </div>
          ) : null}
        </div>

        {canManage ? (
          <KardexMovementModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            products={productsQuery.data?.items ?? []}
            onSubmit={handleFormSubmit}
            isPending={createMutation.isPending}
          />
        ) : null}
      </motion.div>
  );
}
