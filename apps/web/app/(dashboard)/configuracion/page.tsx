import type { Metadata } from 'next';
import { SettingsConfigLayout, SettingsPageContent } from '@/components/settings';

export const metadata: Metadata = {
  title: 'Configuración',
  description: 'Perfil, empresa, contraseña y preferencias del sistema.',
};

export default function ConfiguracionPage() {
  return (
    <SettingsConfigLayout
      title="Configuración"
      description="Administra tu cuenta y preferencias del sistema."
    >
      <SettingsPageContent embedded />
    </SettingsConfigLayout>
  );
}
