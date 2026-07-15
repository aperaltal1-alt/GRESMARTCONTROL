# Arquitectura — GRE SMART CONTROL MVP

## 1. Visión general

GRE SMART CONTROL es un **monorepo** con dos aplicaciones desacopladas que se comunican vía API REST:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            USUARIO FINAL                                 │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │ HTTPS
┌────────────────────────────────▼─────────────────────────────────────────┐
│                         apps/web (Next.js)                               │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────────────────┐   │
│  │  Dashboard     │  │  Dashboard     │  │  Operaciones             │   │
│  │  Operativo     │  │  Ejecutivo     │  │  GRE · Productos · Kardex│   │
│  └────────────────┘  │  (+ Power BI)  │  └──────────────────────────┘   │
│  ┌────────────────┐  └────────────────┘  ┌──────────────────────────┐   │
│  │  Trazabilidad  │  │  Conciliación  │  │  Configuración           │   │
│  └────────────────┘  └────────────────┘  └──────────────────────────┘   │
│  App Router · Server Components · Shadcn UI · Recharts                   │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │ REST API (JSON) + JWT
┌────────────────────────────────▼─────────────────────────────────────────┐
│                         apps/api (NestJS)                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────────────────┐              │
│  │Controllers │ │  Services  │ │  Repositories (Prisma) │              │
│  └────────────┘ └────────────┘ └────────────────────────┘              │
│  Guards · Pipes · DTOs · Validación · Módulos por dominio                │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │ Prisma ORM
┌────────────────────────────────▼─────────────────────────────────────────┐
│                         PostgreSQL 16                                      │
│  GRE · Kardex · Stock Físico · Trazabilidad · Configuración · Auditoría │
└──────────────────────────────────────────────────────────────────────────┘
```

## 2. Principios arquitectónicos

| Principio | Aplicación en el MVP |
|-----------|----------------------|
| **Separación de responsabilidades** | Frontend solo presenta datos; toda la lógica de negocio vive en el backend |
| **Clean Architecture (simplificada)** | Controllers → Services → Repositories → Prisma |
| **Domain-driven modules** | Un módulo NestJS por dominio (ver sección 3) |
| **API-first** | Contratos REST documentados; el frontend consume solo la API |
| **Escalabilidad futura** | Módulos independientes permiten agregar SUNAT, OCR, Power BI, IA sin rediseño |
| **Multi-tenant preparado** | Campo `empresaId` en entidades clave para versión Enterprise |
| **Trazabilidad end-to-end** | Cada evento del ciclo de vida de la mercadería queda registrado |

## 3. Módulos del sistema

### 3.1 Módulos backend (`apps/api/src/modules/`)

| Módulo | Responsabilidad |
|--------|-----------------|
| `auth` | Login, logout, JWT, recuperación de contraseña |
| `users` | Gestión de usuarios y roles |
| `products` | CRUD de productos |
| `gre` | CRUD de GRE, detalle y archivos adjuntos |
| `kardex` | Movimientos de entrada, salida y ajuste |
| `physical-stock` | Registro de stock físico independiente del kardex |
| `reconciliation` | Conciliación triple: GRE vs Kardex vs Stock Físico |
| `traceability` | Recorrido completo de mercadería (timeline) |
| `alerts` | Alertas activas por tipo |
| `dashboard-operational` | KPIs operativos, gráficos, actividad reciente |
| `dashboard-executive` | KPIs ejecutivos, tendencias, slot Power BI Embedded |
| `configuration` | Empresas, parámetros, catálogos, series, estados |
| `reports` | Exportación Excel y PDF |
| `audit` | Registro de auditoría con before/after |

### 3.2 Estructura de carpetas backend

```
apps/api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── common/
│   │   ├── decorators/       # @Roles(), @CurrentUser()
│   │   ├── filters/
│   │   ├── guards/         # JwtAuthGuard, RolesGuard
│   │   ├── interceptors/   # AuditInterceptor (registra before/after)
│   │   └── pipes/
│   ├── config/
│   └── modules/
│       ├── auth/
│       ├── users/
│       ├── products/
│       ├── gre/
│       ├── kardex/
│       ├── physical-stock/
│       ├── reconciliation/     # ★ Conciliación triple
│       ├── traceability/       # ★ Trazabilidad end-to-end
│       ├── alerts/
│       ├── dashboard-operational/
│       ├── dashboard-executive/  # ★ Power BI slot
│       ├── configuration/        # ★ Empresas, catálogos, series
│       ├── reports/
│       └── audit/
└── test/
```

### 3.3 Flujo de una petición

```
Request → JwtAuthGuard → RolesGuard → Controller
         → ValidationPipe (DTO) → Service → Prisma → PostgreSQL
         → AuditInterceptor (registra cambios)
         → Response (transformado)
```

## 4. Conciliación triple (regla de negocio central)

La conciliación compara **tres fuentes de verdad** por cada producto en una GRE:

```
GRE registrada/actualizada
    │
    ▼
ReconciliationService.reconcile(greId)
    │
    ├── Por cada DetalleGRE:
    │     cantidadGRE      = DetalleGRE.cantidad
    │     cantidadKardex   = Producto.stockKardex (derivado de movimientos)
    │     cantidadFisico   = StockFisico.cantidad (último conteo)
    │
    │     diffGreKardex    = cantidadGRE - cantidadKardex
    │     diffGreFisico    = cantidadGRE - cantidadFisico
    │     diffKardexFisico = cantidadKardex - cantidadFisico
    │
    ├── Si alguna diferencia ≠ 0:
    │     → Crear Incidencia (tipo: GRE_KARDEX | GRE_FISICO | KARDEX_FISICO)
    │     → Crear Alerta (tipo: DIFERENCIA_GRE | DIFERENCIA_KARDEX | DIFERENCIA_FISICO)
    │     → Registrar evento Trazabilidad (CONCILIACION_CON_DIFERENCIA)
    │
    └── Actualizar GRE.estado → CON_DIFERENCIA | CONCILIADA
```

## 5. Módulo de Trazabilidad

Registra el recorrido completo de la mercadería como una línea de tiempo:

```
GRE Emitida → Archivo XML/PDF cargado → Movimiento Kardex →
Stock Físico registrado → Conciliación iniciada →
Conciliación completada / Incidencia creada → Incidencia resuelta
```

Cada evento se almacena en `TrazabilidadEvento` con referencia a la entidad origen (GRE, Kardex, StockFisico, Incidencia).

**Endpoint principal:** `GET /traceability/:productoId` o `GET /traceability/gre/:greId`

## 6. Módulo de Configuración

Submódulos independientes dentro de `configuration/`:

| Submódulo | Gestiona |
|-----------|----------|
| `companies` | Empresas (RUC, razón social) |
| `parameters` | Parámetros del sistema (clave-valor) |
| `catalogs` | Catálogos genéricos (categorías, unidades) |
| `document-types` | Tipos de documentos (GRE, factura, etc.) |
| `series` | Series de documentos por empresa |
| `states` | Estados configurables de documentos |

Solo accesible por rol **ADMIN**.

## 7. Dashboards (dos módulos independientes)

### Dashboard Operativo
- GRE del día / pendientes / conciliadas
- Alertas activas y productos críticos
- Gráficos de movimientos recientes
- Actividad reciente (últimas acciones)
- Acceso: ADMIN, SUPERVISOR

### Dashboard Ejecutivo
- KPIs agregados de alto nivel (mes, trimestre)
- Tendencias de diferencias y conciliación
- Resumen por empresa
- **Slot Power BI Embedded** (preparado, desactivado en MVP)
- Acceso: ADMIN, SUPERVISOR (solo lectura para CONSULTA)

### Preparación Power BI Embedded

```
apps/web/
├── components/
│   └── powerbi/
│       ├── PowerBiEmbed.tsx      # Componente wrapper (placeholder MVP)
│       └── PowerBiPlaceholder.tsx # Mensaje "Próximamente" en MVP

apps/api/
├── modules/
│   └── dashboard-executive/
│       └── powerbi.service.ts    # Generación de embed token (futuro)

Variables de entorno (futuro):
  POWERBI_WORKSPACE_ID=
  POWERBI_REPORT_ID=
  POWERBI_CLIENT_ID=
  POWERBI_CLIENT_SECRET=
```

En MVP el slot muestra un placeholder profesional. La arquitectura del componente ya acepta `reportId` y `embedToken` para activación sin cambios estructurales.

## 8. Estructura del frontend (`apps/web`)

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx                    # Sidebar + header
│   │   ├── dashboard/
│   │   │   ├── operativo/page.tsx        # Dashboard Operativo
│   │   │   └── ejecutivo/page.tsx        # Dashboard Ejecutivo + Power BI slot
│   │   ├── gre/
│   │   ├── products/
│   │   ├── kardex/
│   │   ├── stock-fisico/
│   │   ├── conciliacion/
│   │   ├── trazabilidad/
│   │   │   ├── page.tsx                  # Búsqueda
│   │   │   └── [id]/page.tsx             # Timeline de producto/GRE
│   │   ├── alertas/
│   │   ├── reportes/
│   │   └── configuracion/
│   │       ├── empresas/
│   │       ├── parametros/
│   │       ├── catalogos/
│   │       ├── tipos-documento/
│   │       ├── series/
│   │       └── estados/
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                     # Shadcn UI
│   ├── layout/                 # Sidebar, Header, Breadcrumb
│   ├── dashboard/
│   ├── gre/
│   ├── products/
│   ├── traceability/           # Timeline, EventCard
│   ├── configuration/
│   ├── powerbi/                # PowerBiEmbed, PowerBiPlaceholder
│   └── shared/
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   └── utils.ts
├── styles/
│   └── design-tokens.css       # Variables CSS del design system
└── hooks/
```

## 9. API REST — Endpoints planificados

| Módulo | Método | Ruta | Descripción |
|--------|--------|------|-------------|
| Auth | POST | `/auth/login` | Iniciar sesión |
| Auth | POST | `/auth/logout` | Cerrar sesión |
| Auth | POST | `/auth/forgot-password` | Recuperación simulada |
| Auth | POST | `/auth/refresh` | Renovar token |
| Dashboard Operativo | GET | `/dashboard/operational/stats` | KPIs operativos |
| Dashboard Operativo | GET | `/dashboard/operational/charts` | Gráficos operativos |
| Dashboard Operativo | GET | `/dashboard/operational/activity` | Actividad reciente |
| Dashboard Ejecutivo | GET | `/dashboard/executive/stats` | KPIs ejecutivos |
| Dashboard Ejecutivo | GET | `/dashboard/executive/trends` | Tendencias |
| Dashboard Ejecutivo | GET | `/dashboard/executive/powerbi-token` | Embed token (futuro) |
| Products | CRUD | `/products` | Gestión de productos |
| GRE | CRUD | `/gre` | Gestión de GRE |
| GRE | POST | `/gre/:id/files` | Subir XML/PDF |
| GRE | GET | `/gre/:id/files` | Listar archivos adjuntos |
| Kardex | GET/POST | `/kardex` | Movimientos |
| Physical Stock | GET/POST | `/physical-stock` | Stock físico |
| Reconciliation | POST | `/reconciliation/:greId` | Ejecutar conciliación triple |
| Reconciliation | GET | `/reconciliation/incidents` | Listar incidencias |
| Traceability | GET | `/traceability/product/:id` | Timeline por producto |
| Traceability | GET | `/traceability/gre/:id` | Timeline por GRE |
| Alerts | GET | `/alerts` | Alertas activas |
| Configuration | CRUD | `/configuration/companies` | Empresas |
| Configuration | CRUD | `/configuration/parameters` | Parámetros |
| Configuration | CRUD | `/configuration/catalogs` | Catálogos |
| Configuration | CRUD | `/configuration/document-types` | Tipos de documento |
| Configuration | CRUD | `/configuration/series` | Series |
| Configuration | CRUD | `/configuration/states` | Estados |
| Reports | GET | `/reports/excel` | Exportar Excel |
| Reports | GET | `/reports/pdf` | Exportar PDF |
| Audit | GET | `/audit` | Consulta de auditoría |

## 10. Paquete compartido (`packages/shared`)

```
packages/shared/
├── src/
│   ├── types/
│   ├── constants/
│   └── enums/          # Rol, GreEstado, TipoAlerta, TipoIncidencia, etc.
└── package.json
```

## 11. Autenticación y autorización

```
Roles:
  ADMIN      → Acceso total incluyendo Configuración
  SUPERVISOR → CRUD operativo + conciliación + trazabilidad
  CONSULTA   → Solo lectura (dashboards, reportes, trazabilidad)
```

## 12. Infraestructura local

```yaml
# docker-compose.yml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
```

## 13. Escalabilidad futura (sin rediseño)

| Funcionalidad futura | Punto de extensión |
|---------------------|-------------------|
| Lectura automática XML | `gre/parsers/xml.parser.ts` + cola BullMQ |
| Lectura automática PDF | `gre/parsers/pdf.parser.ts` + OCR (Tesseract) |
| Integración SUNAT | `integrations/sunat/` (consulta GRE, validación) |
| Escaneo QR | `integrations/scanner/qr.service.ts` |
| Escaneo barras | `integrations/scanner/barcode.service.ts` |
| Power BI Embedded | `dashboard-executive/powerbi.service.ts` + `PowerBiEmbed.tsx` |
| IA para conciliación | `reconciliation/ai-reconciler.service.ts` (reemplaza reglas) |
| Multi-empresa | `empresaId` ya presente en schema |
| Notificaciones email | `notifications/` con proveedor SMTP |

## 14. Seguridad MVP

- Contraseñas hasheadas con bcrypt
- JWT con expiración corta (15 min) + refresh token (7 días)
- Validación de entrada con class-validator (backend) y zod (frontend)
- CORS restringido al dominio del frontend
- Rate limiting en endpoints de auth
- **Auditoría completa**: usuario, fecha, hora, IP, acción, registro anterior, registro nuevo
- `AuditInterceptor` global en operaciones CREATE, UPDATE, DELETE
