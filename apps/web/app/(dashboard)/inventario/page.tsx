import type { Metadata } from 'next';
import { InventoryPageContent } from '@/components/inventory';

export const metadata: Metadata = {
  title: 'Inventario',
  description: 'Stock físico y niveles de inventario en tiempo real.',
};

export default function InventarioPage() {
  return <InventoryPageContent />;
}
