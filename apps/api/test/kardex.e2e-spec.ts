import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { closeE2eApp, createE2eApp } from './setup-e2e';

const ADMIN_EMAIL = 'admin@gre-demo.pe';
const SUPERVISOR_EMAIL = 'supervisor@gre-demo.pe';
const CONSULTA_EMAIL = 'consulta@gre-demo.pe';
const PASSWORD = 'Demo2024!';

describe('Kardex & Inventory Module (e2e) — Fase 4.6', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let adminToken: string;
  let supervisorToken: string;
  let consultaToken: string;
  let testProductId: string;
  let testKardexId: string;

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

    const codigo = `TEST-KDX-${Date.now()}`;
    const productRes = await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        codigo,
        nombre: 'Producto Kardex Test',
        categoria: 'Abarrotes',
        unidad: 'UND',
        stockActual: 50,
        stockMinimo: 10,
      })
      .expect(201);

    testProductId = productRes.body.data.id;

    const kardex = await prisma.kardex.findUnique({
      where: { productoId: testProductId },
      select: { id: true },
    });
    testKardexId = kardex!.id;
  });

  afterAll(async () => {
    if (testKardexId) {
      await prisma.movimientoKardex.deleteMany({ where: { kardexId: testKardexId } });
      await prisma.kardex.deleteMany({ where: { id: testKardexId } });
    }
    if (testProductId) {
      await prisma.producto.deleteMany({ where: { id: testProductId } });
    }
    await prisma.$disconnect();
    await closeE2eApp(app);
  });

  describe('POST /api/kardex', () => {
    it('debe registrar una entrada y actualizar stock', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/kardex')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productoId: testProductId,
          fecha: '2026-07-07',
          tipo: 'ENTRADA',
          cantidad: 20,
          observacion: 'Entrada test MVP',
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.tipo).toBe('ENTRADA');
      expect(res.body.data.saldoAnterior).toBe(50);
      expect(res.body.data.saldoNuevo).toBe(70);

      const inventory = await request(app.getHttpServer())
        .get(`/api/inventory?limit=100`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const item = inventory.body.data.items.find(
        (p: { productoId: string }) => p.productoId === testProductId,
      );
      expect(item.stockActual).toBe(70);
    });

    it('debe registrar una salida y actualizar stock', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/kardex')
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          productoId: testProductId,
          fecha: '2026-07-07',
          tipo: 'SALIDA',
          cantidad: 15,
          observacion: 'Salida test MVP',
        })
        .expect(201);

      expect(res.body.data.saldoAnterior).toBe(70);
      expect(res.body.data.saldoNuevo).toBe(55);
    });

    it('debe rechazar salida que supera el stock (409)', async () => {
      await request(app.getHttpServer())
        .post('/api/kardex')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productoId: testProductId,
          fecha: '2026-07-07',
          tipo: 'SALIDA',
          cantidad: 9999,
          observacion: 'Salida excesiva',
        })
        .expect(409);
    });

    it('debe registrar un ajuste de stock', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/kardex')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productoId: testProductId,
          fecha: '2026-07-08',
          tipo: 'AJUSTE',
          cantidad: 12,
          observacion: 'Ajuste inventario test',
        })
        .expect(201);

      expect(res.body.data.tipo).toBe('AJUSTE');
      expect(res.body.data.saldoNuevo).toBe(12);
    });

    it('debe rechazar registro por CONSULTA', async () => {
      await request(app.getHttpServer())
        .post('/api/kardex')
        .set('Authorization', `Bearer ${consultaToken}`)
        .send({
          productoId: testProductId,
          fecha: '2026-07-07',
          tipo: 'ENTRADA',
          cantidad: 1,
        })
        .expect(403);
    });
  });

  describe('GET /api/kardex', () => {
    it('debe listar movimientos', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/kardex')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.meta.total).toBeGreaterThan(0);
    });

    it('debe filtrar por producto y tipo', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/kardex?producto=${testProductId}&tipo=ENTRADA`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(
        res.body.data.items.every(
          (m: { productoId: string; tipo: string }) =>
            m.productoId === testProductId && m.tipo === 'ENTRADA',
        ),
      ).toBe(true);
    });

    it('debe filtrar por rango de fechas', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/kardex?fechaDesde=2026-07-01&fechaHasta=2026-07-31')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/inventory', () => {
    it('debe listar inventario con estados', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/inventory')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.items[0]).toHaveProperty('estado');
      expect(['NORMAL', 'BAJO', 'SIN STOCK']).toContain(res.body.data.items[0].estado);
    });

    it('debe reflejar estado BAJO en producto de prueba', async () => {
      await request(app.getHttpServer())
        .post('/api/kardex')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          productoId: testProductId,
          fecha: '2026-07-08',
          tipo: 'SALIDA',
          cantidad: 3,
          observacion: 'Salida para estado BAJO',
        })
        .expect(201);

      const res = await request(app.getHttpServer())
        .get('/api/inventory?limit=100')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const item = res.body.data.items.find(
        (p: { productoId: string }) => p.productoId === testProductId,
      );
      expect(item.stockActual).toBe(9);
      expect(item.stockMinimo).toBe(10);
      expect(item.estado).toBe('BAJO');
    });

    it('debe filtrar por estado', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/inventory?estado=NORMAL')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.items.every((i: { estado: string }) => i.estado === 'NORMAL')).toBe(
        true,
      );
    });
  });
});
