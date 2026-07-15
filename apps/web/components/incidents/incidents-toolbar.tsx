'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { IncidentEstadoFilter, IncidentPrioridadFilter } from '@/types/incidents';

interface IncidentsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  estado: IncidentEstadoFilter;
  onEstadoChange: (value: IncidentEstadoFilter) => void;
  prioridad: IncidentPrioridadFilter;
  onPrioridadChange: (value: IncidentPrioridadFilter) => void;
  className?: string;
}

const selectClass =
  'flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const ESTADOS: { value: IncidentEstadoFilter; label: string }[] = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'REVISADA', label: 'Revisada' },
  { value: 'RESUELTA', label: 'Resuelta' },
  { value: 'DESCARTADA', label: 'Descartada' },
];

const PRIORIDADES: { value: IncidentPrioridadFilter; label: string }[] = [
  { value: 'all', label: 'Todas las prioridades' },
  { value: 'CRITICA', label: 'Crítica' },
  { value: 'ALTA', label: 'Alta' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'BAJA', label: 'Baja' },
];

export function IncidentsToolbar({
  search,
  onSearchChange,
  estado,
  onEstadoChange,
  prioridad,
  onPrioridadChange,
  className,
}: IncidentsToolbarProps) {
  const hasFilters = search || estado !== 'all' || prioridad !== 'all';

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Buscar incidencias"
          placeholder="Buscar por GRE, código o producto..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={estado}
          onChange={(e) => onEstadoChange(e.target.value as IncidentEstadoFilter)}
          className={cn(selectClass, 'min-w-[160px]')}
          aria-label="Filtrar por estado"
        >
          {ESTADOS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>

        <select
          value={prioridad}
          onChange={(e) => onPrioridadChange(e.target.value as IncidentPrioridadFilter)}
          className={cn(selectClass, 'min-w-[180px]')}
          aria-label="Filtrar por prioridad"
        >
          {PRIORIDADES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
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
              onPrioridadChange('all');
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
