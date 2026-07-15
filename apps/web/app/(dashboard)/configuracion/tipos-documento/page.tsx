import type { Metadata } from 'next';
import { CONFIG_UNAVAILABLE } from '@/lib/settings/unavailable-config';
import { FeatureUnavailable } from '@/components/shared/feature-unavailable';
import { SettingsConfigLayout } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Tipos de Documento',
};

export default function ConfiguracionTiposDocumentoPage() {
  const config = CONFIG_UNAVAILABLE.tiposDocumento;
  return (
    <SettingsConfigLayout title="Tipos de Documento" description="Tipos de documento configurables.">
      <FeatureUnavailable title={config.title} description={config.description} />
    </SettingsConfigLayout>
  );
}
