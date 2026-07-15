'use client';

import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type UserActivoFilter = 'all' | 'active' | 'inactive';

interface UsersToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  activo: UserActivoFilter;
  onActivoChange: (value: UserActivoFilter) => void;
  canCreate: boolean;
  onCreateClick: () => void;
  className?: string;
}

const selectClass =
  'flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function UsersToolbar({
  search,
  onSearchChange,
  activo,
  onActivoChange,
  canCreate,
  onCreateClick,
  className,
}: UsersToolbarProps) {
  const hasFilters = search || activo !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onActivoChange('all');
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Buscar usuarios"
            placeholder="Buscar por email o nombre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        {canCreate ? (
          <Button onClick={onCreateClick} className="shrink-0 gap-2">
            <Plus className="h-4 w-4" />
            Nuevo usuario
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={activo}
          onChange={(e) => onActivoChange(e.target.value as UserActivoFilter)}
          className={selectClass}
          aria-label="Filtrar por estado activo/inactivo"
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
