'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/auth-provider';
import { PageHeader } from '@/components/shared/page-header';
import { DashboardError } from '@/components/dashboard/dashboard-error';
import { useDebounce } from '@/hooks/use-debounce';
import {
  useCreateProduct,
  useDeleteProduct,
  useProductCategories,
  useProductsList,
  useUpdateProduct,
} from '@/hooks/products';
import { computeStockEstado, canManageProducts } from '@/lib/products/utils';
import type { ProductFormValues } from '@/lib/products/schemas';
import type {
  Product,
  ProductActivoFilter,
  ProductEstadoFilter,
} from '@/types/products';
import { DeleteProductDialog } from './delete-product-dialog';
import { ProductFormModal } from './product-form-modal';
import { ProductsEmpty } from './products-empty';
import { ProductsPagination } from './products-pagination';
import { ProductsTable } from './products-table';
import { ProductsTableSkeleton } from './products-skeleton';
import { ProductsToolbar } from './products-toolbar';

const PAGE_SIZE = 10;

export function ProductsPageContent() {
  const { user } = useAuth();
  const canManage = canManageProducts(user?.rol);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estadoStock, setEstadoStock] = useState<ProductEstadoFilter>('all');
  const [activo, setActivo] = useState<ProductActivoFilter>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const debouncedSearch = useDebounce(search, 300);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      categoria: categoria || undefined,
      activo: activo === 'all' ? undefined : activo === 'active',
    }),
    [page, debouncedSearch, categoria, activo],
  );

  const productsQuery = useProductsList(listParams);
  const categoriesQuery = useProductCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const filteredItems = useMemo(() => {
    const items = productsQuery.data?.items ?? [];
    if (estadoStock === 'all') return items;
    return items.filter(
      (p) => computeStockEstado(p.stockActual, p.stockMinimo) === estadoStock,
    );
  }, [productsQuery.data?.items, estadoStock]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoriaChange = (value: string) => {
    setCategoria(value);
    setPage(1);
  };

  const handleEstadoStockChange = (value: ProductEstadoFilter) => {
    setEstadoStock(value);
    setPage(1);
  };

  const handleActivoChange = (value: ProductActivoFilter) => {
    setActivo(value);
    setPage(1);
  };

  const handleCreate = () => {
    setFormMode('create');
    setSelectedProduct(undefined);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setFormMode('edit');
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (values: ProductFormValues) => {
    if (formMode === 'create') {
      await createMutation.mutateAsync(values);
    } else if (selectedProduct) {
      await updateMutation.mutateAsync({ id: selectedProduct.id, payload: values });
    }
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteMutation.mutateAsync(productToDelete.id);
    }
  };

  const meta = productsQuery.data?.meta;
  const isLoading = productsQuery.isLoading;
  const isError = productsQuery.isError;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Productos"
        description="Catálogo y mantenimiento de productos con control de stock."
      />

      <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <div className="border-b border-border/40 p-4">
          <ProductsToolbar
            search={search}
            onSearchChange={handleSearchChange}
            categoria={categoria}
            onCategoriaChange={handleCategoriaChange}
            estadoStock={estadoStock}
            onEstadoStockChange={handleEstadoStockChange}
            activo={activo}
            onActivoChange={handleActivoChange}
            categories={categoriesQuery.data ?? []}
            canCreate={canManage}
            onCreateClick={handleCreate}
          />
        </div>

        {isLoading ? (
          <ProductsTableSkeleton />
        ) : isError ? (
          <div className="p-6">
            <DashboardError onRetry={() => productsQuery.refetch()} />
          </div>
        ) : filteredItems.length === 0 ? (
          <ProductsEmpty
            title={
              debouncedSearch || categoria || estadoStock !== 'all' || activo !== 'all'
                ? 'Sin resultados para los filtros aplicados'
                : 'No hay productos registrados'
            }
            description={
              canManage
                ? 'Crea tu primer producto para comenzar a gestionar el inventario.'
                : 'No se encontraron productos con los criterios actuales.'
            }
          />
        ) : (
          <ProductsTable
            data={filteredItems}
            canManage={canManage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {meta && !isLoading && !isError ? (
          <div className="border-t border-border/40">
            <ProductsPagination
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
          <ProductFormModal
            open={formOpen}
            onOpenChange={setFormOpen}
            mode={formMode}
            product={selectedProduct}
            onSubmit={handleFormSubmit}
            isPending={createMutation.isPending || updateMutation.isPending}
          />
          <DeleteProductDialog
            product={productToDelete}
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            onConfirm={handleDeleteConfirm}
            isPending={deleteMutation.isPending}
          />
        </>
      ) : null}
    </motion.div>
  );
}
