import { INestApplication } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { closeE2eApp, createE2eApp } from './setup-e2e';
import { DEMO_USERS, ensureDemoUsersReady } from './seed-helpers';

const DEMO_EMAIL = DEMO_USERS.admin.email;
const DEMO_PASSWORD = DEMO_USERS.admin.password;
const TEST_IP = '127.0.0.1';

describe('Auth Module (e2e) — Fase 4.2', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  async function ensureDemoAdminReady() {
    await ensureDemoUsersReady(prisma);
  }

  beforeAll(async () => {
    app = await createE2eApp();
    prisma = new PrismaClient();
    await ensureDemoAdminReady();
  });

  beforeEach(async () => {
    await ensureDemoAdminReady();
  });

  afterAll(async () => {
    await ensureDemoAdminReady();
    await prisma.loginAttempt.deleteMany({ where: { email: DEMO_EMAIL } });
    await prisma.$disconnect();
    await closeE2eApp(app);
  });

  describe('POST /api/auth/login', () => {
    it('debe autenticar con credenciales válidas y devolver respuesta estándar', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.message).toBeDefined();
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();
      expect(res.body.data.tokens.tokenType).toBe('Bearer');
      expect(res.body.data.tokens.expiresIn).toBe(900);
      expect(res.body.data.user.email).toBe(DEMO_EMAIL);
      expect(res.body.data.user.rol).toBe('ADMIN');
      expect(res.headers['set-cookie']).toBeDefined();
      expect(res.headers['set-cookie'][0]).toContain('gre_refresh_token');
    });

    it('debe rechazar credenciales inválidas', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: 'wrong-password' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });

    it('debe bloquear tras 5 intentos fallidos', async () => {
      const blockEmail = `block-test-${Date.now()}@gre-demo.pe`;
      const blockIp = `10.0.0.${Date.now() % 200 + 1}`;

      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .post('/api/auth/login')
          .set('X-Forwarded-For', blockIp)
          .send({ email: blockEmail, password: 'WrongPass1!' })
          .expect(401);
      }

      const blocked = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', blockIp)
        .send({ email: blockEmail, password: 'WrongPass1!' })
        .expect(403);

      expect(blocked.body.success).toBe(false);
      expect(blocked.body.message).toContain('bloqueada');

      await prisma.loginAttempt.deleteMany({ where: { email: blockEmail } });
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('debe renovar tokens con refresh token válido', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
        .expect(200);

      const refreshToken = login.body.data.tokens.refreshToken;

      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).not.toBe(refreshToken);
    });

    it('debe rechazar refresh token inválido', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('debe cerrar sesión y revocar refresh token', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
        .expect(200);

      const refreshToken = login.body.data.tokens.refreshToken;

      const logout = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);

      expect(logout.body.success).toBe(true);
      expect(logout.body.data.message).toContain('Sesión cerrada');

      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('debe devolver perfil con Bearer token', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
        .expect(200);

      const accessToken = login.body.data.tokens.accessToken;

      const res = await request(app.getHttpServer())
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(DEMO_EMAIL);
      expect(res.body.data.rol).toBe('ADMIN');
      expect(Array.isArray(res.body.data.permisos)).toBe(true);
      expect(res.body.data.permisos.length).toBeGreaterThan(0);
    });

    it('debe rechazar petición sin token', async () => {
      await request(app.getHttpServer()).get('/api/auth/profile').expect(401);
    });
  });

  describe('POST /api/auth/change-password', () => {
    const tempPassword = 'TempDemo2024!';

    it('debe cambiar contraseña y revocar sesiones', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
        .expect(200);

      const accessToken = login.body.data.tokens.accessToken;
      const oldRefresh = login.body.data.tokens.refreshToken;

      await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ currentPassword: DEMO_PASSWORD, newPassword: tempPassword })
        .expect(200);

      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: oldRefresh })
        .expect(401);

      const newLogin = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: tempPassword })
        .expect(200);

      const restoreToken = newLogin.body.data.tokens.accessToken;

      await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${restoreToken}`)
        .send({ currentPassword: tempPassword, newPassword: DEMO_PASSWORD })
        .expect(200);
    });

    it('debe rechazar contraseña actual incorrecta', async () => {
      const login = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
        .expect(200);

      const res = await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${login.body.data.tokens.accessToken}`)
        .send({ currentPassword: 'WrongPass1!', newPassword: tempPassword })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/forgot-password & reset-password', () => {
    it('debe procesar forgot-password sin revelar existencia del email', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/auth/forgot-password')
        .send({ email: DEMO_EMAIL })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.message).toContain('Si el email está registrado');
    });

    it('debe restablecer contraseña con token válido', async () => {
      const user = await prisma.usuario.findUnique({ where: { email: DEMO_EMAIL } });
      expect(user).toBeTruthy();

      const plainToken = randomBytes(32).toString('hex');
      const tokenHash = createHash('sha256').update(plainToken).digest('hex');

      await prisma.passwordResetToken.deleteMany({ where: { usuarioId: user!.id } });
      await prisma.passwordResetToken.create({
        data: {
          usuarioId: user!.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      const resetPassword = 'ResetDemo2024!';

      await request(app.getHttpServer())
        .post('/api/auth/reset-password')
        .send({ token: plainToken, newPassword: resetPassword })
        .expect(200);

      const login = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', TEST_IP)
        .send({ email: DEMO_EMAIL, password: resetPassword })
        .expect(200);

      await request(app.getHttpServer())
        .post('/api/auth/change-password')
        .set('Authorization', `Bearer ${login.body.data.tokens.accessToken}`)
        .send({ currentPassword: resetPassword, newPassword: DEMO_PASSWORD })
        .expect(200);
    });
  });

  describe('Validaciones de entidades', () => {
    it('debe rechazar login de usuario inactivo', async () => {
      const user = await prisma.usuario.findUnique({ where: { email: DEMO_EMAIL } });
      expect(user).toBeTruthy();

      const inactiveIp = `10.0.1.${Date.now() % 200 + 1}`;

      await prisma.usuario.update({
        where: { id: user!.id },
        data: { activo: false },
      });

      const res = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', inactiveIp)
        .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
        .expect(403);

      expect(res.body.message).toContain('inactiva');

      await prisma.usuario.update({
        where: { id: user!.id },
        data: { activo: true },
      });
    });
  });
});
