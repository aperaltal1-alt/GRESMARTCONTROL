'use client';

import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KARDEX_MOVEMENT_TYPES } from '@/lib/kardex/schemas';
import { kardexTipoLabel } from '@/lib/kardex/utils';
import { cn } from '@/lib/utils';
import type { KardexTipoFilter } from '@/types/kardex';
import type { Product } from '@/types/products';

interface KardexToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  producto: string;
  onProductoChange: (value: string) => void;
  tipo: KardexTipoFilter;
  onTipoChange: (value: KardexTipoFilter) => void;
  fechaDesde: string;
  onFechaDesdeChange: (value: string) => void;
  fechaHasta: string;
  onFechaHastaChange: (value: string) => void;
  products: Product[];
  canCreate: boolean;
  onCreateClick: () => void;
  className?: string;
}

const selectClass =
  'flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function KardexToolbar({
  search,
  onSearchChange,
  producto,
  onProductoChange,
  tipo,
  onTipoChange,
  fechaDesde,
  onFechaDesdeChange,
  fechaHasta,
  onFechaHastaChange,
  products,
  canCreate,
  onCreateClick,
  className,
}: KardexToolbarProps) {
  const hasFilters = search || producto || tipo !== 'all' || fechaDesde || fechaHasta;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar movimientos Kardex"
            placeholder="Buscar por código o nombre de producto..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {canCreate ? (
          <Button onClick={onCreateClick} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Registrar movimiento
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={producto}
          onChange={(e) => onProductoChange(e.target.value)}
          className={cn(selectClass, 'min-w-[180px]')}
          aria-label="Filtrar por producto"
        >
          <option value="">Todos los productos</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.codigo} — {p.nombre}</option>
          ))}
        </select>

        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value as KardexTipoFilter)}
          className={selectClass}
          aria-label="Filtrar por tipo"
        >
          <option value="all">Todos los tipos</option>
          {KARDEX_MOVEMENT_TYPES.map((t) => (
            <option key={t} value={t}>{kardexTipoLabel(t)}</option>
          ))}
        </select>

        <Input type="date" value={fechaDesde} onChange={(e) => onFechaDesdeChange(e.target.value)} className="h-9 w-40" aria-label="Fecha desde" />
        <Input type="date" value={fechaHasta} onChange={(e) => onFechaHastaChange(e.target.value)} className="h-9 w-40" aria-label="Fecha hasta" />

        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={() => {
            onSearchChange(''); onProductoChange(''); onTipoChange('all');
            onFechaDesdeChange(''); onFechaHastaChange('');
          }} className="gap-1 text-muted-foreground">
            <X className="h-3.5 w-3.5" /> Limpiar filtros
          </Button>
        ) : null}
      </div>
    </div>
  );
}
