'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared/page-header';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { useDebounce } from '@/hooks/use-debounce';
import { useInventoryList, useInventorySummary } from '@/hooks/inventory';
import { useProductCategories, useProductsList } from '@/hooks/products';
import type { InventoryState, InventoryEstadoFilter } from '@/types/inventory';
import { InventoryEmpty } from './inventory-empty';
import { InventoryPagination } from './inventory-pagination';
import { InventorySummaryCards } from './inventory-summary-cards';
import { InventoryTable, type InventoryTableRow } from './inventory-table';
import { InventoryTableSkeleton } from './inventory-skeleton';
import { InventoryToolbar } from './inventory-toolbar';

const PAGE_SIZE = 10;

export function InventoryPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estado, setEstado] = useState<InventoryEstadoFilter>('all');

  const debouncedSearch = useDebounce(search, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      estado: estado === 'all' ? undefined : (estado as InventoryState),
    }),
    [page, estado],
  );

  const inventoryQuery = useInventoryList(listParams);
  const summaryQuery = useInventorySummary();
  const productsQuery = useProductsList({ page: 1, limit: 100, activo: true });
  const categoriesQuery = useProductCategories();

  const productCategoryMap = useMemo(() => {
    const map = new Map<string, string>();
    (productsQuery.data?.items ?? []).forEach((p) => map.set(p.id, p.categoria));
    return map;
  }, [productsQuery.data?.items]);

  const filteredItems = useMemo(() => {
    let items: InventoryTableRow[] = (inventoryQuery.data?.items ?? []).map((item) => ({
      ...item,
      categoria: productCategoryMap.get(item.productoId),
    }));

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      items = items.filter(
        (i) => i.codigo.toLowerCase().includes(q) || i.nombre.toLowerCase().includes(q),
      );
    }

    if (categoria) {
      items = items.filter((i) => i.categoria === categoria);
    }

    return items;
  }, [inventoryQuery.data?.items, productCategoryMap, debouncedSearch, categoria]);

  const meta = inventoryQuery.data?.meta;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <PageHeader title="Inventario" description="Stock físico y niveles de inventario en tiempo real." />

      <InventorySummaryCards summary={summaryQuery.data} isLoading={summaryQuery.isLoading} />

      <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <div className="border-b border-border/40 p-4">
          <InventoryToolbar
            search={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            categoria={categoria}
            onCategoriaChange={(v) => { setCategoria(v); setPage(1); }}
            estado={estado}
            onEstadoChange={(v) => { setEstado(v); setPage(1); }}
            categories={categoriesQuery.data ?? []}
          />
        </div>

        {inventoryQuery.isLoading ? (
          <div className="p-4"><InventoryTableSkeleton /></div>
        ) : inventoryQuery.isError ? (
          <div className="p-6"><DashboardError onRetry={() => inventoryQuery.refetch()} /></div>
        ) : filteredItems.length === 0 ? (
          <InventoryEmpty
            title={debouncedSearch || categoria || estado !== 'all'
              ? 'Sin resultados para los filtros aplicados'
              : 'No hay productos en inventario'}
          />
        ) : (
          <InventoryTable data={filteredItems} />
        )}

        {meta && !inventoryQuery.isLoading && !inventoryQuery.isError ? (
          <div className="border-t border-border/40">
            <InventoryPagination page={meta.page} totalPages={meta.totalPages} total={meta.total} limit={meta.limit} onPageChange={setPage} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}
