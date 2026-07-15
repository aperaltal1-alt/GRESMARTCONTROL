import type { Metadata } from 'next';
import { LoginPageContent } from '@/components/auth/login-page-content';

export const metadata: Metadata = {
  title: 'Iniciar sesión',
  description: 'Accede a GRE Smart Control',
};

export default function LoginPage() {
  return <LoginPageContent />;
}
