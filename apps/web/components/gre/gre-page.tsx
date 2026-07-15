'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { useDebounce } from '@/hooks/use-debounce';
import {
  useCreateGre,
  useDeleteGre,
  useGreDetail,
  useGreList,
  useUpdateGre,
  useUploadGreFile,
} from '@/hooks/gre';
import { canManageGre } from '@/lib/gre/utils';
import type { GreFormValues } from '@/lib/gre/schemas';
import type { GreEstado, GreEstadoFilter, GreListItem } from '@/types/gre';
import { DeleteGreDialog } from './delete-gre-dialog';
import { GreDetailDialog } from './gre-detail-dialog';
import { GreEmpty } from './gre-empty';
import { GreFormModal } from './gre-form-modal';
import { GrePagination } from './gre-pagination';
import { GreTable } from './gre-table';
import { GreTableSkeleton } from './gre-skeleton';
import { GreToolbar } from './gre-toolbar';
import { GreUploadDialog } from './gre-upload-dialog';

const PAGE_SIZE = 10;

export function GrePageContent() {
  const { user } = useAuth();
  const canManage = canManageGre(user?.rol);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [serie, setSerie] = useState('');
  const [estado, setEstado] = useState<GreEstadoFilter>('all');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedGreId, setSelectedGreId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailGreId, setDetailGreId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [greToDelete, setGreToDelete] = useState<GreListItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadGreId, setUploadGreId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      numero: debouncedSearch || undefined,
      serie: serie || undefined,
      estado: estado === 'all' ? undefined : (estado as GreEstado),
      fechaDesde: fechaDesde || undefined,
      fechaHasta: fechaHasta || undefined,
    }),
    [page, debouncedSearch, serie, estado, fechaDesde, fechaHasta],
  );

  const greQuery = useGreList(listParams);
  const detailQuery = useGreDetail(detailGreId);
  const uploadDetailQuery = useGreDetail(uploadGreId);
  const editDetailQuery = useGreDetail(formMode === 'edit' ? selectedGreId : null);

  const createMutation = useCreateGre();
  const updateMutation = useUpdateGre();
  const deleteMutation = useDeleteGre();
  const uploadMutation = useUploadGreFile();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSerieChange = (value: string) => {
    setSerie(value);
    setPage(1);
  };

  const handleEstadoChange = (value: GreEstadoFilter) => {
    setEstado(value);
    setPage(1);
  };

  const handleFechaDesdeChange = (value: string) => {
    setFechaDesde(value);
    setPage(1);
  };

  const handleFechaHastaChange = (value: string) => {
    setFechaHasta(value);
    setPage(1);
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedGreId(null);
    setFormOpen(true);
  };

  const handleView = (gre: GreListItem) => {
    setDetailGreId(gre.id);
    setDetailOpen(true);
  };

  const handleEdit = (gre: GreListItem) => {
    setFormMode('edit');
    setSelectedGreId(gre.id);
    setFormOpen(true);
    setDetailOpen(false);
  };

  const handleEditFromDetail = () => {
    if (detailGreId) {
      setFormMode('edit');
      setSelectedGreId(detailGreId);
      setFormOpen(true);
      setDetailOpen(false);
    }
  };

  const handleDelete = (gre: GreListItem) => {
    setGreToDelete(gre);
    setDeleteOpen(true);
  };

  const handleUpload = (gre: GreListItem) => {
    setUploadGreId(gre.id);
    setUploadOpen(true);
  };

  const handleUploadFromDetail = () => {
    if (detailGreId) {
      setUploadGreId(detailGreId);
      setUploadOpen(true);
    }
  };

  const handleFormSubmit = async (values: GreFormValues) => {
    const { estado: estadoForm, ruc, ...rest } = values;
    const payload = {
      ...rest,
      ruc: ruc || undefined,
    };

    if (formMode === 'create') {
      await createMutation.mutateAsync(payload);
    } else if (selectedGreId) {
      await updateMutation.mutateAsync({
        id: selectedGreId,
        payload: { ...payload, estado: estadoForm },
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (greToDelete) {
      await deleteMutation.mutateAsync(greToDelete.id);
      if (detailGreId === greToDelete.id) {
        setDetailOpen(false);
      }
    }
  };

  const handleUploadFile = async (file: File) => {
    if (uploadGreId) {
      await uploadMutation.mutateAsync({ greId: uploadGreId, file });
    }
  };

  const meta = greQuery.data?.meta;
  const isLoading = greQuery.isLoading;
  const isError = greQuery.isError;
  const uploadGre = uploadDetailQuery.data;
  const editGre = editDetailQuery.data;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Guías de Remisión (GRE)"
        description="Gestión de guías de remisión electrónica con conciliación inteligente."
      />

      <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <div className="border-b border-border/40 p-4">
          <GreToolbar
            search={search}
            onSearchChange={handleSearchChange}
            serie={serie}
            onSerieChange={handleSerieChange}
            estado={estado}
            onEstadoChange={handleEstadoChange}
            fechaDesde={fechaDesde}
            onFechaDesdeChange={handleFechaDesdeChange}
            fechaHasta={fechaHasta}
            onFechaHastaChange={handleFechaHastaChange}
            canCreate={canManage}
            onCreateClick={handleCreate}
          />
        </div>

        {isLoading ? (
          <GreTableSkeleton />
        ) : isError ? (
          <div className="p-6">
            <DashboardError onRetry={() => greQuery.refetch()} />
          </div>
        ) : !greQuery.data?.items.length ? (
          <GreEmpty
            title={
              debouncedSearch || serie || estado !== 'all' || fechaDesde || fechaHasta
                ? 'Sin resultados para los filtros aplicados'
                : 'No hay GRE registradas'
            }
            description={
              canManage
                ? 'Crea tu primera guía de remisión para comenzar.'
                : 'No se encontraron guías con los criterios actuales.'
            }
          />
        ) : (
          <GreTable
            data={greQuery.data.items}
            canManage={canManage}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onUpload={handleUpload}
          />
        )}

        {meta && !isLoading && !isError ? (
          <div className="border-t border-border/40">
            <GrePagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      <GreDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        gre={detailQuery.data}
        isLoading={detailQuery.isLoading}
        isError={detailQuery.isError}
        onRetry={() => detailQuery.refetch()}
        canManage={canManage}
        onEdit={handleEditFromDetail}
        onUpload={handleUploadFromDetail}
      />

      {canManage ? (
        <>
          <GreFormModal
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            gre={editGre}
            isLoadingGre={editDetailQuery.isLoading}
            onSubmit={handleFormSubmit}
            isPending={createMutation.isPending || updateMutation.isPending}
          />
          <DeleteGreDialog
            gre={greToDelete}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDeleteConfirm}
            isPending={deleteMutation.isPending}
          />
          <GreUploadDialog
            open={uploadOpen}
            onOpenChange={setUploadOpen}
            greLabel={
              uploadGre
                ? `${uploadGre.serie}-${uploadGre.numero}`
                : greToDelete
                  ? `${greToDelete.serie}-${greToDelete.numero}`
                  : ''
            }
            archivos={uploadGre?.archivos ?? []}
            onUpload={handleUploadFile}
            isPending={uploadMutation.isPending}
          />
        </>
      ) : null}
    </motion.div>
  );
}
