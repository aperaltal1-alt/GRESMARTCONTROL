import type { Metadata } from 'next';

import { UsersPageContent } from '@/components/users';



export const metadata: Metadata = {

  title: 'Usuarios',

  description: 'Administración de usuarios, roles y accesos al sistema.',

};



export default function UsuariosPage() {

  return <UsersPageContent />;

}

