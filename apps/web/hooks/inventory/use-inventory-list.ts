'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchInventory } from '@/lib/inventory/services';
import { fetchDashboardKpis } from '@/lib/dashboard/services';
import { queryKeys } from '@/lib/query/keys';
import type { ListInventoryParams } from '@/types/inventory';

export function useInventoryList(params: ListInventoryParams) {
  return useQuery({
    queryKey: queryKeys.inventory.list(params as Record<string, unknown>),
    queryFn: () => fetchInventory(params),
    placeholderData: (prev) => prev,
  });
}

export function useInventorySummary() {
  return useQuery({
    queryKey: queryKeys.inventory.summary,
    queryFn: async () => {
      const [all, bajo, sinStock, kpis] = await Promise.all([
        fetchInventory({ page: 1, limit: 1 }),
        fetchInventory({ page: 1, limit: 1, estado: 'BAJO' }),
        fetchInventory({ page: 1, limit: 1, estado: 'SIN STOCK' }),
        fetchDashboardKpis(),
      ]);

      return {
        totalProductos: all.meta.total,
        stockTotal: kpis.stockTotalDisponible,
        productosBajoStock: bajo.meta.total,
        productosSinStock: sinStock.meta.total,
      };
    },
    staleTime: 60 * 1000,
  });
}
