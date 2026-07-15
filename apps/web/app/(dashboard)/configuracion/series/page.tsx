import type { Metadata } from 'next';
import { CONFIG_UNAVAILABLE } from '@/lib/settings/unavailable-config';
import { FeatureUnavailable } from '@/components/shared/feature-unavailable';
import { SettingsConfigLayout } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Series',
};

export default function ConfiguracionSeriesPage() {
  const config = CONFIG_UNAVAILABLE.series;
  return (
    <SettingsConfigLayout title="Series" description="Series documentales por empresa.">
      <FeatureUnavailable title={config.title} description={config.description} />
    </SettingsConfigLayout>
  );
}
