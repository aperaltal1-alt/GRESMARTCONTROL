import type { Metadata } from 'next';
import { SettingsCompanyCard, SettingsConfigLayout } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Empresas',
  description: 'Información de la empresa asociada a tu cuenta.',
};

export default function ConfiguracionEmpresasPage() {
  return (
    <SettingsConfigLayout
      title="Empresas"
      description="Datos de la empresa de tu sesión. La edición requiere un módulo de API no disponible en el MVP."
    >
      <SettingsCompanyCard />
    </SettingsConfigLayout>
  );
}
