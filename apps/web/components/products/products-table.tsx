'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatStock } from '@/lib/products/utils';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/products';
import { ProductStockBadge } from './product-stock-badge';

interface ProductsTableProps {
  data: Product[];
  canManage: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductsTable({ data, canManage, onEdit, onDelete }: ProductsTableProps) {
  const columns = useMemo<ColumnDef<Product>[]>(
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
        header: 'Nombre',
        cell: ({ row }) => (
          <div className="max-w-[220px]">
            <p className="truncate font-medium">{row.original.nombre}</p>
            {!row.original.activo ? (
              <Badge variant="secondary" className="mt-1 text-[10px]">
                Inactivo
              </Badge>
            ) : null}
          </div>
        ),
      },
      {
        accessorKey: 'categoria',
        header: 'Categoría',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">{row.original.categoria}</span>
        ),
      },
      {
        accessorKey: 'unidad',
        header: 'Unidad',
        cell: ({ row }) => (
          <Badge variant="outline" className="font-mono text-xs">
            {row.original.unidad}
          </Badge>
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
        cell: ({ row }) => (
          <ProductStockBadge
            stockActual={row.original.stockActual}
            stockMinimo={row.original.stockMinimo}
          />
        ),
      },
      {
        id: 'acciones',
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) =>
          canManage ? (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(row.original)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  {row.original.activo ? (
                    <DropdownMenuItem
                      onClick={() => onDelete(row.original)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Desactivar
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <span className="block text-right text-xs text-muted-foreground">Solo lectura</span>
          ),
      },
    ],
    [canManage, onEdit, onDelete],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: -1,
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" aria-label="Listado de productos">
        <caption className="sr-only">Listado de productos</caption>
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
              className={cn(
                'border-b border-border/20 transition-colors last:border-0 hover:bg-muted/30',
                !row.original.activo && 'opacity-60',
              )}
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
