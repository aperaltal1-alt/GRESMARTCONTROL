'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  calcConciliationPercent,
  formatDateTime,
  formatGreRef,
} from '@/lib/reconciliation/utils';
import type { ReconciliationSummary } from '@/types/reconciliation';
import { ReconciliationEstadoBadge } from './reconciliation-estado-badge';

interface ReconciliationTableProps {
  data: ReconciliationSummary[];
  onView: (item: ReconciliationSummary) => void;
}

export function ReconciliationTable({ data, onView }: ReconciliationTableProps) {
  const columns = useMemo<ColumnDef<ReconciliationSummary>[]>(
    () => [
      {
        id: 'gre',
        header: 'GRE',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onView(row.original)}
            className="font-mono text-sm font-semibold text-brand hover:underline"
          >
            {formatGreRef(row.original.greSerie, row.original.greNumero)}
          </button>
        ),
      },
      {
        id: 'estado',
        header: 'Estado',
        cell: ({ row }) => <ReconciliationEstadoBadge estado={row.original.estado} />,
      },
      {
        id: 'porcentaje',
        header: () => <span className="block text-right">% Conciliado</span>,
        cell: ({ row }) => {
          const percent = calcConciliationPercent(
            row.original.lineasOk,
            row.original.totalLineas,
          );
          return (
            <span className="block text-right font-medium tabular-nums">
              {percent}%
            </span>
          );
        },
      },
      {
        id: 'lineas',
        header: () => <span className="block text-center">Líneas OK/Dif</span>,
        cell: ({ row }) => (
          <span className="block text-center tabular-nums">
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              {row.original.lineasOk}
            </span>
            <span className="text-muted-foreground"> / </span>
            <span className="font-medium text-destructive">
              {row.original.lineasConDiferencia}
            </span>
          </span>
        ),
      },
      {
        accessorKey: 'ejecutadoPor',
        header: 'Ejecutado por',
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate text-sm">{row.original.ejecutadoPor}</span>
        ),
      },
      {
        accessorKey: 'iniciadoAt',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-sm">{formatDateTime(row.original.iniciadoAt)}</span>
        ),
      },
      {
        id: 'acciones',
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => onView(row.original)}
            >
              <Eye className="h-4 w-4" />
              Ver detalle
            </Button>
          </div>
        ),
      },
    ],
    [onView],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Listado de conciliaciones">
        <caption className="sr-only">Listado de conciliaciones</caption>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-border/40">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
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
