import type { Metadata } from 'next';

import { SettingsPageContent } from '@/components/settings';



export const metadata: Metadata = {

  title: 'Mi cuenta',

  description: 'Gestiona tu perfil, empresa, contraseña y preferencias.',

};



export default function CuentaPage() {

  return <SettingsPageContent />;

}

