'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Eye, MoreHorizontal, Pencil, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatGreNumber, formatShortDate } from '@/lib/gre/utils';
import type { GreListItem } from '@/types/gre';
import { GreEstadoBadge } from './gre-estado-badge';

interface GreTableProps {
  data: GreListItem[];
  canManage: boolean;
  onView: (gre: GreListItem) => void;
  onEdit: (gre: GreListItem) => void;
  onDelete: (gre: GreListItem) => void;
  onUpload: (gre: GreListItem) => void;
}

export function GreTable({ data, canManage, onView, onEdit, onDelete, onUpload }: GreTableProps) {
  const columns = useMemo<ColumnDef<GreListItem>[]>(
    () => [
      {
        accessorKey: 'numero',
        header: 'Número',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => onView(row.original)}
            className="font-mono text-sm font-semibold text-brand hover:underline"
          >
            {formatGreNumber(row.original.serie, row.original.numero)}
          </button>
        ),
      },
      {
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => (
          <span className="text-sm">{formatShortDate(row.original.fecha)}</span>
        ),
      },
      {
        accessorKey: 'empresa',
        header: 'Empresa',
        cell: ({ row }) => (
          <div className="max-w-[180px]">
            <p className="truncate text-sm font-medium">{row.original.empresa}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.ruc}</p>
          </div>
        ),
      },
      {
        accessorKey: 'transportista',
        header: 'Transportista',
        cell: ({ row }) => (
          <span className="max-w-[140px] truncate text-sm text-muted-foreground">
            {row.original.transportista ?? '—'}
          </span>
        ),
      },
      {
        accessorKey: 'totalProductos',
        header: () => <span className="block text-center">Productos</span>,
        cell: ({ row }) => (
          <span className="block text-center font-medium tabular-nums">
            {row.original.totalProductos}
          </span>
        ),
      },
      {
        id: 'estado',
        header: 'Estado',
        cell: ({ row }) => <GreEstadoBadge estado={row.original.estado} />,
      },
      {
        id: 'acciones',
        header: () => <span className="sr-only">Acciones</span>,
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Acciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(row.original)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </DropdownMenuItem>
                {canManage ? (
                  <>
                    <DropdownMenuItem onClick={() => onEdit(row.original)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onUpload(row.original)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Subir archivo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(row.original)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Desactivar
                    </DropdownMenuItem>
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
      },
    ],
    [canManage, onView, onEdit, onDelete, onUpload],
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
      <table className="w-full text-sm" aria-label="Listado de guías de remisión">
        <caption className="sr-only">Listado de guías de remisión electrónicas</caption>
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
