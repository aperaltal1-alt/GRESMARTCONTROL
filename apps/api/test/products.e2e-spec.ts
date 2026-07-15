import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { closeE2eApp, createE2eApp } from './setup-e2e';

const ADMIN_EMAIL = 'admin@gre-demo.pe';
const SUPERVISOR_EMAIL = 'supervisor@gre-demo.pe';
const CONSULTA_EMAIL = 'consulta@gre-demo.pe';
const PASSWORD = 'Demo2024!';

describe('Products Module (e2e) — Fase 4.4', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let adminToken: string;
  let supervisorToken: string;
  let consultaToken: string;
  let createdProductId: string;
  const testCodigo = `TEST-${Date.now()}`;

  async function login(email: string) {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: PASSWORD })
      .expect(200);

    return res.body.data.tokens.accessToken as string;
  }

  beforeAll(async () => {
    app = await createE2eApp();
    prisma = new PrismaClient();

    const hash = await bcrypt.hash(PASSWORD, 12);
    await prisma.usuario.updateMany({
      where: { email: { in: [ADMIN_EMAIL, SUPERVISOR_EMAIL, CONSULTA_EMAIL] } },
      data: { activo: true, deletedAt: null, passwordHash: hash },
    });

    adminToken = await login(ADMIN_EMAIL);
    supervisorToken = await login(SUPERVISOR_EMAIL);
    consultaToken = await login(CONSULTA_EMAIL);
  });

  afterAll(async () => {
    const testProducts = await prisma.producto.findMany({
      where: { codigo: { startsWith: 'TEST-' } },
      select: { id: true },
    });
    const ids = testProducts.map((p) => p.id);
    if (ids.length) {
      await prisma.kardex.deleteMany({ where: { productoId: { in: ids } } });
      await prisma.producto.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
    await closeE2eApp(app);
  });

  describe('POST /api/products', () => {
    it('debe crear un producto', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          codigo: testCodigo,
          nombre: 'Producto Test MVP',
          categoria: 'Abarrotes',
          unidad: 'UND',
          stockActual: 50,
          stockMinimo: 10,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.codigo).toBe(testCodigo);
      expect(res.body.data.stockActual).toBe(50);
      expect(res.body.data.activo).toBe(true);
      createdProductId = res.body.data.id;
    });

    it('debe rechazar código duplicado', async () => {
      await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          codigo: testCodigo,
          nombre: 'Duplicado',
          categoria: 'Abarrotes',
          unidad: 'UND',
          stockActual: 1,
          stockMinimo: 1,
        })
        .expect(409);
    });

    it('debe rechazar stock negativo', async () => {
      await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          codigo: 'TEST-NEG',
          nombre: 'Negativo',
          categoria: 'Abarrotes',
          unidad: 'UND',
          stockActual: -1,
          stockMinimo: 0,
        })
        .expect(400);
    });

    it('debe rechazar creación por CONSULTA', async () => {
      await request(app.getHttpServer())
        .post('/api/products')
        .set('Authorization', `Bearer ${consultaToken}`)
        .send({
          codigo: 'TEST-CONSULTA',
          nombre: 'No permitido',
          categoria: 'Abarrotes',
          unidad: 'UND',
          stockActual: 1,
          stockMinimo: 1,
        })
        .expect(403);
    });
  });

  describe('GET /api/products', () => {
    it('debe listar productos', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/products')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.meta.total).toBeGreaterThan(0);
    });

    it('debe buscar por código', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/products?search=${testCodigo}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.items.some((p: { codigo: string }) => p.codigo === testCodigo)).toBe(
        true,
      );
    });

    it('debe filtrar por categoría', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/products?categoria=Abarrotes')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('debe editar producto (SUPERVISOR)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          nombre: 'Producto Test Editado',
          stockActual: 75,
          stockMinimo: 15,
        })
        .expect(200);

      expect(res.body.data.nombre).toBe('Producto Test Editado');
      expect(res.body.data.stockActual).toBe(75);
      expect(res.body.data.stockMinimo).toBe(15);
    });

    it('debe rechazar edición por CONSULTA', async () => {
      await request(app.getHttpServer())
        .patch(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${consultaToken}`)
        .send({ nombre: 'No permitido' })
        .expect(403);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('debe desactivar producto (soft delete)', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.message).toContain('desactivado');

      await request(app.getHttpServer())
        .get(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
