'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { InventoryEstadoFilter } from '@/types/inventory';

interface InventoryToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoria: string;
  onCategoriaChange: (value: string) => void;
  estado: InventoryEstadoFilter;
  onEstadoChange: (value: InventoryEstadoFilter) => void;
  categories: string[];
  className?: string;
}

const selectClass =
  'flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function InventoryToolbar({
  search,
  onSearchChange,
  categoria,
  onCategoriaChange,
  estado,
  onEstadoChange,
  categories,
  className,
}: InventoryToolbarProps) {
  const hasFilters = search || categoria || estado !== 'all';

  return (
    <div className={cn('flex flex-col gap-3 lg:flex-row lg:items-center', className)}>
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Buscar en inventario"
          placeholder="Buscar por código o nombre..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
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
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value as InventoryEstadoFilter)}
          className={selectClass}
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos los estados</option>
          <option value="NORMAL">Normal</option>
          <option value="BAJO">Bajo stock</option>
          <option value="SIN STOCK">Sin stock</option>
        </select>

        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={() => {
            onSearchChange(''); onCategoriaChange(''); onEstadoChange('all');
          }} className="gap-1 text-muted-foreground">
            <X className="h-3.5 w-3.5" /> Limpiar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
