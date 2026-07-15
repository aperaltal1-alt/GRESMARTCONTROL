'use client';

import { Package } from 'lucide-react';
import type { Product } from '@/types/products';

interface TraceabilityProductContextProps {
  product: Product;
}

export function TraceabilityProductContext({ product }: TraceabilityProductContextProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/80 p-4 backdrop-blur-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10">
        <Package className="h-5 w-5 text-brand" />
      </div>
      <div>
        <p className="font-semibold">{product.nombre}</p>
        <p className="font-mono text-sm text-muted-foreground">{product.codigo}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {product.categoria} · Stock: {product.stockActual} {product.unidad}
        </p>
      </div>
    </div>
  );
}
