'use client';

import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GRE_ESTADOS } from '@/lib/gre/schemas';
import { greEstadoLabel } from '@/lib/gre/utils';
import { cn } from '@/lib/utils';
import type { GreEstadoFilter } from '@/types/gre';

interface GreToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  serie: string;
  onSerieChange: (value: string) => void;
  estado: GreEstadoFilter;
  onEstadoChange: (value: GreEstadoFilter) => void;
  fechaDesde: string;
  onFechaDesdeChange: (value: string) => void;
  fechaHasta: string;
  onFechaHastaChange: (value: string) => void;
  canCreate: boolean;
  onCreateClick: () => void;
  className?: string;
}

const selectClass =
  'flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function GreToolbar({
  search,
  onSearchChange,
  serie,
  onSerieChange,
  estado,
  onEstadoChange,
  fechaDesde,
  onFechaDesdeChange,
  fechaHasta,
  onFechaHastaChange,
  canCreate,
  onCreateClick,
  className,
}: GreToolbarProps) {
  const hasFilters = search || serie || estado !== 'all' || fechaDesde || fechaHasta;

  const clearFilters = () => {
    onSearchChange('');
    onSerieChange('');
    onEstadoChange('all');
    onFechaDesdeChange('');
    onFechaHastaChange('');
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar GRE por número"
            placeholder="Buscar por número..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {canCreate ? (
          <Button onClick={onCreateClick} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Nueva GRE
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="Serie (ej. T001)"
          value={serie}
          onChange={(e) => onSerieChange(e.target.value)}
          className="h-9 w-36"
        />

        <select
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value as GreEstadoFilter)}
          className={selectClass}
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos los estados</option>
          {GRE_ESTADOS.map((e) => (
            <option key={e} value={e}>
              {greEstadoLabel(e)}
            </option>
          ))}
        </select>

        <Input
          type="date"
          value={fechaDesde}
          onChange={(e) => onFechaDesdeChange(e.target.value)}
          className="h-9 w-40"
          aria-label="Fecha desde"
        />
        <Input
          type="date"
          value={fechaHasta}
          onChange={(e) => onFechaHastaChange(e.target.value)}
          className="h-9 w-40"
          aria-label="Fecha hasta"
        />

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
