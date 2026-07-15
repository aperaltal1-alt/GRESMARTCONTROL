'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatShortDate, formatStock } from '@/lib/kardex/utils';
import type { KardexMovement } from '@/types/kardex';
import { KardexTipoBadge } from './kardex-tipo-badge';

interface KardexTableProps {
  data: KardexMovement[];
}

export function KardexTable({ data }: KardexTableProps) {
  const columns = useMemo<ColumnDef<KardexMovement>[]>(
    () => [
      {
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-sm">{formatShortDate(row.original.fecha)}</span>
        ),
      },
      {
        id: 'producto',
        header: 'Producto',
        cell: ({ row }) => (
          <div className="max-w-[200px]">
            <p className="truncate font-medium">{row.original.nombreProducto}</p>
            <p className="font-mono text-xs text-muted-foreground">{row.original.codigoProducto}</p>
          </div>
        ),
      },
      {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => <KardexTipoBadge tipo={row.original.tipo} />,
      },
      {
        accessorKey: 'cantidad',
        header: () => <span className="block text-right">Cantidad</span>,
        cell: ({ row }) => (
          <span className="block text-right font-semibold tabular-nums">
            {row.original.tipo === 'SALIDA' ? '−' : row.original.tipo === 'ENTRADA' ? '+' : ''}
            {formatStock(row.original.cantidad)}
          </span>
        ),
      },
      {
        accessorKey: 'saldoNuevo',
        header: () => <span className="block text-right">Stock resultante</span>,
        cell: ({ row }) => (
          <span className="block text-right font-medium tabular-nums text-brand">
            {formatStock(row.original.saldoNuevo)}
          </span>
        ),
      },
      {
        accessorKey: 'observacion',
        header: 'Observación',
        cell: ({ row }) => {
          const obs = row.original.observacion;
          if (!obs) return <span className="text-muted-foreground">—</span>;
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="block max-w-[160px] truncate text-sm text-muted-foreground">{obs}</span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{obs}</p>
              </TooltipContent>
            </Tooltip>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Listado de movimientos Kardex">
        <caption className="sr-only">Listado de movimientos Kardex</caption>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border/40">
              {hg.headers.map((h) => (
                <th key={h.id} scope="col" className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
