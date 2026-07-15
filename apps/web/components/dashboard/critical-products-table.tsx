'use client';

import { motion } from 'framer-motion';
import { AlertOctagon, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatNumber } from '@/lib/dashboard/utils';
import type { CriticalProductItem } from '@/types/dashboard';
import { DashboardEmpty } from './dashboard-empty';
import { CriticalProductsSkeleton } from './dashboard-skeleton';
import { DashboardError } from './dashboard-error';

function stockEstadoVariant(estado: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (estado === 'SIN STOCK') return 'destructive';
  return 'default';
}

interface CriticalProductsTableProps {
  products?: CriticalProductItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function CriticalProductsTable({
  products,
  isLoading,
  isError,
  onRetry,
}: CriticalProductsTableProps) {
  if (isLoading) return <CriticalProductsSkeleton />;
  if (isError) return <DashboardError onRetry={onRetry} />;
  if (!products?.length) {
    return (
      <DashboardEmpty
        title="Sin productos críticos"
        description="Todos los productos tienen stock suficiente."
        className="py-12"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-border/40 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10">
          <AlertOctagon className="h-4 w-4 text-orange-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">Productos críticos</h3>
          <p className="text-xs text-muted-foreground">
            Productos con stock bajo o sin existencias
          </p>
        </div>
        <Badge variant="destructive" className="ml-auto">
          {products.length}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Productos con stock crítico">
          <caption className="sr-only">Productos con stock bajo o sin existencias</caption>
          <thead>
            <tr className="border-b border-border/40 text-left text-xs text-muted-foreground">
              <th scope="col" className="px-5 py-3 font-medium">Producto</th>
              <th scope="col" className="px-5 py-3 font-medium">Código</th>
              <th scope="col" className="px-5 py-3 font-medium text-right">Stock</th>
              <th scope="col" className="px-5 py-3 font-medium text-right">Mínimo</th>
              <th scope="col" className="px-5 py-3 font-medium text-right">Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => {
              const stockPct = product.stockMinimo > 0
                ? Math.round((product.stockActual / product.stockMinimo) * 100)
                : 0;

              return (
                <motion.tr
                  key={product.productoId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.04 }}
                  className="border-b border-border/20 transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="font-medium">{product.nombre}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{product.codigo}</td>
                  <td className="px-5 py-3 text-right font-semibold tabular-nums">
                    {formatNumber(product.stockActual)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                    {formatNumber(product.stockMinimo)}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Badge variant={stockEstadoVariant(product.estado)} className="text-[10px]">
                      {product.estado === 'SIN STOCK' ? 'Sin stock' : `${stockPct}%`}
                    </Badge>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
