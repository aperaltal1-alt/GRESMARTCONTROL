'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Route, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { useDebounce } from '@/hooks/use-debounce';
import { useGreList } from '@/hooks/gre';
import { useIncidentsList } from '@/hooks/incidents';
import { useKardexList } from '@/hooks/kardex';
import { useProductsList } from '@/hooks/products';
import { useReconciliationList } from '@/hooks/reconciliation';
import { buildGreTimeline, buildProductTimeline } from '@/lib/traceability/utils';
import type { TraceabilitySearchMode } from '@/types/traceability';
import { TraceabilityEmpty } from './traceability-empty';
import { TraceabilityGreContext } from './traceability-gre-context';
import { TraceabilityProductContext } from './traceability-product-context';
import { TraceabilitySkeleton } from './traceability-skeleton';
import { TraceabilityTimeline } from './traceability-timeline';

export function TraceabilityPageContent() {
  const [mode, setMode] = useState<TraceabilitySearchMode>('product');
  const [search, setSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedGreId, setSelectedGreId] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const productsQuery = useProductsList(
    {
      page: 1,
      limit: 20,
      search: debouncedSearch || undefined,
      activo: true,
    },
    mode === 'product',
  );

  const greQuery = useGreList(
    {
      page: 1,
      limit: 20,
      numero: debouncedSearch || undefined,
    },
    mode === 'gre',
  );

  const kardexQuery = useKardexList(
    { page: 1, limit: 50, producto: selectedProductId || undefined },
    Boolean(selectedProductId),
  );

  const reconciliationQuery = useReconciliationList(
    { page: 1, limit: 20, greId: selectedGreId || undefined },
    Boolean(selectedGreId),
  );

  const incidentsQuery = useIncidentsList(
    { page: 1, limit: 20, greId: selectedGreId || undefined },
    Boolean(selectedGreId),
  );

  const selectedProduct = useMemo(
    () => productsQuery.data?.items.find((p) => p.id === selectedProductId),
    [productsQuery.data, selectedProductId],
  );

  const selectedGre = useMemo(
    () => greQuery.data?.items.find((g) => g.id === selectedGreId),
    [greQuery.data, selectedGreId],
  );

  const productEvents = useMemo(
    () => (kardexQuery.data?.items ? buildProductTimeline(kardexQuery.data.items) : []),
    [kardexQuery.data],
  );

  const greEvents = useMemo(() => {
    if (!selectedGre || !reconciliationQuery.data || !incidentsQuery.data) return [];
    return buildGreTimeline(
      selectedGre,
      reconciliationQuery.data.items,
      incidentsQuery.data.items,
    );
  }, [selectedGre, reconciliationQuery.data, incidentsQuery.data]);

  const isLoading =
    mode === 'product'
      ? selectedProductId && kardexQuery.isLoading
      : selectedGreId && (reconciliationQuery.isLoading || incidentsQuery.isLoading);

  const isError =
    mode === 'product'
      ? kardexQuery.isError
      : reconciliationQuery.isError || incidentsQuery.isError;

  const handleSearch = () => {
    const q = debouncedSearch.trim().toLowerCase();
    if (!q) return;

    if (mode === 'product') {
      const items = productsQuery.data?.items ?? [];
      const exact = items.find(
        (p) =>
          p.codigo.toLowerCase() === q ||
          p.nombre.toLowerCase() === q ||
          `${p.codigo} ${p.nombre}`.toLowerCase().includes(q),
      );
      const match = exact ?? items[0];
      if (match) setSelectedProductId(match.id);
    } else {
      const items = greQuery.data?.items ?? [];
      const exact = items.find(
        (g) =>
          g.numero.toLowerCase() === q ||
          `${g.serie}-${g.numero}`.toLowerCase() === q,
      );
      const match = exact ?? items[0];
      if (match) setSelectedGreId(match.id);
    }
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <PageHeader
          title="Trazabilidad"
          description="Rastrea el historial de productos y GRE usando datos reales de Kardex, conciliación e incidencias."
        />

        <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              variant={mode === 'product' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMode('product');
                setSelectedGreId('');
                setSelectedProductId('');
              }}
              className="gap-1.5"
            >
              <Package className="h-4 w-4" />
              Por producto
            </Button>
            <Button
              variant={mode === 'gre' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setMode('gre');
                setSelectedProductId('');
                setSelectedGreId('');
              }}
              className="gap-1.5"
            >
              <Route className="h-4 w-4" />
              Por GRE
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label={mode === 'product' ? 'Buscar producto' : 'Buscar GRE'}
                placeholder={
                  mode === 'product'
                    ? 'Buscar producto por código o nombre...'
                    : 'Buscar GRE por número...'
                }
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedProductId('');
                  setSelectedGreId('');
                }}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch} disabled={!debouncedSearch}>
              Buscar
            </Button>
          </div>

          {mode === 'product' && productsQuery.data?.items.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {productsQuery.data.items.map((p) => (
                <Button
                  key={p.id}
                  variant={selectedProductId === p.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedProductId(p.id)}
                >
                  {p.codigo}
                </Button>
              ))}
            </div>
          ) : null}

          {mode === 'gre' && greQuery.data?.items.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {greQuery.data.items.map((g) => (
                <Button
                  key={g.id}
                  variant={selectedGreId === g.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedGreId(g.id)}
                >
                  {g.serie}-{g.numero}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        {selectedProduct ? <TraceabilityProductContext product={selectedProduct} /> : null}
        {selectedGre ? <TraceabilityGreContext gre={selectedGre} /> : null}

        {isLoading ? (
          <TraceabilitySkeleton />
        ) : isError ? (
          <DashboardError
            onRetry={() => {
              if (mode === 'product') kardexQuery.refetch();
              else {
                reconciliationQuery.refetch();
                incidentsQuery.refetch();
              }
            }}
          />
        ) : selectedProductId || selectedGreId ? (
          <TraceabilityTimeline events={mode === 'product' ? productEvents : greEvents} />
        ) : (
          <TraceabilityEmpty mode={mode} />
        )}
      </motion.div>
  );
}
