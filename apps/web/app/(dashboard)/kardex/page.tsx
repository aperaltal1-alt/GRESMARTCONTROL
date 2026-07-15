import type { Metadata } from 'next';
import { KardexPageContent } from '@/components/kardex';

export const metadata: Metadata = {
  title: 'Kardex',
  description: 'Movimientos de entrada, salida y ajustes de inventario.',
};

export default function KardexPage() {
  return <KardexPageContent />;
}
