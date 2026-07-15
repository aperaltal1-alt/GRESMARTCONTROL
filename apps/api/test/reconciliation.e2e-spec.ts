import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { closeE2eApp, createE2eApp } from './setup-e2e';

const ADMIN_EMAIL = 'admin@gre-demo.pe';
const SUPERVISOR_EMAIL = 'supervisor@gre-demo.pe';
const CONSULTA_EMAIL = 'consulta@gre-demo.pe';
const PASSWORD = 'Demo2024!';

describe('Reconciliation Module (e2e) — Fase 4.7', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let adminToken: string;
  let supervisorToken: string;
  let consultaToken: string;
  let empresaId: string;
  let almacenId: string;
  let ubicacionId: string;
  let testProductId: string;
  let greOkId: string;
  let greDiffId: string;
  let conciliacionOkId: string;
  let conciliacionDiffId: string;
  let incidenciaId: string;
  let alertaId: string;
  const greOkNumero = `7777${Date.now().toString().slice(-6)}`;
  const greDiffNumero = `6666${Date.now().toString().slice(-6)}`;

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

    const admin = await prisma.usuario.findUnique({
      where: { email: ADMIN_EMAIL },
      select: { empresaId: true },
    });
    empresaId = admin!.empresaId;

    const almacen = await prisma.almacen.findFirst({
      where: { empresaId },
      select: { id: true },
    });
    almacenId = almacen!.id;

    const ubicacion = await prisma.ubicacion.findFirst({
      where: { empresaId },
      select: { id: true },
    });
    ubicacionId = ubicacion!.id;

    const codigo = `TEST-REC-${Date.now()}`;
    const productRes = await request(app.getHttpServer())
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        codigo,
        nombre: 'Producto Conciliacion Test',
        categoria: 'Abarrotes',
        unidad: 'UND',
        stockActual: 100,
        stockMinimo: 10,
      })
      .expect(201);

    testProductId = productRes.body.data.id;

    await prisma.inventario.create({
      data: {
        empresaId,
        almacenId,
        productoId: testProductId,
        ubicacionId,
        cantidadKardex: 100,
        cantidadFisica: 100,
        cantidadDisponible: 100,
        cantidadReservada: 0,
      },
    });

    const greOkRes = await request(app.getHttpServer())
      .post('/api/gre')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        numero: greOkNumero,
        serie: 'T001',
        fecha: '2026-07-07',
        productos: [{ productoId: testProductId, cantidad: 100 }],
      })
      .expect(201);
    greOkId = greOkRes.body.data.id;

    const greDiffRes = await request(app.getHttpServer())
      .post('/api/gre')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        numero: greDiffNumero,
        serie: 'T001',
        fecha: '2026-07-07',
        productos: [{ productoId: testProductId, cantidad: 150 }],
      })
      .expect(201);
    greDiffId = greDiffRes.body.data.id;
  });

  afterAll(async () => {
    const greIds = [greOkId, greDiffId].filter(Boolean);
    if (greIds.length) {
      const conciliaciones = await prisma.conciliacion.findMany({
        where: { greId: { in: greIds } },
        select: { id: true },
      });
      const concIds = conciliaciones.map((c) => c.id);

      if (concIds.length) {
        await prisma.alerta.deleteMany({ where: { conciliacionId: { in: concIds } } });
        await prisma.incidencia.deleteMany({ where: { conciliacionId: { in: concIds } } });
        await prisma.historialConciliacion.deleteMany({
          where: { conciliacionId: { in: concIds } },
        });
        await prisma.conciliacion.deleteMany({ where: { id: { in: concIds } } });
      }

      await prisma.detalleGre.deleteMany({ where: { greId: { in: greIds } } });
      await prisma.gre.deleteMany({ where: { id: { in: greIds } } });
    }

    if (testProductId) {
      await prisma.inventario.deleteMany({ where: { productoId: testProductId } });
      await prisma.movimientoKardex.deleteMany({ where: { productoId: testProductId } });
      await prisma.kardex.deleteMany({ where: { productoId: testProductId } });
      await prisma.producto.deleteMany({ where: { id: testProductId } });
    }

    await prisma.$disconnect();
    await closeE2eApp(app);
  });

  describe('POST /api/reconciliation/:greId/run', () => {
    it('debe ejecutar conciliación exitosa sin diferencias', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/reconciliation/${greOkId}/run`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(201);

      expect(res.body.data.resultadoGre).toBe('CONCILIADA');
      expect(res.body.data.estado).toBe('COMPLETADA');
      expect(res.body.data.lineasConDiferencia).toBe(0);
      expect(res.body.data.incidenciasCreadas).toBe(0);
      expect(res.body.data.alertasCreadas).toBe(0);
      conciliacionOkId = res.body.data.conciliacionId;

      const gre = await request(app.getHttpServer())
        .get(`/api/gre/${greOkId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(gre.body.data.estado).toBe('CONCILIADA');
    });

    it('debe ejecutar conciliación con diferencias e incidencias', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/reconciliation/${greDiffId}/run`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .expect(201);

      expect(res.body.data.resultadoGre).toBe('CON_DIFERENCIA');
      expect(res.body.data.estado).toBe('CON_DIFERENCIAS');
      expect(res.body.data.lineasConDiferencia).toBe(1);
      expect(res.body.data.incidenciasCreadas).toBe(1);
      expect(res.body.data.alertasCreadas).toBe(1);
      conciliacionDiffId = res.body.data.conciliacionId;

      const gre = await request(app.getHttpServer())
        .get(`/api/gre/${greDiffId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(gre.body.data.estado).toBe('CON_DIFERENCIA');
    });

    it('debe rechazar ejecución por CONSULTA', async () => {
      await request(app.getHttpServer())
        .post(`/api/reconciliation/${greOkId}/run`)
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(403);
    });
  });

  describe('GET /api/reconciliation', () => {
    it('debe listar conciliaciones', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/reconciliation')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
    });

    it('debe obtener detalle con historial', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/reconciliation/${conciliacionDiffId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.lineas.length).toBe(1);
      expect(res.body.data.lineas[0].resultado).toBe('DIFERENCIA');
      expect(res.body.data.incidencias.length).toBe(1);
      expect(res.body.data.alertas.length).toBe(1);
    });
  });

  describe('GET /api/incidents', () => {
    it('debe listar incidencias generadas', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/incidents?greId=${greDiffId}`)
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
      incidenciaId = res.body.data.items[0].id;
      expect(res.body.data.items[0].estado).toBe('PENDIENTE');
    });

    it('debe resolver incidencia', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/incidents/${incidenciaId}/resolve`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .expect(200);

      expect(res.body.data.estado).toBe('RESUELTA');
    });
  });

  describe('GET /api/alerts', () => {
    it('debe listar alertas activas', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/alerts?activa=true`)
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      const alerta = res.body.data.items.find(
        (a: { conciliacionId: string }) => a.conciliacionId === conciliacionDiffId,
      );
      expect(alerta).toBeDefined();
      alertaId = alerta.id;
    });

    it('debe marcar alerta como leída', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/alerts/${alertaId}/read`)
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.leida).toBe(true);
    });
  });
});
