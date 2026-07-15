import type { Metadata } from 'next';
import { GrePageContent } from '@/components/gre';

export const metadata: Metadata = {
  title: 'GRE',
  description: 'Gestión de Guías de Remisión Electrónica.',
};

export default function GrePage() {
  return <GrePageContent />;
}
