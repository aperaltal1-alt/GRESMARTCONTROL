import { INestApplication } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { closeE2eApp, createE2eApp } from './setup-e2e';

const ADMIN_EMAIL = 'admin@gre-demo.pe';
const SUPERVISOR_EMAIL = 'supervisor@gre-demo.pe';
const CONSULTA_EMAIL = 'consulta@gre-demo.pe';
const PASSWORD = 'Demo2024!';

describe('GRE Module (e2e) — Fase 4.5', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let adminToken: string;
  let supervisorToken: string;
  let consultaToken: string;
  let productoId: string;
  let createdGreId: string;
  const testNumero = `8888${Date.now().toString().slice(-6)}`;

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

    const producto = await prisma.producto.findFirst({
      where: { codigo: 'ARROZ-001', deletedAt: null },
      select: { id: true },
    });
    if (!producto) {
      throw new Error('Producto demo ARROZ-001 no encontrado. Ejecute db:seed.');
    }
    productoId = producto.id;
  });

  afterAll(async () => {
    const testGres = await prisma.gre.findMany({
      where: { numero: { startsWith: '8888' } },
      select: { id: true },
    });
    const ids = testGres.map((g) => g.id);
    if (ids.length) {
      await prisma.archivoGre.deleteMany({ where: { greId: { in: ids } } });
      await prisma.detalleGre.deleteMany({ where: { greId: { in: ids } } });
      await prisma.gre.deleteMany({ where: { id: { in: ids } } });
    }
    await prisma.$disconnect();
    await closeE2eApp(app);
  });

  describe('POST /api/gre', () => {
    it('debe crear una GRE con productos', async () => {
      const res = await request(app.getHttpServer())
        .post('/api/gre')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          numero: testNumero,
          serie: 'T001',
          fecha: '2026-07-07',
          transportista: 'Transportes Test S.A.C.',
          origen: 'Lima',
          destino: 'Arequipa',
          observaciones: 'GRE de prueba MVP',
          productos: [{ productoId, cantidad: 15 }],
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.numero).toBe(testNumero);
      expect(res.body.data.serie).toBe('T001');
      expect(res.body.data.estado).toBe('PENDIENTE');
      expect(res.body.data.productos).toHaveLength(1);
      expect(res.body.data.productos[0].cantidad).toBe(15);
      createdGreId = res.body.data.id;
    });

    it('debe rechazar número duplicado por serie', async () => {
      await request(app.getHttpServer())
        .post('/api/gre')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          numero: testNumero,
          serie: 'T001',
          fecha: '2026-07-07',
          productos: [{ productoId, cantidad: 5 }],
        })
        .expect(409);
    });

    it('debe rechazar creación por CONSULTA', async () => {
      await request(app.getHttpServer())
        .post('/api/gre')
        .set('Authorization', `Bearer ${consultaToken}`)
        .send({
          numero: '88877766',
          serie: 'T001',
          fecha: '2026-07-07',
          productos: [{ productoId, cantidad: 1 }],
        })
        .expect(403);
    });
  });

  describe('GET /api/gre', () => {
    it('debe listar GRE', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/gre')
        .set('Authorization', `Bearer ${consultaToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.meta.total).toBeGreaterThan(0);
    });

    it('debe buscar por número', async () => {
      const res = await request(app.getHttpServer())
        .get(`/api/gre?numero=${testNumero}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(
        res.body.data.items.some((g: { numero: string }) => g.numero === testNumero),
      ).toBe(true);
    });

    it('debe filtrar por serie y estado', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/gre?serie=T001&estado=PENDIENTE')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.items.length).toBeGreaterThan(0);
      expect(res.body.data.items.every((g: { serie: string }) => g.serie === 'T001')).toBe(
        true,
      );
    });
  });

  describe('PATCH /api/gre/:id', () => {
    it('debe editar GRE (SUPERVISOR)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/gre/${createdGreId}`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .send({
          transportista: 'Logística Editada S.R.L.',
          observaciones: 'Observación editada',
          productos: [{ productoId, cantidad: 20 }],
        })
        .expect(200);

      expect(res.body.data.transportista).toBe('Logística Editada S.R.L.');
      expect(res.body.data.observaciones).toBe('Observación editada');
      expect(res.body.data.productos[0].cantidad).toBe(20);
    });

    it('debe rechazar edición por CONSULTA', async () => {
      await request(app.getHttpServer())
        .patch(`/api/gre/${createdGreId}`)
        .set('Authorization', `Bearer ${consultaToken}`)
        .send({ observaciones: 'No permitido' })
        .expect(403);
    });
  });

  describe('POST /api/gre/:id/upload', () => {
    it('debe subir archivo XML', async () => {
      const res = await request(app.getHttpServer())
        .post(`/api/gre/${createdGreId}/upload`)
        .set('Authorization', `Bearer ${adminToken}`)
        .attach(
          'file',
          Buffer.from('<?xml version="1.0"?><GRE><test>true</test></GRE>'),
          'GRE-test.xml',
        )
        .expect(201);

      expect(res.body.data.tipo).toBe('XML');
      expect(res.body.data.nombreOriginal).toBe('GRE-test.xml');
    });

    it('debe subir archivo PDF', async () => {
      const pdfHeader = Buffer.from('%PDF-1.4 test content');
      const res = await request(app.getHttpServer())
        .post(`/api/gre/${createdGreId}/upload`)
        .set('Authorization', `Bearer ${supervisorToken}`)
        .attach('file', pdfHeader, 'GRE-test.pdf')
        .expect(201);

      expect(res.body.data.tipo).toBe('PDF');
      expect(res.body.data.nombreOriginal).toBe('GRE-test.pdf');
    });

    it('debe rechazar subida por CONSULTA', async () => {
      await request(app.getHttpServer())
        .post(`/api/gre/${createdGreId}/upload`)
        .set('Authorization', `Bearer ${consultaToken}`)
        .attach('file', Buffer.from('<xml/>'), 'no-permitido.xml')
        .expect(403);
    });
  });

  describe('DELETE /api/gre/:id', () => {
    it('debe desactivar GRE (soft delete)', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/api/gre/${createdGreId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.data.message).toContain('desactivada');

      await request(app.getHttpServer())
        .get(`/api/gre/${createdGreId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});
