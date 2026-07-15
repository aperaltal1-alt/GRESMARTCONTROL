'use client';

import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { alertTipoLabel } from '@/lib/alerts/utils';
import { cn } from '@/lib/utils';
import type {
  AlertActivaFilter,
  AlertLeidaFilter,
  AlertNivelFilter,
  AlertTipo,
  AlertTipoFilter,
} from '@/types/alerts';

interface AlertsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  nivel: AlertNivelFilter;
  onNivelChange: (value: AlertNivelFilter) => void;
  tipo: AlertTipoFilter;
  onTipoChange: (value: AlertTipoFilter) => void;
  leida: AlertLeidaFilter;
  onLeidaChange: (value: AlertLeidaFilter) => void;
  activa: AlertActivaFilter;
  onActivaChange: (value: AlertActivaFilter) => void;
  className?: string;
}

const selectClass =
  'flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

const NIVELES: { value: AlertNivelFilter; label: string }[] = [
  { value: 'all', label: 'Todos los niveles' },
  { value: 'CRITICAL', label: 'Crítico' },
  { value: 'ERROR', label: 'Error' },
  { value: 'WARNING', label: 'Advertencia' },
  { value: 'INFO', label: 'Info' },
];

const TIPOS: AlertTipo[] = [
  'STOCK_INSUFICIENTE',
  'STOCK_MINIMO',
  'DIFERENCIA_GRE',
  'DIFERENCIA_KARDEX',
  'DIFERENCIA_FISICO',
  'GRE_PENDIENTE',
  'TRIBUTARIA',
  'SUNAT_RECHAZADO',
  'CONCILIACION_PENDIENTE',
];

const LEIDA_OPTIONS: { value: AlertLeidaFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'unread', label: 'No leídas' },
  { value: 'read', label: 'Leídas' },
];

const ACTIVA_OPTIONS: { value: AlertActivaFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Inactivas' },
];

export function AlertsToolbar({
  search,
  onSearchChange,
  nivel,
  onNivelChange,
  tipo,
  onTipoChange,
  leida,
  onLeidaChange,
  activa,
  onActivaChange,
  className,
}: AlertsToolbarProps) {
  const hasFilters =
    search || nivel !== 'all' || tipo !== 'all' || leida !== 'all' || activa !== 'all';

  return (
    <div className={cn('space-y-4', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          aria-label="Buscar alertas"
          placeholder="Buscar por mensaje, producto o GRE..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={nivel}
          onChange={(e) => onNivelChange(e.target.value as AlertNivelFilter)}
          className={cn(selectClass, 'min-w-[160px]')}
          aria-label="Filtrar por nivel"
        >
          {NIVELES.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>

        <select
          value={tipo}
          onChange={(e) => onTipoChange(e.target.value as AlertTipoFilter)}
          className={cn(selectClass, 'min-w-[180px]')}
          aria-label="Filtrar por tipo"
        >
          <option value="all">Todos los tipos</option>
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {alertTipoLabel(t)}
            </option>
          ))}
        </select>

        <select
          value={leida}
          onChange={(e) => onLeidaChange(e.target.value as AlertLeidaFilter)}
          className={selectClass}
          aria-label="Filtrar por estado de lectura"
        >
          {LEIDA_OPTIONS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        <select
          value={activa}
          onChange={(e) => onActivaChange(e.target.value as AlertActivaFilter)}
          className={selectClass}
          aria-label="Filtrar por estado activo"
        >
          {ACTIVA_OPTIONS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        {hasFilters ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onNivelChange('all');
              onTipoChange('all');
              onLeidaChange('all');
              onActivaChange('all');
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
