'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatNumber } from '@/lib/dashboard/utils';
import { formatGreNumber, formatShortDate } from '@/lib/gre/utils';
import { incidentTipoLabel } from '@/lib/incidents/utils';
import type { Incident } from '@/types/incidents';
import { IncidentEstadoBadge } from './incident-estado-badge';
import { IncidentPrioridadBadge } from './incident-prioridad-badge';

interface IncidentsTableProps {
  data: Incident[];
  canManage: boolean;
  onViewDetail: (incident: Incident) => void;
  onResolve: (incident: Incident) => void;
}

export function IncidentsTable({
  data,
  canManage,
  onViewDetail,
  onResolve,
}: IncidentsTableProps) {
  const columns = useMemo<ColumnDef<Incident>[]>(
    () => [
      {
        id: 'gre',
        header: 'GRE',
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">
            {formatGreNumber(row.original.greSerie, row.original.greNumero)}
          </span>
        ),
      },
      {
        id: 'producto',
        header: 'Producto',
        cell: ({ row }) => (
          <div className="max-w-[200px]">
            <p className="truncate font-medium">{row.original.nombreProducto}</p>
            <p className="font-mono text-xs text-muted-foreground">
              {row.original.codigoProducto}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => (
          <span className="text-sm">{incidentTipoLabel(row.original.tipo)}</span>
        ),
      },
      {
        accessorKey: 'diferencia',
        header: () => <span className="block text-right">Diferencia</span>,
        cell: ({ row }) => (
          <span className="block text-right font-semibold tabular-nums text-destructive">
            {formatNumber(row.original.diferencia)}
          </span>
        ),
      },
      {
        accessorKey: 'prioridad',
        header: 'Prioridad',
        cell: ({ row }) => <IncidentPrioridadBadge prioridad={row.original.prioridad} />,
      },
      {
        accessorKey: 'estado',
        header: 'Estado',
        cell: ({ row }) => <IncidentEstadoBadge estado={row.original.estado} />,
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-sm">{formatShortDate(row.original.createdAt)}</span>
        ),
      },
      {
        id: 'acciones',
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) => {
          const canResolve =
            canManage &&
            row.original.estado !== 'RESUELTA' &&
            row.original.estado !== 'DESCARTADA';

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetail(row.original)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalle
                  </DropdownMenuItem>
                  {canResolve ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onResolve(row.original)}>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Resolver
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [canManage, onViewDetail, onResolve],
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Listado de incidencias">
        <caption className="sr-only">Listado de incidencias</caption>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border/40">
              {hg.headers.map((h) => (
                <th
                  key={h.id}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, i) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="cursor-pointer border-b border-border/20 transition-colors last:border-0 hover:bg-muted/30"
              onClick={() => onViewDetail(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3.5"
                  onClick={
                    cell.column.id === 'acciones'
                      ? (e) => e.stopPropagation()
                      : undefined
                  }
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
