import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageLoading } from '@/lib/lazy/page-loading';

const ReportsPageContent = dynamic(
  () => import('@/components/reports').then((mod) => mod.ReportsPageContent),
  { loading: () => <PageLoading /> },
);

export const metadata: Metadata = {
  title: 'Reportes',
  description: 'Resumen ejecutivo, indicadores y exportación de datos operativos.',
};

export default function ReportesPage() {
  return <ReportsPageContent />;
}
