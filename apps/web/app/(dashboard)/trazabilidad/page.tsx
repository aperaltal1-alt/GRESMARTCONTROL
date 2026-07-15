import type { Metadata } from 'next';
import { TraceabilityPageContent } from '@/components/traceability';

export const metadata: Metadata = {
  title: 'Trazabilidad',
  description: 'Rastreo de productos y GRE con datos reales de Kardex y conciliación.',
};

export default function TrazabilidadPage() {
  return <TraceabilityPageContent />;
}
