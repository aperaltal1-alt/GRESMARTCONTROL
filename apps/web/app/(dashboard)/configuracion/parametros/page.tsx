import type { Metadata } from 'next';
import { CONFIG_UNAVAILABLE } from '@/lib/settings/unavailable-config';
import { FeatureUnavailable } from '@/components/shared/feature-unavailable';
import { SettingsConfigLayout } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Parámetros',
};

export default function ConfiguracionParametrosPage() {
  const config = CONFIG_UNAVAILABLE.parametros;
  return (
    <SettingsConfigLayout title="Parámetros" description="Configuración global del sistema.">
      <FeatureUnavailable title={config.title} description={config.description} />
    </SettingsConfigLayout>
  );
}
