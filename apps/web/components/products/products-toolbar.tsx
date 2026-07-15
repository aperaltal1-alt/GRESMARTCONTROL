'use client';

import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ProductActivoFilter, ProductEstadoFilter } from '@/types/products';

interface ProductsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoria: string;
  onCategoriaChange: (value: string) => void;
  estadoStock: ProductEstadoFilter;
  onEstadoStockChange: (value: ProductEstadoFilter) => void;
  activo: ProductActivoFilter;
  onActivoChange: (value: ProductActivoFilter) => void;
  categories: string[];
  canCreate: boolean;
  onCreateClick: () => void;
  className?: string;
}

const selectClass =
  'flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function ProductsToolbar({
  search,
  onSearchChange,
  categoria,
  onCategoriaChange,
  estadoStock,
  onEstadoStockChange,
  activo,
  onActivoChange,
  categories,
  canCreate,
  onCreateClick,
  className,
}: ProductsToolbarProps) {
  const hasFilters = search || categoria || estadoStock !== 'all' || activo !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onCategoriaChange('');
    onEstadoStockChange('all');
    onActivoChange('all');
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar productos"
            placeholder="Buscar por código o nombre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {canCreate ? (
          <Button onClick={onCreateClick} className="gap-2 shrink-0">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={categoria}
          onChange={(e) => onCategoriaChange(e.target.value)}
          className={selectClass}
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={estadoStock}
          onChange={(e) => onEstadoStockChange(e.target.value as ProductEstadoFilter)}
          className={selectClass}
          aria-label="Filtrar por estado de stock"
        >
          <option value="all">Todos los estados</option>
          <option value="NORMAL">Normal</option>
          <option value="BAJO STOCK">Bajo stock</option>
          <option value="SIN STOCK">Sin stock</option>
        </select>

        <select
          value={activo}
          onChange={(e) => onActivoChange(e.target.value as ProductActivoFilter)}
          className={selectClass}
          aria-label="Filtrar por activo/inactivo"
        >
          <option value="all">Activos e inactivos</option>
          <option value="active">Solo activos</option>
          <option value="inactive">Solo inactivos</option>
        </select>

        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
            Limpiar filtros
          </Button>
        ) : null}
      </div>
    </div>
  );
}
