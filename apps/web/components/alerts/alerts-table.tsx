'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Check, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatShortDate } from '@/lib/dashboard/utils';
import type { Alert } from '@/types/alerts';
import { AlertNivelBadge } from './alert-nivel-badge';
import { AlertTipoBadge } from './alert-tipo-badge';

interface AlertsTableProps {
  data: Alert[];
  onMarkRead: (alert: Alert) => void;
  markingReadId: string | null;
}

function formatReferencia(alert: Alert): string {
  if (alert.greNumero) return `GRE ${alert.greNumero}`;
  if (alert.codigoProducto) return alert.codigoProducto;
  return '—';
}

export function AlertsTable({ data, onMarkRead, markingReadId }: AlertsTableProps) {
  const columns = useMemo<ColumnDef<Alert>[]>(
    () => [
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => <AlertTipoBadge tipo={row.original.tipo} />,
      },
      {
        accessorKey: 'nivel',
        header: 'Nivel',
        cell: ({ row }) => <AlertNivelBadge nivel={row.original.nivel} />,
      },
      {
        accessorKey: 'mensaje',
        header: 'Mensaje',
        cell: ({ row }) => {
          const msg = row.original.mensaje;
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[280px] truncate text-sm">{msg}</span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{msg}</p>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
      {
        id: 'referencia',
        header: 'Producto / GRE',
        cell: ({ row }) => (
          <span className="font-mono text-sm">{formatReferencia(row.original)}</span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-sm">{formatShortDate(row.original.createdAt)}</span>
        ),
      },
      {
        id: 'leida',
        header: 'Estado leída',
        cell: ({ row }) =>
          row.original.leida ? (
            <Badge variant="secondary" className="font-medium">
              Leída
            </Badge>
          ) : (
            <Badge variant="default" className="font-medium">
              No leída
            </Badge>
          ),
      },
      {
        id: 'acciones',
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            {!row.original.leida ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onMarkRead(row.original)}
                    disabled={markingReadId === row.original.id}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Marcar como leída
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        ),
      },
    ],
    [onMarkRead, markingReadId],
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Listado de alertas">
        <caption className="sr-only">Listado de alertas</caption>
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
              className="border-b border-border/20 transition-colors last:border-0 hover:bg-muted/30"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3.5">
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
