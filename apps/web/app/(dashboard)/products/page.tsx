import type { Metadata } from 'next';
import { ProductsPageContent } from '@/components/products';

export const metadata: Metadata = {
  title: 'Productos',
  description: 'Catálogo y mantenimiento de productos con control de stock.',
};

export default function ProductsPage() {
  return <ProductsPageContent />;
}
