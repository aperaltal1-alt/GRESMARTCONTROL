'use client';

import { GitCompare, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { reconciliationEstadoLabel } from '@/lib/reconciliation/utils';
import { cn } from '@/lib/utils';
import type { ReconciliationEstado, ReconciliationEstadoFilter } from '@/types/reconciliation';

interface ReconciliationToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  estado: ReconciliationEstadoFilter;
  onEstadoChange: (value: ReconciliationEstadoFilter) => void;
  canManage: boolean;
  onRunClick: () => void;
  className?: string;
}

const ESTADOS: ReconciliationEstado[] = [
  'EN_PROCESO',
  'COMPLETADA',
  'CON_DIFERENCIAS',
  'ERROR',
];

const selectClass =
  'flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function ReconciliationToolbar({
  search,
  onSearchChange,
  estado,
  onEstadoChange,
  canManage,
  onRunClick,
  className,
}: ReconciliationToolbarProps) {
  const hasFilters = search || estado !== 'all';

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar conciliaciones"
            placeholder="Buscar por número o serie de GRE..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {canManage ? (
          <Button onClick={onRunClick} className="shrink-0 gap-2">
            <GitCompare className="h-4 w-4" />
            Ejecutar conciliación
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value as ReconciliationEstadoFilter)}
          className={cn(selectClass, 'min-w-[180px]')}
          aria-label="Filtrar por estado"
        >
          <option value="all">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {reconciliationEstadoLabel(e)}
            </option>
          ))}
        </select>

        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onEstadoChange('all');
            }}
            className="gap-1 text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" /> Limpiar filtros
          </Button>
        ) : null}
      </div>
    </div>
  );
}
