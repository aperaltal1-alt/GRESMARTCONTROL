# Plan de fases — GRE SMART CONTROL MVP

## Fase 1 — Arquitectura del proyecto ✅

**Entregables:**
- Estructura de monorepo definida
- Documentación de arquitectura (`docs/ARCHITECTURE.md`)
- Modelo de datos con 17 tablas (`docs/DATABASE.md`)
- Módulos: Dashboard Operativo, Dashboard Ejecutivo, Trazabilidad, Configuración
- Conciliación triple: GRE vs Kardex vs Stock Físico
- Tabla GreArchivo para XML/PDF
- Tabla StockFisico independiente
- Auditoría con registro anterior/nuevo
- Preparación Power BI Embedded
- Docker Compose para PostgreSQL
- Configuración de workspace npm

**Criterio de aceptación:** ✅ Confirmado por el usuario.

---

## Fase 2 — Diseño UI/UX ✅

**Entregables:**
- Manual de identidad visual (`docs/design/01-IDENTIDAD-VISUAL.md`)
- Design System completo (`docs/design/02-DESIGN-SYSTEM.md`)
- Guía de 20 componentes reutilizables (`docs/design/03-GUIA-COMPONENTES.md`)
- Decisiones UX por pantalla (`docs/design/04-DECISIONES-UX.md`)
- Wireframes de 15 pantallas (`docs/design/05-WIREFRAMES.md`)
- Mockups alta fidelidad (`docs/design/06-MOCKUPS-HIFI.md`)
- Prototipo navegable HTML con 15 pantallas (`design/prototype/`)
- Dark/Light mode funcional en prototipo
- Responsive design (mobile, tablet, desktop)
- Design tokens CSS (`design/prototype/css/tokens.css`)
- Paleta corporativa Azul `#2563EB`
- Navegación sidebar con 14 módulos
- Mapeo a componentes React/Shadcn para Fase 5

---

## Fase 2.5 — Validación prototipo ✅

**Entregables:**
- Prototipo premium v2.5 con microinteracciones
- Dashboard Ejecutivo espectacular
- Conciliación y Trazabilidad mejoradas
- Tablas empresariales con sort/search/export
- Login glassmorphism
- Auditoría de diseño (`docs/design/07-AUDITORIA-FASE-2.5.md`)
- Calificación: **8.4/10** — Aprobado para Fase 3

---

## Fase 3 — Base de datos

**Entregables:**
- Schema Prisma completo (17 tablas)
- Migraciones iniciales
- Seed con datos de demostración
- Docker PostgreSQL funcionando

---

## Fase 4 — Backend (estructura base)

**Entregables:**
- Proyecto NestJS inicializado
- Módulos base configurados (todos los dominios)
- Prisma integrado
- AuditInterceptor global
- Pipes, guards, filters comunes
- Health check endpoint

---

## Fase 5 — Frontend (estructura base)

**Entregables:**
- Proyecto Next.js inicializado
- Shadcn UI instalado con design tokens
- Layout SaaS con sidebar y navegación completa
- Tema claro/oscuro funcional
- Cliente API configurado
- PowerBiPlaceholder component

---

## Fase 6 — Autenticación

**Entregables:**
- Login / logout
- JWT access + refresh tokens
- Recuperación de contraseña simulada
- Guards por rol (Admin, Supervisor, Consulta)
- Pantallas de auth en frontend

---

## Fase 7 — CRUD de Productos

**Entregables:**
- API REST completa de productos
- Listado con filtros y paginación
- Formulario crear/editar
- Validaciones frontend y backend

---

## Fase 8 — CRUD de GRE

**Entregables:**
- API REST completa de GRE con detalle de productos
- Upload múltiple de archivos XML/PDF (GreArchivo)
- Formulario con líneas de productos dinámicas
- Listado y detalle de GRE

---

## Fase 9 — Kardex y Stock Físico

**Entregables:**
- Registro de entradas, salidas y ajustes (kardex)
- Registro de conteos de stock físico
- Actualización automática de stockKardex
- Historial por producto
- Pantallas de movimientos y stock físico

---

## Fase 10 — Conciliación automática

**Entregables:**
- Servicio de conciliación triple (GRE vs Kardex vs Stock Físico)
- Generación automática de incidencias por tipo
- Generación de alertas por diferencias
- Pantalla de incidencias pendientes

---

## Fase 11 — Dashboards y Trazabilidad

**Entregables:**
- Dashboard Operativo (KPIs, gráficos, actividad)
- Dashboard Ejecutivo (tendencias, slot Power BI)
- Módulo de Trazabilidad (timeline visual)
- Productos críticos (stock bajo)

---

## Fase 12 — Configuración y Reportes

**Entregables:**
- CRUD de empresas, parámetros, catálogos, series, estados
- Exportación a Excel y PDF
- Pantalla de reportes con filtros
- Consulta de auditoría

---

## Fase 13 — Pruebas

**Entregables:**
- Tests unitarios de servicios críticos (conciliación triple, kardex)
- Tests e2e de flujos principales
- Datos de demostración para presentación
- README con instrucciones de despliegue
