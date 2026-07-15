'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/auth-provider';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { PageHeader } from '@/components/shared/page-header';
import { useDebounce } from '@/hooks/use-debounce';
import {
  useCreateUser,
  useUpdateUser,
  useUpdateUserStatus,
  useUserRoles,
  useUsersList,
} from '@/hooks/users';
import { canManageUsers } from '@/lib/users/schemas';
import type { UserFormValues } from '@/lib/users/schemas';
import type { User } from '@/types/users';
import { UserFormModal } from './user-form-modal';
import { UserStatusDialog } from './user-status-dialog';
import { UsersEmpty } from './users-empty';
import { UsersPagination } from './users-pagination';
import { UsersTable } from './users-table';
import { UsersTableSkeleton } from './users-skeleton';
import { UsersToolbar } from './users-toolbar';

const PAGE_SIZE = 10;

export function UsersPageContent() {
  const { user: currentUser } = useAuth();
  const canManage = canManageUsers(currentUser?.rol);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activo, setActivo] = useState<'all' | 'active' | 'inactive'>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [statusOpen, setStatusOpen] = useState(false);
  const [userForStatus, setUserForStatus] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      activo: activo === 'all' ? undefined : activo === 'active',
    }),
    [page, debouncedSearch, activo],
  );

  const usersQuery = useUsersList(listParams);
  const rolesQuery = useUserRoles();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const statusMutation = useUpdateUserStatus();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleActivoChange = (value: 'all' | 'active' | 'inactive') => {
    setActivo(value);
    setPage(1);
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedUser(undefined);
    setFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setFormMode('edit');
    setSelectedUser(user);
    setFormOpen(true);
  };

  const handleToggleStatus = (user: User) => {
    setUserForStatus(user);
    setStatusOpen(true);
  };

  const handleFormSubmit = async (values: UserFormValues) => {
    if (formMode === 'create') {
      await createMutation.mutateAsync({
        email: values.email,
        password: values.password ?? '',
        nombre: values.nombre,
        apellido: values.apellido || undefined,
        rol: values.rol,
      });
    } else if (selectedUser) {
      const payload = {
        email: values.email,
        nombre: values.nombre,
        apellido: values.apellido || undefined,
        rol: values.rol,
        ...(values.password ? { password: values.password } : {}),
      };
      await updateMutation.mutateAsync({ id: selectedUser.id, payload });
    }
  };

  const handleStatusConfirm = async () => {
    if (userForStatus) {
      await statusMutation.mutateAsync({
        id: userForStatus.id,
        activo: !userForStatus.activo,
      });
    }
  };

  const meta = usersQuery.data?.meta;
  const items = usersQuery.data?.items ?? [];
  const isLoading = usersQuery.isLoading;
  const isError = usersQuery.isError;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Usuarios"
        description="Administración de usuarios, roles y accesos al sistema."
      />

      <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <div className="border-b border-border/40 p-4">
          <UsersToolbar
            search={search}
            onSearchChange={handleSearchChange}
            activo={activo}
            onActivoChange={handleActivoChange}
            canCreate={canManage}
            onCreateClick={handleCreate}
          />
        </div>

        {isLoading ? (
          <UsersTableSkeleton />
        ) : isError ? (
          <div className="p-6">
            <DashboardError onRetry={() => usersQuery.refetch()} />
          </div>
        ) : items.length === 0 ? (
          <UsersEmpty
            title={
              debouncedSearch || activo !== 'all'
                ? 'Sin resultados para los filtros aplicados'
                : 'No hay usuarios registrados'
            }
            description={
              canManage
                ? 'Crea el primer usuario para comenzar a gestionar accesos.'
                : 'No se encontraron usuarios con los criterios actuales.'
            }
          />
        ) : (
          <UsersTable
            data={items}
            canManage={canManage}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {meta && !isLoading && !isError ? (
          <div className="border-t border-border/40">
            <UsersPagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      {canManage ? (
        <>
          <UserFormModal
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            user={selectedUser}
            roles={rolesQuery.data ?? []}
            onSubmit={handleFormSubmit}
            isPending={createMutation.isPending || updateMutation.isPending}
          />
          <UserStatusDialog
            user={userForStatus}
            open={statusOpen}
            onOpenChange={setStatusOpen}
            onConfirm={handleStatusConfirm}
            isPending={statusMutation.isPending}
          />
        </>
      ) : null}
    </motion.div>
  );
}
