'use client';

import { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { MoreHorizontal, Pencil, UserCheck, UserX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatRelativeDate } from '@/lib/dashboard/utils';
import { formatDateTime } from '@/lib/gre/utils';
import { cn } from '@/lib/utils';
import type { User } from '@/types/users';
import { UserRolBadge } from './user-rol-badge';

interface UsersTableProps {
  data: User[];
  canManage: boolean;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
}

function formatUltimoLogin(value?: string | null): string {
  if (!value) return 'Nunca';
  const date = new Date(value);
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) return formatRelativeDate(value);
  return formatDateTime(value);
}

export function UsersTable({ data, canManage, onEdit, onToggleStatus }: UsersTableProps) {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => (
          <span className="text-sm font-medium">{row.original.email}</span>
        ),
      },
      {
        id: 'nombre',
        header: 'Nombre',
        cell: ({ row }) => {
          const fullName = [row.original.nombre, row.original.apellido].filter(Boolean).join(' ');
          return <span className="max-w-[220px] truncate">{fullName}</span>;
        },
      },
      {
        accessorKey: 'rol',
        header: 'Rol',
        cell: ({ row }) => <UserRolBadge rol={row.original.rol} />,
      },
      {
        accessorKey: 'activo',
        header: 'Estado',
        cell: ({ row }) => (
          <Badge variant={row.original.activo ? 'default' : 'secondary'}>
            {row.original.activo ? 'Activo' : 'Inactivo'}
          </Badge>
        ),
      },
      {
        accessorKey: 'ultimoLoginAt',
        header: 'Último login',
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {formatUltimoLogin(row.original.ultimoLoginAt)}
          </span>
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
                  <DropdownMenuItem onClick={() => onToggleStatus(row.original)}>
                    {row.original.activo ? (
                      <>
                        <UserX className="mr-2 h-4 w-4" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <UserCheck className="mr-2 h-4 w-4" />
                        Activar
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <span className="block text-right text-xs text-muted-foreground">Solo lectura</span>
          ),
      },
    ],
    [canManage, onEdit, onToggleStatus],
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
      <table className="w-full text-sm" aria-label="Listado de usuarios">
        <caption className="sr-only">Listado de usuarios</caption>
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
