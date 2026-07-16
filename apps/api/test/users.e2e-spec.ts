import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { closeE2eApp, createE2eApp } from './setup-e2e';
import { DEMO_USERS, ensureDemoUsersReady } from './seed-helpers';

const ADMIN_EMAIL = DEMO_USERS.admin.email;
const ADMIN_PASSWORD = DEMO_USERS.admin.password;
const SUPERVISOR_EMAIL = DEMO_USERS.supervisor.email;

describe('Users Module (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let adminToken: string;
  let supervisorToken: string;
  let createdUserId: string;

  async function login(email: string, password: string) {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    return res.body.data.tokens.accessToken as string;
  }

  beforeAll(async () => {
    app = await createE2eApp();
    prisma = new PrismaClient();
    await ensureDemoUsersReady(prisma);

    adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    supervisorToken = await login(SUPERVISOR_EMAIL, ADMIN_PASSWORD);
  });

  afterAll(async () => {
    if (createdUserId) {
      await prisma.usuario.deleteMany({
        where: { email: 'gestion.test@gre-demo.pe' },
      });
    }
    await prisma.$disconnect();
    await closeE2eApp(app);
  });

  describe('GET /api/users', () => {
    it('debe listar usuarios de la empresa (ADMIN)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.items)).toBe(true);
      expect(res.body.data.meta.total).toBeGreaterThanOrEqual(3);
    });

    it('debe rechazar acceso a SUPERVISOR', async () => {
      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .expect(403);
    });
  });

  describe('GET /api/users/roles', () => {
    it('debe devolver roles MVP', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/users/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data).toHaveLength(3);
      expect(res.body.data.map((r: { codigo: string }) => r.codigo)).toEqual(
        expect.arrayContaining(['ADMIN', 'SUPERVISOR', 'CONSULTA']),
      );
    });
  });

  describe('POST /api/users', () => {
    it('debe crear un usuario con rol asignado', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'gestion.test@gre-demo.pe',
          password: 'TestUser2024!',
          nombre: 'Usuario',
          apellido: 'Gestión',
          rol: 'SUPERVISOR',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('gestion.test@gre-demo.pe');
      expect(res.body.data.rol).toBe('SUPERVISOR');
      expect(res.body.data.activo).toBe(true);
      createdUserId = res.body.data.id;
    });

    it('debe rechazar email duplicado', async () => {
      await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'gestion.test@gre-demo.pe',
          password: 'TestUser2024!',
          nombre: 'Duplicado',
          rol: 'CONSULTA',
        })
        .expect(409);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('debe editar usuario y cambiar rol', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          nombre: 'Usuario Editado',
          rol: 'CONSULTA',
        })
        .expect(200);

      expect(res.body.data.nombre).toBe('Usuario Editado');
      expect(res.body.data.rol).toBe('CONSULTA');
    });
  });

  describe('PATCH /api/users/:id/status', () => {
    it('debe desactivar usuario y revocar sesiones', async () => {
      const loginRes = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'gestion.test@gre-demo.pe', password: 'TestUser2024!' })
        .expect(200);

      const refreshToken = loginRes.body.data.tokens.refreshToken;

      const res = await request(app.getHttpServer())
        .patch(`/api/users/${createdUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: false })
        .expect(200);

      expect(res.body.data.activo).toBe(false);

      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });

    it('debe activar usuario nuevamente', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/users/${createdUserId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: true })
        .expect(200);

      expect(res.body.data.activo).toBe(true);
    });

    it('debe impedir que el admin se desactive a sí mismo', async () => {
      const admin = await prisma.usuario.findUnique({ where: { email: ADMIN_EMAIL } });

      await request(app.getHttpServer())
        .patch(`/api/users/${admin!.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ activo: false })
        .expect(403);
    });
  });

  describe('GET /api/users/:id', () => {
    it('debe obtener detalle del usuario', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.id).toBe(createdUserId);
      expect(res.body.data.email).toBe('gestion.test@gre-demo.pe');
    });
  });
});
