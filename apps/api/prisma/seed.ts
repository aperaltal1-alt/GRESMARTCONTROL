/**
 * GRE SMART CONTROL — Seed de demostración
 * Datos coherentes con el prototipo UI/UX (Fase 2.5)
 *
 * Credenciales demo:
 *   admin@gre-demo.pe      / Demo2024!
 *   supervisor@gre-demo.pe / Demo2024!
 *   consulta@gre-demo.pe   / Demo2024!
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

const DEMO_PASSWORD = 'Demo2024!';

// ─── Utilidades ───────────────────────────────────────────────────────────────

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

function dec(value: number): Prisma.Decimal {
  return new Prisma.Decimal(value);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function hoursAgo(n: number): Date {
  const d = new Date();
  d.setHours(d.getHours() - n);
  return d;
}

// ─── 1. Catálogo SUNAT ────────────────────────────────────────────────────────

async function seedCatalogoSunat() {
  const catalogos = [
    { tipo: 'TIPO_DOCUMENTO' as const, codigo: '09', nombre: 'Guía de Remisión Remitente', descripcion: 'GRE electrónica' },
    { tipo: 'TIPO_DOCUMENTO' as const, codigo: '31', nombre: 'Guía de Remisión Transportista', descripcion: 'GRT electrónica' },
    { tipo: 'MOTIVO_TRASLADO' as const, codigo: '01', nombre: 'Venta', descripcion: 'Traslado por venta' },
    { tipo: 'MOTIVO_TRASLADO' as const, codigo: '04', nombre: 'Traslado entre establecimientos', descripcion: 'Mismo empresa' },
    { tipo: 'MOTIVO_TRASLADO' as const, codigo: '13', nombre: 'Otros', descripcion: 'Otros motivos no contemplados' },
    { tipo: 'UNIDAD_SUNAT' as const, codigo: 'NIU', nombre: 'Unidad (bienes)', descripcion: 'Unidad de bienes' },
    { tipo: 'UNIDAD_SUNAT' as const, codigo: 'KGM', nombre: 'Kilogramo', descripcion: 'Kilogramo' },
    { tipo: 'UNIDAD_SUNAT' as const, codigo: 'LTR', nombre: 'Litro', descripcion: 'Litro' },
    { tipo: 'ESTADO_CPE' as const, codigo: '0', nombre: 'NO EXISTE', descripcion: 'Comprobante no existe en SUNAT' },
    { tipo: 'ESTADO_CPE' as const, codigo: '1', nombre: 'ACEPTADO', descripcion: 'Comprobante aceptado' },
    { tipo: 'ESTADO_CPE' as const, codigo: '2', nombre: 'ANULADO', descripcion: 'Comprobante anulado' },
    { tipo: 'TIPO_TRANSPORTE' as const, codigo: '01', nombre: 'Transporte público', descripcion: 'Medio de transporte público' },
    { tipo: 'TIPO_TRANSPORTE' as const, codigo: '02', nombre: 'Transporte privado', descripcion: 'Medio de transporte privado' },
  ];

  for (const cat of catalogos) {
    await prisma.catalogoSunat.create({ data: cat });
  }

  console.log(`  ✓ CatalogoSunat: ${catalogos.length} registros`);
}

// ─── 2. Roles y Permisos ──────────────────────────────────────────────────────

async function seedRolesPermisos() {
  const permisosData = [
    { codigo: 'gre.read', modulo: 'GRE', accion: 'READ' as const, descripcion: 'Ver guías de remisión' },
    { codigo: 'gre.create', modulo: 'GRE', accion: 'CREATE' as const, descripcion: 'Crear guías de remisión' },
    { codigo: 'gre.update', modulo: 'GRE', accion: 'UPDATE' as const, descripcion: 'Editar guías de remisión' },
    { codigo: 'gre.delete', modulo: 'GRE', accion: 'DELETE' as const, descripcion: 'Eliminar guías de remisión' },
    { codigo: 'productos.read', modulo: 'PRODUCTOS', accion: 'READ' as const, descripcion: 'Ver productos' },
    { codigo: 'productos.create', modulo: 'PRODUCTOS', accion: 'CREATE' as const, descripcion: 'Crear productos' },
    { codigo: 'productos.update', modulo: 'PRODUCTOS', accion: 'UPDATE' as const, descripcion: 'Editar productos' },
    { codigo: 'kardex.read', modulo: 'KARDEX', accion: 'READ' as const, descripcion: 'Ver movimientos kardex' },
    { codigo: 'kardex.create', modulo: 'KARDEX', accion: 'CREATE' as const, descripcion: 'Registrar movimientos' },
    { codigo: 'conciliacion.execute', modulo: 'CONCILIACION', accion: 'EXECUTE' as const, descripcion: 'Ejecutar conciliación triple' },
    { codigo: 'conciliacion.read', modulo: 'CONCILIACION', accion: 'READ' as const, descripcion: 'Ver conciliaciones' },
    { codigo: 'config.manage', modulo: 'CONFIG', accion: 'UPDATE' as const, descripcion: 'Gestionar configuración' },
    { codigo: 'usuarios.manage', modulo: 'USUARIOS', accion: 'UPDATE' as const, descripcion: 'Gestionar usuarios' },
    { codigo: 'reportes.export', modulo: 'REPORTES', accion: 'EXPORT' as const, descripcion: 'Exportar reportes' },
    { codigo: 'dashboard.read', modulo: 'DASHBOARD', accion: 'READ' as const, descripcion: 'Ver dashboards' },
  ];

  const permisos: Record<string, string> = {};
  for (const p of permisosData) {
    const perm = await prisma.permiso.create({ data: p });
    permisos[p.codigo] = perm.id;
  }

  const rolesData = [
    { codigo: 'ADMIN', nombre: 'Administrador', descripcion: 'Acceso total al sistema', esSistema: true },
    { codigo: 'SUPERVISOR', nombre: 'Supervisor', descripcion: 'Operaciones y conciliación', esSistema: true },
    { codigo: 'CONSULTA', nombre: 'Consulta', descripcion: 'Solo lectura', esSistema: true },
  ];

  const roles: Record<string, string> = {};
  for (const r of rolesData) {
    const rol = await prisma.rol.create({
      data: { ...r, empresaId: null },
    });
    roles[r.codigo] = rol.id;
  }

  const asignaciones: Record<string, string[]> = {
    ADMIN: Object.keys(permisos),
    SUPERVISOR: [
      'gre.read', 'gre.create', 'gre.update', 'productos.read', 'productos.create',
      'productos.update', 'kardex.read', 'kardex.create', 'conciliacion.execute',
      'conciliacion.read', 'reportes.export', 'dashboard.read',
    ],
    CONSULTA: [
      'gre.read', 'productos.read', 'kardex.read', 'conciliacion.read',
      'reportes.export', 'dashboard.read',
    ],
  };

  for (const [rolCodigo, permCodigos] of Object.entries(asignaciones)) {
    for (const permCodigo of permCodigos) {
      await prisma.rolPermiso.create({
        data: { rolId: roles[rolCodigo], permisoId: permisos[permCodigo] },
      });
    }
  }

  console.log(`  ✓ Roles: 3 | Permisos: ${permisosData.length}`);
  return roles;
}

// ─── 3. Empresa Demo ──────────────────────────────────────────────────────────

async function seedEmpresa() {
  const empresa = await prisma.empresa.create({
    data: {
      ruc: '20123456789',
      razonSocial: 'GRE Demo S.A.C.',
      nombreComercial: 'GRE Smart Control Demo',
      direccion: 'Av. Industrial 1234, Lima',
      telefono: '+51 1 4567890',
      email: 'contacto@gre-demo.pe',
      plan: 'MVP',
      activo: true,
    },
  });

  console.log(`  ✓ Empresa: ${empresa.razonSocial}`);
  return empresa;
}

// ─── 4. Almacén Principal y Ubicaciones ───────────────────────────────────────

async function seedAlmacenUbicaciones(empresaId: string) {
  const almacen = await prisma.almacen.upsert({
    where: { codigo_empresaId: { codigo: 'ALM-PRINCIPAL', empresaId } },
    update: {},
    create: {
      empresaId,
      codigo: 'ALM-PRINCIPAL',
      nombre: 'Almacén Principal',
      direccion: 'Av. Industrial 1234, Zona Industrial, Lima',
      esPrincipal: true,
      activo: true,
    },
  });

  const ubicacionesData = [
    { codigo: 'RECEPCION', nombre: 'Zona de Recepción', tipo: 'RECEPCION' as const },
    { codigo: 'PICKING-A', nombre: 'Picking A — Granos', tipo: 'ZONA' as const },
    { codigo: 'PICKING-B', nombre: 'Picking B — Lácteos', tipo: 'ZONA' as const },
    { codigo: 'DESPACHO', nombre: 'Zona de Despacho', tipo: 'DESPACHO' as const },
    { codigo: 'EST-A01', nombre: 'Estante A-01', tipo: 'ESTANTE' as const },
  ];

  const ubicaciones: Record<string, string> = {};
  for (const u of ubicacionesData) {
    const ubic = await prisma.ubicacion.upsert({
      where: { codigo_almacenId: { codigo: u.codigo, almacenId: almacen.id } },
      update: {},
      create: { empresaId, almacenId: almacen.id, ...u },
    });
    ubicaciones[u.codigo] = ubic.id;
  }

  console.log(`  ✓ Almacén Principal + ${ubicacionesData.length} ubicaciones`);
  return { almacen, ubicaciones };
}

// ─── 5. Usuarios ──────────────────────────────────────────────────────────────

async function seedUsuarios(empresaId: string, roles: Record<string, string>) {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const usuariosData = [
    { email: 'admin@gre-demo.pe', nombre: 'Juan', apellido: 'Pérez', rol: 'ADMIN' },
    { email: 'supervisor@gre-demo.pe', nombre: 'María', apellido: 'García', rol: 'SUPERVISOR' },
    { email: 'consulta@gre-demo.pe', nombre: 'Carlos', apellido: 'López', rol: 'CONSULTA' },
  ];

  const usuarios: Record<string, string> = {};
  for (const u of usuariosData) {
    const user = await prisma.usuario.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        passwordHash,
        nombre: u.nombre,
        apellido: u.apellido,
        rolId: roles[u.rol],
        empresaId,
        activo: true,
      },
    });
    usuarios[u.rol] = user.id;
  }

  console.log(`  ✓ Usuarios: ${usuariosData.length} (password: ${DEMO_PASSWORD})`);
  return usuarios;
}

// ─── 6. Catálogos: Categorías y Unidades ──────────────────────────────────────

async function seedCatalogos(empresaId: string) {
  const categoriasData = [
    { codigo: 'GRA', nombre: 'Granos y Cereales' },
    { codigo: 'LAC', nombre: 'Lácteos' },
    { codigo: 'ABA', nombre: 'Abarrotes' },
    { codigo: 'LIM', nombre: 'Limpieza' },
    { codigo: 'BEB', nombre: 'Bebidas' },
  ];

  const categorias: Record<string, string> = {};
  for (const c of categoriasData) {
    const cat = await prisma.categoria.upsert({
      where: { codigo_empresaId: { codigo: c.codigo, empresaId } },
      update: {},
      create: { empresaId, ...c },
    });
    categorias[c.codigo] = cat.id;
  }

  const unidadesData = [
    { codigo: 'UND', nombre: 'Unidad', simbolo: 'u', empresaId: null },
    { codigo: 'KG', nombre: 'Kilogramo', simbolo: 'kg', empresaId: null },
    { codigo: 'LT', nombre: 'Litro', simbolo: 'L', empresaId: null },
    { codigo: 'CJ', nombre: 'Caja', simbolo: 'cj', empresaId: null },
    { codigo: 'SAC', nombre: 'Saco', simbolo: 'sac', empresaId: null },
  ];

  const unidades: Record<string, string> = {};
  for (const u of unidadesData) {
    const uni = await prisma.unidadMedida.create({ data: u });
    unidades[u.codigo] = uni.id;
  }

  console.log(`  ✓ Categorías: ${categoriasData.length} | Unidades: ${unidadesData.length}`);
  return { categorias, unidades };
}

// ─── 7. Proveedor y Cliente ───────────────────────────────────────────────────

async function seedProveedorCliente(empresaId: string) {
  const proveedor = await prisma.proveedor.upsert({
    where: { ruc_empresaId: { ruc: '20555666777', empresaId } },
    update: {},
    create: {
      empresaId,
      ruc: '20555666777',
      razonSocial: 'Distribuidora Norte S.A.C.',
      nombreComercial: 'DistriNorte',
      direccion: 'Av. Túpac Amaru 5678, Lima',
      telefono: '+51 1 2345678',
      correo: 'ventas@distrinorte.pe',
      estado: 'ACTIVO',
    },
  });

  const cliente = await prisma.cliente.upsert({
    where: { ruc_empresaId: { ruc: '20999888777', empresaId } },
    update: {},
    create: {
      empresaId,
      ruc: '20999888777',
      razonSocial: 'Supermercados del Sur S.A.',
      nombreComercial: 'SuperSur',
      direccion: 'Calle Comercio 321, Arequipa',
      telefono: '+51 54 789012',
      correo: 'compras@supersur.pe',
      estado: 'ACTIVO',
    },
  });

  console.log(`  ✓ Proveedor: ${proveedor.nombreComercial} | Cliente: ${cliente.nombreComercial}`);
  return { proveedor, cliente };
}

// ─── 8. Productos, Kardex, Inventario, Movimientos ────────────────────────────

interface ProductoSeed {
  codigo: string;
  nombre: string;
  categoria: string;
  unidad: string;
  stockMinimo: number;
  saldoKardex: number;
  stockFisico: number;
  ubicacion: string;
}

async function seedProductosInventario(
  empresaId: string,
  almacenId: string,
  ubicaciones: Record<string, string>,
  categorias: Record<string, string>,
  unidades: Record<string, string>,
  adminId: string,
) {
  const productosData: ProductoSeed[] = [
    { codigo: 'ARROZ-001', nombre: 'Arroz Extra Premium 5kg', categoria: 'GRA', unidad: 'SAC', stockMinimo: 50, saldoKardex: 320, stockFisico: 315, ubicacion: 'PICKING-A' },
    { codigo: 'ARROZ-002', nombre: 'Arroz Superior 1kg', categoria: 'GRA', unidad: 'UND', stockMinimo: 100, saldoKardex: 480, stockFisico: 475, ubicacion: 'PICKING-A' },
    { codigo: 'AZUCAR-001', nombre: 'Azúcar Rubia 1kg', categoria: 'ABA', unidad: 'UND', stockMinimo: 80, saldoKardex: 200, stockFisico: 198, ubicacion: 'PICKING-A' },
    { codigo: 'LECHE-001', nombre: 'Leche Evaporada 400ml', categoria: 'LAC', unidad: 'UND', stockMinimo: 60, saldoKardex: 150, stockFisico: 148, ubicacion: 'PICKING-B' },
    { codigo: 'LECHE-002', nombre: 'Leche Condensada 393g', categoria: 'LAC', unidad: 'UND', stockMinimo: 40, saldoKardex: 95, stockFisico: 92, ubicacion: 'PICKING-B' },
    { codigo: 'ACEITE-001', nombre: 'Aceite Vegetal 1L', categoria: 'ABA', unidad: 'UND', stockMinimo: 50, saldoKardex: 180, stockFisico: 175, ubicacion: 'EST-A01' },
    { codigo: 'FIDEO-001', nombre: 'Fideos Spaghetti 500g', categoria: 'ABA', unidad: 'UND', stockMinimo: 70, saldoKardex: 250, stockFisico: 248, ubicacion: 'EST-A01' },
    { codigo: 'ATUN-001', nombre: 'Atún en Aceite 170g', categoria: 'ABA', unidad: 'UND', stockMinimo: 30, saldoKardex: 12, stockFisico: 10, ubicacion: 'EST-A01' },
    { codigo: 'GASEO-001', nombre: 'Gaseosa Cola 3L', categoria: 'BEB', unidad: 'UND', stockMinimo: 40, saldoKardex: 85, stockFisico: 85, ubicacion: 'DESPACHO' },
    { codigo: 'DETER-001', nombre: 'Detergente Líquido 1L', categoria: 'LIM', unidad: 'UND', stockMinimo: 25, saldoKardex: 45, stockFisico: 42, ubicacion: 'DESPACHO' },
  ];

  const productos: Record<string, { id: string; kardexId: string }> = {};

  for (const p of productosData) {
    const producto = await prisma.producto.upsert({
      where: { codigo_empresaId: { codigo: p.codigo, empresaId } },
      update: {},
      create: {
        empresaId,
        categoriaId: categorias[p.categoria],
        unidadMedidaId: unidades[p.unidad],
        codigo: p.codigo,
        nombre: p.nombre,
        stockMinimo: dec(p.stockMinimo),
        activo: true,
      },
    });

    const kardex = await prisma.kardex.upsert({
      where: { productoId: producto.id },
      update: { saldoActual: dec(p.saldoKardex), ultimoMovimientoAt: daysAgo(2) },
      create: {
        empresaId,
        productoId: producto.id,
        saldoActual: dec(p.saldoKardex),
        ultimoMovimientoAt: daysAgo(2),
      },
    });

    const ubicacionId = ubicaciones[p.ubicacion];
    await prisma.inventario.upsert({
      where: { productoId_ubicacionId: { productoId: producto.id, ubicacionId } },
      update: {
        cantidadKardex: dec(p.saldoKardex),
        cantidadFisica: dec(p.stockFisico),
        cantidadDisponible: dec(p.saldoKardex),
        ultimaActualizacion: new Date(),
      },
      create: {
        empresaId,
        almacenId,
        productoId: producto.id,
        ubicacionId,
        cantidadKardex: dec(p.saldoKardex),
        cantidadFisica: dec(p.stockFisico),
        cantidadDisponible: dec(p.saldoKardex),
        cantidadReservada: dec(0),
      },
    });

    await prisma.movimientoKardex.create({
      data: {
        kardexId: kardex.id,
        productoId: producto.id,
        empresaId,
        ubicacionId,
        tipo: 'ENTRADA',
        cantidad: dec(p.saldoKardex),
        saldoAnterior: dec(0),
        saldoNuevo: dec(p.saldoKardex),
        referencia: 'INV-INICIAL',
        referenciaTipo: 'AJUSTE',
        observacion: 'Stock inicial de demostración',
        usuarioId: adminId,
        createdAt: daysAgo(30),
      },
    });

    await prisma.stockFisico.create({
      data: {
        empresaId,
        productoId: producto.id,
        ubicacionId,
        cantidad: dec(p.stockFisico),
        fechaConteo: daysAgo(1),
        metodo: 'MANUAL',
        observacion: 'Conteo físico inicial demo',
        usuarioId: adminId,
      },
    });

    productos[p.codigo] = { id: producto.id, kardexId: kardex.id };
  }

  console.log(`  ✓ Productos: ${productosData.length} | Kardex | Inventario | Movimientos | Stock Físico`);
  return productos;
}

// ─── 9. Documentos GRE ────────────────────────────────────────────────────────

async function seedGre(
  empresaId: string,
  adminId: string,
  supervisorId: string,
  proveedorId: string,
  clienteId: string,
  productos: Record<string, { id: string }>,
) {
  const catSunatGre = await prisma.catalogoSunat.findFirst({ where: { tipo: 'TIPO_DOCUMENTO', codigo: '09' } });

  const tipoDoc = await prisma.tipoDocumento.upsert({
    where: { codigo_empresaId: { codigo: 'GRE', empresaId } },
    update: {},
    create: {
      empresaId,
      catalogoSunatId: catSunatGre?.id,
      codigo: 'GRE',
      nombre: 'Guía de Remisión Electrónica',
      codigoSunat: '09',
    },
  });

  const serie = await prisma.serie.upsert({
    where: { codigo_empresaId: { codigo: 'T001', empresaId } },
    update: { correlativoActual: 3 },
    create: {
      empresaId,
      tipoDocumentoId: tipoDoc.id,
      codigo: 'T001',
      correlativoActual: 3,
    },
  });

  const estados = [
    { codigo: 'PENDIENTE', nombre: 'Pendiente', color: '#F59E0B' },
    { codigo: 'CONCILIADA', nombre: 'Conciliada', color: '#22C55E' },
    { codigo: 'CON_DIFERENCIA', nombre: 'Con Diferencia', color: '#EF4444' },
    { codigo: 'ANULADA', nombre: 'Anulada', color: '#64748B' },
  ];

  const estadosMap: Record<string, string> = {};
  for (const e of estados) {
    const est = await prisma.estadoDocumento.upsert({
      where: { codigo_empresaId_tipoDocumentoId: { codigo: e.codigo, empresaId, tipoDocumentoId: tipoDoc.id } },
      update: {},
      create: { empresaId, tipoDocumentoId: tipoDoc.id, ...e },
    });
    estadosMap[e.codigo] = est.id;
  }

  // GRE 1 — Conciliada (ARROZ-001, GASEO-001)
  const gre1 = await prisma.gre.create({
    data: {
      empresaId,
      tipoDocumentoId: tipoDoc.id,
      serieId: serie.id,
      numero: '00000001',
      fechaEmision: daysAgo(5),
      rucEmisor: '20123456789',
      rucDestinatario: '20999888777',
      proveedorId,
      clienteId,
      transportista: 'Transportes Rápidos S.A.C.',
      origen: 'Av. Industrial 1234, Lima',
      destino: 'Calle Comercio 321, Arequipa',
      estado: 'CONCILIADA',
      estadoDocumentoId: estadosMap['CONCILIADA'],
      estadoSunat: 'NO_ENVIADO',
      createdById: adminId,
      detalles: {
        create: [
          { productoId: productos['ARROZ-001'].id, codigoProducto: 'ARROZ-001', descripcion: 'Arroz Extra Premium 5kg', cantidad: dec(100), orden: 1 },
          { productoId: productos['GASEO-001'].id, codigoProducto: 'GASEO-001', descripcion: 'Gaseosa Cola 3L', cantidad: dec(50), orden: 2 },
        ],
      },
    },
    include: { detalles: true },
  });

  // GRE 2 — Con diferencia (ARROZ-001 con diff, ATUN-001 stock bajo)
  const gre2 = await prisma.gre.create({
    data: {
      empresaId,
      tipoDocumentoId: tipoDoc.id,
      serieId: serie.id,
      numero: '00000002',
      fechaEmision: daysAgo(2),
      rucEmisor: '20123456789',
      rucDestinatario: '20999888777',
      proveedorId,
      clienteId,
      transportista: 'Logística Express S.R.L.',
      origen: 'Av. Industrial 1234, Lima',
      destino: 'Av. Ejército 456, Trujillo',
      estado: 'CON_DIFERENCIA',
      estadoDocumentoId: estadosMap['CON_DIFERENCIA'],
      estadoSunat: 'NO_ENVIADO',
      createdById: supervisorId,
      detalles: {
        create: [
          { productoId: productos['ARROZ-001'].id, codigoProducto: 'ARROZ-001', descripcion: 'Arroz Extra Premium 5kg', cantidad: dec(100), orden: 1 },
          { productoId: productos['ATUN-001'].id, codigoProducto: 'ATUN-001', descripcion: 'Atún en Aceite 170g', cantidad: dec(30), orden: 2 },
          { productoId: productos['LECHE-001'].id, codigoProducto: 'LECHE-001', descripcion: 'Leche Evaporada 400ml', cantidad: dec(48), orden: 3 },
        ],
      },
    },
    include: { detalles: true },
  });

  // GRE 3 — Pendiente
  const gre3 = await prisma.gre.create({
    data: {
      empresaId,
      tipoDocumentoId: tipoDoc.id,
      serieId: serie.id,
      numero: '00000003',
      fechaEmision: new Date(),
      rucEmisor: '20123456789',
      proveedorId,
      transportista: 'Distribuidora Norte S.A.C.',
      origen: 'Av. Industrial 1234, Lima',
      destino: 'Av. La Marina 789, Lima',
      estado: 'PENDIENTE',
      estadoDocumentoId: estadosMap['PENDIENTE'],
      createdById: adminId,
      detalles: {
        create: [
          { productoId: productos['ACEITE-001'].id, codigoProducto: 'ACEITE-001', descripcion: 'Aceite Vegetal 1L', cantidad: dec(60), orden: 1 },
          { productoId: productos['FIDEO-001'].id, codigoProducto: 'FIDEO-001', descripcion: 'Fideos Spaghetti 500g', cantidad: dec(40), orden: 2 },
        ],
      },
    },
    include: { detalles: true },
  });

  // Archivos XML demo
  const xmlContent1 = '<?xml version="1.0"?><GRE><serie>T001</serie><numero>00000001</numero></GRE>';
  await prisma.archivoGre.create({
    data: {
      greId: gre1.id,
      tipo: 'XML',
      nombreOriginal: 'GRE-T001-00000001.xml',
      nombreAlmacenado: `${gre1.id}.xml`,
      ruta: `./uploads/${gre1.id}.xml`,
      mimeType: 'application/xml',
      tamanoBytes: BigInt(xmlContent1.length),
      hashSha256: sha256(xmlContent1),
      procesado: true,
      contenidoParseado: { serie: 'T001', numero: '00000001', items: 2 },
      usuarioId: adminId,
    },
  });

  const xmlContent2 = '<?xml version="1.0"?><GRE><serie>T001</serie><numero>00000002</numero></GRE>';
  await prisma.archivoGre.create({
    data: {
      greId: gre2.id,
      tipo: 'XML',
      nombreOriginal: 'GRE-T001-00000002.xml',
      nombreAlmacenado: `${gre2.id}.xml`,
      ruta: `./uploads/${gre2.id}.xml`,
      mimeType: 'application/xml',
      tamanoBytes: BigInt(xmlContent2.length),
      hashSha256: sha256(xmlContent2),
      procesado: true,
      contenidoParseado: { serie: 'T001', numero: '00000002', items: 3 },
      usuarioId: supervisorId,
    },
  });

  console.log(`  ✓ GRE: 3 documentos | Archivos XML: 2 | Serie T001`);
  return { gre1, gre2, gre3, tipoDoc };
}

// ─── 10. Conciliaciones, Historial, Incidencias, Alertas ──────────────────────

async function seedConciliacion(
  empresaId: string,
  adminId: string,
  supervisorId: string,
  gres: { gre1: { id: string; detalles: { id: string; productoId: string | null; cantidad: Prisma.Decimal }[] }; gre2: { id: string; detalles: { id: string; productoId: string | null; cantidad: Prisma.Decimal }[] } },
  productos: Record<string, { id: string }>,
) {
  // Conciliación GRE-1 — Todo OK
  const conc1 = await prisma.conciliacion.create({
    data: {
      empresaId,
      greId: gres.gre1.id,
      version: 1,
      estado: 'COMPLETADA',
      metodo: 'AUTOMATICO',
      totalLineas: 2,
      lineasOk: 2,
      lineasConDiferencia: 0,
      ejecutadoPorId: adminId,
      iniciadoAt: daysAgo(4),
      completadoAt: daysAgo(4),
      duracionMs: 320,
    },
  });

  for (const det of gres.gre1.detalles) {
    if (!det.productoId) continue;
    await prisma.historialConciliacion.create({
      data: {
        conciliacionId: conc1.id,
        productoId: det.productoId,
        detalleGreId: det.id,
        cantidadGre: det.cantidad,
        cantidadKardex: det.cantidad,
        cantidadFisico: det.cantidad,
        diffGreKardex: dec(0),
        diffGreFisico: dec(0),
        diffKardexFisico: dec(0),
        resultado: 'OK',
      },
    });
  }

  // Conciliación GRE-2 — Con diferencias
  const conc2 = await prisma.conciliacion.create({
    data: {
      empresaId,
      greId: gres.gre2.id,
      version: 1,
      estado: 'CON_DIFERENCIAS',
      metodo: 'AUTOMATICO',
      totalLineas: 3,
      lineasOk: 1,
      lineasConDiferencia: 2,
      ejecutadoPorId: supervisorId,
      iniciadoAt: daysAgo(1),
      completadoAt: daysAgo(1),
      duracionMs: 580,
    },
  });

  const gre2Snapshots = [
    { codigo: 'ARROZ-001', cantidadGre: 100, cantidadKardex: 320, cantidadFisico: 315, diffGK: -220, diffGF: -215, diffKF: 5, resultado: 'DIFERENCIA' as const, tipo: 'GRE_KARDEX' as const },
    { codigo: 'ATUN-001', cantidadGre: 30, cantidadKardex: 12, cantidadFisico: 10, diffGK: 18, diffGF: 20, diffKF: 2, resultado: 'DIFERENCIA' as const, tipo: 'GRE_FISICO' as const },
    { codigo: 'LECHE-001', cantidadGre: 48, cantidadKardex: 150, cantidadFisico: 148, diffGK: -102, diffGF: -100, diffKF: 2, resultado: 'OK' as const, tipo: null },
  ];

  for (let i = 0; i < gres.gre2.detalles.length; i++) {
    const det = gres.gre2.detalles[i];
    const snap = gre2Snapshots[i];
    if (!det.productoId) continue;

    const historial = await prisma.historialConciliacion.create({
      data: {
        conciliacionId: conc2.id,
        productoId: det.productoId,
        detalleGreId: det.id,
        cantidadGre: dec(snap.cantidadGre),
        cantidadKardex: dec(snap.cantidadKardex),
        cantidadFisico: dec(snap.cantidadFisico),
        diffGreKardex: dec(snap.diffGK),
        diffGreFisico: dec(snap.diffGF),
        diffKardexFisico: dec(snap.diffKF),
        resultado: snap.resultado,
      },
    });

    if (snap.resultado === 'DIFERENCIA' && snap.tipo) {
      const incidencia = await prisma.incidencia.create({
        data: {
          empresaId,
          greId: gres.gre2.id,
          productoId: det.productoId,
          conciliacionId: conc2.id,
          historialConciliacionId: historial.id,
          tipo: snap.tipo,
          cantidadGre: dec(snap.cantidadGre),
          cantidadKardex: dec(snap.cantidadKardex),
          cantidadFisico: dec(snap.cantidadFisico),
          diferencia: dec(Math.max(Math.abs(snap.diffGK), Math.abs(snap.diffGF), Math.abs(snap.diffKF))),
          estado: 'PENDIENTE',
          prioridad: snap.codigo === 'ATUN-001' ? 'ALTA' : 'MEDIA',
          observacion: `Diferencia detectada en ${snap.codigo} — requiere revisión`,
        },
      });

      await prisma.alerta.create({
        data: {
          empresaId,
          tipo: snap.tipo === 'GRE_KARDEX' ? 'DIFERENCIA_GRE' : 'DIFERENCIA_FISICO',
          nivel: 'WARNING',
          mensaje: `Diferencia ${snap.tipo} en producto ${snap.codigo} — GRE T001-00000002`,
          productoId: det.productoId,
          greId: gres.gre2.id,
          conciliacionId: conc2.id,
          incidenciaId: incidencia.id,
          activa: true,
          leida: false,
        },
      });
    }
  }

  // Alertas adicionales del prototipo
  await prisma.alerta.create({
    data: {
      empresaId,
      tipo: 'STOCK_MINIMO',
      nivel: 'ERROR',
      mensaje: 'Stock crítico: Atún en Aceite 170g (ATUN-001) — 12 unidades, mínimo 30',
      productoId: productos['ATUN-001'].id,
      activa: true,
      leida: false,
      createdAt: hoursAgo(3),
    },
  });

  await prisma.alerta.create({
    data: {
      empresaId,
      tipo: 'GRE_PENDIENTE',
      nivel: 'INFO',
      mensaje: 'GRE T001-00000003 pendiente de conciliación',
      activa: true,
      leida: false,
      createdAt: hoursAgo(1),
    },
  });

  await prisma.alerta.create({
    data: {
      empresaId,
      tipo: 'TRIBUTARIA',
      nivel: 'CRITICAL',
      mensaje: 'Riesgo tributario: 2 incidencias pendientes en GRE T001-00000002',
      greId: gres.gre2.id,
      conciliacionId: conc2.id,
      activa: true,
      leida: false,
      createdAt: hoursAgo(2),
    },
  });

  console.log(`  ✓ Conciliaciones: 2 | Historial | Incidencias: 2 | Alertas: 5`);
}

// ─── 11. Trazabilidad ─────────────────────────────────────────────────────────

async function seedTrazabilidad(
  empresaId: string,
  adminId: string,
  gre1Id: string,
  gre2Id: string,
  productos: Record<string, { id: string }>,
) {
  const eventos = [
    { productoId: productos['ARROZ-001'].id, greId: gre1Id, tipo: 'GRE_EMITIDA' as const, descripcion: 'GRE T001-00000001 emitida', entidad: 'GRE', entidadId: gre1Id, horas: 120 },
    { productoId: productos['ARROZ-001'].id, greId: gre1Id, tipo: 'ARCHIVO_CARGADO' as const, descripcion: 'XML cargado para GRE T001-00000001', entidad: 'ArchivoGre', entidadId: gre1Id, horas: 119 },
    { productoId: productos['ARROZ-001'].id, greId: gre1Id, tipo: 'CONCILIACION_COMPLETADA' as const, descripcion: 'Conciliación completada sin diferencias', entidad: 'Conciliacion', entidadId: gre1Id, horas: 96 },
    { productoId: productos['ARROZ-001'].id, greId: gre2Id, tipo: 'GRE_EMITIDA' as const, descripcion: 'GRE T001-00000002 emitida', entidad: 'GRE', entidadId: gre2Id, horas: 48 },
    { productoId: productos['ATUN-001'].id, greId: gre2Id, tipo: 'CONCILIACION_CON_DIFERENCIA' as const, descripcion: 'Conciliación con diferencia GRE vs Físico', entidad: 'Conciliacion', entidadId: gre2Id, horas: 24 },
    { productoId: productos['ATUN-001'].id, greId: gre2Id, tipo: 'INCIDENCIA_CREADA' as const, descripcion: 'Incidencia GRE_FISICO creada para ATUN-001', entidad: 'Incidencia', entidadId: gre2Id, horas: 24 },
    { productoId: productos['LECHE-001'].id, greId: null, tipo: 'MOVIMIENTO_KARDEX' as const, descripcion: 'Entrada inicial de stock — Leche Evaporada', entidad: 'MovimientoKardex', entidadId: productos['LECHE-001'].id, horas: 720 },
    { productoId: productos['ARROZ-001'].id, greId: null, tipo: 'STOCK_FISICO_REGISTRADO' as const, descripcion: 'Conteo físico: 315 sacos en Picking A', entidad: 'StockFisico', entidadId: productos['ARROZ-001'].id, horas: 24 },
  ];

  for (const ev of eventos) {
    await prisma.trazabilidadEvento.create({
      data: {
        empresaId,
        productoId: ev.productoId,
        greId: ev.greId,
        tipoEvento: ev.tipo,
        descripcion: ev.descripcion,
        entidad: ev.entidad,
        entidadId: ev.entidadId,
        usuarioId: adminId,
        createdAt: hoursAgo(ev.horas),
      },
    });
  }

  console.log(`  ✓ Trazabilidad: ${eventos.length} eventos`);
}

// ─── 12. Configuración, Integraciones, Cache, Power BI ────────────────────────

async function seedPlataforma(empresaId: string, adminId: string) {
  const configs = [
    { clave: 'STOCK_MINIMO_DEFAULT', valor: '10', tipo: 'NUMBER' as const, categoria: 'SISTEMA' as const, descripcion: 'Stock mínimo por defecto' },
    { clave: 'CONCILIACION_AUTO', valor: 'true', tipo: 'BOOLEAN' as const, categoria: 'CONCILIACION' as const, descripcion: 'Conciliación automática al registrar GRE' },
    { clave: 'DASHBOARD_CACHE_TTL_MINUTES', valor: '15', tipo: 'NUMBER' as const, categoria: 'SISTEMA' as const, descripcion: 'TTL del caché de dashboards en minutos' },
    { clave: 'IA_CONCILIACION_ENABLED', valor: 'false', tipo: 'BOOLEAN' as const, categoria: 'IA' as const, descripcion: 'Habilitar conciliación con IA' },
    { clave: 'IA_CONCILIACION_UMBRAL', valor: '85', tipo: 'NUMBER' as const, categoria: 'IA' as const, descripcion: 'Umbral mínimo de confianza IA (%)' },
    { clave: 'SUNAT_AMBIENTE', valor: 'beta', tipo: 'STRING' as const, categoria: 'SUNAT' as const, descripcion: 'Ambiente SUNAT: beta o produccion' },
  ];

  for (const c of configs) {
    await prisma.configuracion.upsert({
      where: { clave_empresaId: { clave: c.clave, empresaId } },
      update: {},
      create: { empresaId, ...c, updatedById: adminId },
    });
  }

  await prisma.integracion.create({
    data: {
      empresaId,
      tipo: 'SUNAT',
      proveedor: 'sunat-ose',
      nombre: 'Integración SUNAT — GRE',
      estado: 'PENDIENTE_CONFIG',
      configuracion: { ambiente: 'beta', endpoint: 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem/billService' },
      activo: false,
    },
  });

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  await prisma.dashboardCache.upsert({
    where: { empresaId_clave_periodo: { empresaId, clave: 'operational_stats', periodo: 'HOY' } },
    update: { payload: { gresHoy: 1, gresPendientes: 1, gresConciliadas: 1, alertasActivas: 5, incidenciasPendientes: 2 }, computedAt: new Date(), expiresAt },
    create: {
      empresaId,
      clave: 'operational_stats',
      periodo: 'HOY',
      payload: {
        gresHoy: 1,
        gresPendientes: 1,
        gresConciliadas: 1,
        gresConDiferencia: 1,
        alertasActivas: 5,
        incidenciasPendientes: 2,
        productosCriticos: 1,
        movimientosRecientes: 10,
      },
      expiresAt,
    },
  });

  const expiresMes = new Date();
  expiresMes.setHours(expiresMes.getHours() + 1);

  await prisma.dashboardCache.upsert({
    where: { empresaId_clave_periodo: { empresaId, clave: 'executive_kpis', periodo: 'MES' } },
    update: {},
    create: {
      empresaId,
      clave: 'executive_kpis',
      periodo: 'MES',
      payload: {
        totalGres: 3,
        tasaConciliacion: 33.3,
        incidenciasAbiertas: 2,
        riesgoTributario: 'MODERADO',
        cumplimiento: 78.5,
        diferenciasDetectadas: 2,
        productosActivos: 10,
      },
      expiresAt: expiresMes,
    },
  });

  await prisma.powerBiConfig.upsert({
    where: { empresaId },
    update: {},
    create: {
      empresaId,
      workspaceId: null,
      reportId: null,
      datasetId: null,
      embedUrl: null,
      filtroEmpresa: "Empresa/RUC eq '20123456789'",
      activo: false,
    },
  });

  await prisma.auditoria.create({
    data: {
      empresaId,
      usuarioId: adminId,
      usuarioNombre: 'Juan Pérez',
      usuarioEmail: 'admin@gre-demo.pe',
      accion: 'LOGIN',
      entidad: 'Usuario',
      entidadId: adminId,
      ip: '127.0.0.1',
      userAgent: 'GRE-Smart-Control-Seed/1.0',
      metadata: { source: 'seed' },
    },
  });

  console.log(`  ✓ Configuraciones: ${configs.length} | Integración SUNAT | DashboardCache: 2 | PowerBIConfig | Auditoría`);
}

// ─── Limpieza (idempotencia) ──────────────────────────────────────────────────

async function cleanDatabase() {
  const tables = [
    'auditorias', 'trazabilidad_eventos', 'alertas', 'incidencias',
    'historial_conciliaciones', 'conciliaciones', 'archivo_gre', 'detalle_gre',
    'gre', 'estados_documento', 'series', 'tipos_documento',
    'movimientos_kardex', 'stock_fisico', 'inventarios', 'kardex', 'productos',
    'categorias', 'unidades_medida', 'proveedores', 'clientes',
    'ubicaciones', 'almacenes', 'usuarios', 'rol_permisos',
    'dashboard_cache', 'power_bi_config', 'integraciones', 'configuraciones',
    'roles', 'permisos', 'empresas', 'catalogo_sunat',
  ];

  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables.join(', ')} RESTART IDENTITY CASCADE`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 GRE SMART CONTROL — Iniciando seed...\n');

  await cleanDatabase();
  await seedCatalogoSunat();
  const roles = await seedRolesPermisos();
  const empresa = await seedEmpresa();
  const { almacen, ubicaciones } = await seedAlmacenUbicaciones(empresa.id);
  const usuarios = await seedUsuarios(empresa.id, roles);
  const { categorias, unidades } = await seedCatalogos(empresa.id);
  const { proveedor, cliente } = await seedProveedorCliente(empresa.id);
  const productos = await seedProductosInventario(
    empresa.id, almacen.id, ubicaciones, categorias, unidades, usuarios['ADMIN'],
  );
  const gres = await seedGre(
    empresa.id, usuarios['ADMIN'], usuarios['SUPERVISOR'],
    proveedor.id, cliente.id, productos,
  );
  await seedConciliacion(empresa.id, usuarios['ADMIN'], usuarios['SUPERVISOR'], gres, productos);
  await seedTrazabilidad(empresa.id, usuarios['ADMIN'], gres.gre1.id, gres.gre2.id, productos);
  await seedPlataforma(empresa.id, usuarios['ADMIN']);

  console.log('\n✅ Seed completado exitosamente.\n');
  console.log('── Credenciales demo ──────────────────────');
  console.log('  admin@gre-demo.pe      / Demo2024!');
  console.log('  supervisor@gre-demo.pe / Demo2024!');
  console.log('  consulta@gre-demo.pe   / Demo2024!');
  console.log('───────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
