import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { PageLoading } from '@/lib/lazy/page-loading';

const DashboardExecutive = dynamic(
  () => import('@/components/dashboard').then((mod) => mod.DashboardExecutive),
  { loading: () => <PageLoading /> },
);

export const metadata: Metadata = {
  title: 'Dashboard Ejecutivo',
  description: 'Vista estratégica con KPIs, gráficos y actividad en tiempo real.',
};

export default function DashboardEjecutivoPage() {
  return <DashboardExecutive />;
}
