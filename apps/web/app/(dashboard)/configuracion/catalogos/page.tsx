import type { Metadata } from 'next';
import { CONFIG_UNAVAILABLE } from '@/lib/settings/unavailable-config';
import { FeatureUnavailable } from '@/components/shared/feature-unavailable';
import { SettingsConfigLayout } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Catálogos',
};

export default function ConfiguracionCatalogosPage() {
  const config = CONFIG_UNAVAILABLE.catalogos;
  return (
    <SettingsConfigLayout title="Catálogos" description="Catálogos maestros del sistema.">
      <FeatureUnavailable title={config.title} description={config.description} />
    </SettingsConfigLayout>
  );
}
