import type { Metadata } from 'next';
import { CONFIG_UNAVAILABLE } from '@/lib/settings/unavailable-config';
import { FeatureUnavailable } from '@/components/shared/feature-unavailable';
import { SettingsConfigLayout } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Estados',
};

export default function ConfiguracionEstadosPage() {
  const config = CONFIG_UNAVAILABLE.estados;
  return (
    <SettingsConfigLayout title="Estados" description="Estados operativos del sistema.">
      <FeatureUnavailable title={config.title} description={config.description} />
    </SettingsConfigLayout>
  );
}
