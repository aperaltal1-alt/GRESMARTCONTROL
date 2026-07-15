import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { closeE2eApp, createE2eApp } from './setup-e2e';

const ADMIN_EMAIL = 'admin@gre-demo.pe';
const CONSULTA_EMAIL = 'consulta@gre-demo.pe';
const PASSWORD = 'Demo2024!';

describe('Dashboard Module (e2e) — Fase 4.8', () => {
  let app: INestApplication;
  let adminToken: string;
  let consultaToken: string;

  async function login(email: string) {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: PASSWORD })
      .expect(200);

    return res.body.data.tokens.accessToken as string;
  }

  beforeAll(async () => {
    app = await createE2eApp();

    const hash = await bcrypt.hash(PASSWORD, 12);
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.usuario.updateMany({
      where: { email: { in: [ADMIN_EMAIL, CONSULTA_EMAIL] } },
      data: { activo: true, deletedAt: null, passwordHash: hash },
    });
    await prisma.$disconnect();

    adminToken = await login(ADMIN_EMAIL);
    consultaToken = await login(CONSULTA_EMAIL);
  });

  afterAll(async () => {
    await closeE2eApp(app);
  });

  function calcPercentage(part: number, total: number) {
    if (total === 0) return 0;
    return Math.round((part / total) * 10000) / 100;
  }

  function expectedRiesgoNivel(porcentaje: number) {
    if (porcentaje <= 20) return 'BAJO';
    if (porcentaje <= 50) return 'MEDIO';
    return 'ALTO';
  }

  describe('GET /api/dashboard/kpis', () => {
    it('debe retornar KPIs calculados desde datos reales', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/kpis')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      const kpis = res.body.data;

      expect(kpis.totalGre).toBeGreaterThan(0);
      expect(kpis.totalProductos).toBeGreaterThan(0);
      expect(kpis.stockTotalDisponible).toBeGreaterThanOrEqual(0);
      expect(kpis.incidenciasPendientes).toBeGreaterThanOrEqual(0);
      expect(kpis.alertasActivas).toBeGreaterThan(0);

      const nivelEsperado = calcPercentage(kpis.greConciliadas, kpis.totalGre);
      expect(kpis.nivelConciliacion).toBe(nivelEsperado);

      const riesgoEsperado = calcPercentage(kpis.greConDiferencias, kpis.totalGre);
      expect(kpis.riesgoTributario.porcentaje).toBe(riesgoEsperado);
      expect(kpis.riesgoTributario.nivel).toBe(expectedRiesgoNivel(riesgoEsperado));
    });
  });

  describe('GET /api/dashboard/summary', () => {
    it('debe retornar resumen ejecutivo con timestamp', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/summary')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.generatedAt).toBeDefined();
      expect(res.body.data.totalGre).toBeGreaterThan(0);
      expect(res.body.data.riesgoTributario.nivel).toMatch(/BAJO|MEDIO|ALTO/);
    });
  });

  describe('GET /api/dashboard/charts', () => {
    it('debe retornar datos para gráficos', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/charts?dias=30')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.grePorDia).toHaveLength(30);
      expect(res.body.data.movimientosKardexPorDia).toHaveLength(30);
      expect(res.body.data.diferenciasPorDia).toHaveLength(30);
      expect(Array.isArray(res.body.data.productosStockBajo)).toBe(true);
      expect(res.body.data.grePorDia[0]).toHaveProperty('fecha');
      expect(res.body.data.grePorDia[0]).toHaveProperty('total');
    });
  });

  describe('GET /api/dashboard/recent-gre', () => {
    it('debe listar últimas GRE', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/recent-gre?limit=5')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('numero');
      expect(res.body.data[0]).toHaveProperty('serie');
      expect(res.body.data[0]).toHaveProperty('estado');
    });
  });

  describe('GET /api/dashboard/recent-incidents', () => {
    it('debe listar últimas incidencias', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/recent-incidents?limit=5')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data[0]).toHaveProperty('tipo');
      expect(res.body.data[0]).toHaveProperty('diferencia');
    });
  });

  describe('GET /api/dashboard/recent-alerts', () => {
    it('debe listar últimas alertas activas', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/recent-alerts?limit=5')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data.every((a: { leida: boolean }) => typeof a.leida === 'boolean')).toBe(
        true,
      );
    });
  });

  describe('GET /api/dashboard/critical-products', () => {
    it('debe listar productos críticos', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/dashboard/critical-products')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(res.body.data)).toBe(true);
      if (res.body.data.length > 0) {
        expect(['BAJO', 'SIN STOCK']).toContain(res.body.data[0].estado);
        expect(res.body.data[0].stockActual).toBeLessThanOrEqual(
          res.body.data[0].stockMinimo,
        );
      }
    });
  });

  describe('Seguridad', () => {
    it('debe rechazar acceso sin autenticación', async () => {
      await request(app.getHttpServer()).get('/api/dashboard/kpis').expect(401);
    });
  });
});
