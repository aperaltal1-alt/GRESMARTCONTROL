import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageLoading } from '@/lib/lazy/page-loading';

const DashboardOperational = dynamic(
  () => import('@/components/dashboard').then((mod) => mod.DashboardOperational),
  { loading: () => <PageLoading /> },
);

export const metadata: Metadata = {
  title: 'Dashboard Operativo',
  description: 'Vista táctica con acciones pendientes y actividad reciente.',
};

export default function DashboardOperativoPage() {
  return <DashboardOperational />;
}
