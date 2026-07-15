'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { formatStock } from '@/lib/inventory/utils';
import type { InventoryItem } from '@/types/inventory';
import { InventoryEstadoBadge } from './inventory-estado-badge';

export interface InventoryTableRow extends InventoryItem {
  categoria?: string;
}

interface InventoryTableProps {
  data: InventoryTableRow[];
}

export function InventoryTable({ data }: InventoryTableProps) {
  const columns = useMemo<ColumnDef<InventoryTableRow>[]>(
    () => [
      {
        accessorKey: 'codigo',
        header: 'Código',
        cell: ({ row }) => (
          <span className="font-mono text-sm font-medium">{row.original.codigo}</span>
        ),
      },
      {
        accessorKey: 'nombre',
        header: 'Producto',
        cell: ({ row }) => (
          <div className="flex max-w-[200px] items-center gap-2">
            <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate font-medium">{row.original.nombre}</span>
          </div>
        ),
      },
      {
        accessorKey: 'categoria',
        header: 'Categoría',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.categoria ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'stockActual',
        header: () => <span className="block text-right">Stock actual</span>,
        cell: ({ row }) => (
          <span className="block text-right font-semibold tabular-nums">
            {formatStock(row.original.stockActual)}
          </span>
        ),
      },
      {
        accessorKey: 'stockMinimo',
        header: () => <span className="block text-right">Stock mín.</span>,
        cell: ({ row }) => (
          <span className="block text-right tabular-nums text-muted-foreground">
            {formatStock(row.original.stockMinimo)}
          </span>
        ),
      },
      {
        id: 'estado',
        header: 'Estado',
        cell: ({ row }) => <InventoryEstadoBadge estado={row.original.estado} />,
      },
    ],
    [],
  );

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Listado de inventario">
        <caption className="sr-only">Listado de inventario</caption>
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
