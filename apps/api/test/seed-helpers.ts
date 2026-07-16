import * as bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

export const DEMO_USERS = {
  admin: { email: 'admin@gre-demo.pe', password: 'Demo2024!' },
  supervisor: { email: 'supervisor@gre-demo.pe', password: 'Demo2024!' },
  consulta: { email: 'consulta@gre-demo.pe', password: 'Demo2024!' },
} as const;

export async function ensureDemoUsersReady(prisma: PrismaClient): Promise<void> {
  const passwordHash = await bcrypt.hash(DEMO_USERS.admin.password, 12);

  await prisma.usuario.updateMany({
    where: {
      email: {
        in: [
          DEMO_USERS.admin.email,
          DEMO_USERS.supervisor.email,
          DEMO_USERS.consulta.email,
        ],
      },
    },
    data: { activo: true, deletedAt: null, passwordHash },
  });

  await prisma.loginAttempt.deleteMany({
    where: {
      email: {
        in: [
          DEMO_USERS.admin.email,
          DEMO_USERS.supervisor.email,
          DEMO_USERS.consulta.email,
        ],
      },
    },
  });

  const admin = await prisma.usuario.findUnique({
    where: { email: DEMO_USERS.admin.email },
  });

  if (!admin) {
    throw new Error(
      'Demo users not found. Run `npm run db:seed` before executing e2e tests.',
    );
  }
}
