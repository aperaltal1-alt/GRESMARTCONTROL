# Frontend — Next.js Web App

Interfaz SaaS para **GRE SMART CONTROL** (MVP concurso de innovación).

## Fase 5.7 — Completar Frontend MVP ✅ (ÚLTIMA FASE)

Seis módulos finales para dejar el frontend listo para demo del concurso.

### Rutas implementadas

| Módulo | Ruta sidebar | API |
|--------|--------------|-----|
| Conciliación | `/conciliacion` | `/reconciliation` |
| Incidencias | `/incidencias` | `/incidents` |
| Alertas | `/alertas` | `/alerts` |
| Usuarios | `/usuarios` | `/users` |
| Reportes | `/reportes` | `/dashboard/*` |
| Configuración | `/configuracion` + `/cuenta` | `/auth/profile`, `/auth/change-password` |

### Módulos implementados

1. **Conciliación** — listado, filtros, paginación, detalle con timeline, % conciliado, diferencias, ejecutar conciliación (AlertDialog)
2. **Incidencias** — tabla, filtros, detalle, resolver incidencia (optimistic)
3. **Alertas** — listado, filtros prioridad/tipo/estado, marcar como leída (optimistic)
4. **Usuarios** — CRUD ADMIN, activar/desactivar, cambiar rol, CONSULTA solo lectura
5. **Reportes** — KPIs, gráficos, resumen ejecutivo, exportar CSV (client-side)
6. **Configuración** — perfil, empresa, cambio contraseña, preferencias tema

### Endpoints consumidos (22)

Reconciliation (3), Incidents (2), Alerts (2), Users (6), Dashboard (7), Auth profile/password (2).

### Build verificado

```
✓ /conciliacion   12.3 kB
✓ /incidencias    10.9 kB
✓ /alertas         8.55 kB
✓ /usuarios        8.38 kB
✓ /reportes        2.85 kB
✓ /configuracion   142 B (shared chunk 223 kB)
```

### Pendiente (sin API backend)

- `/dashboard/operativo` — placeholder
- `/trazabilidad` — placeholder
- `/configuracion/*` sub-rutas — placeholders (empresas, parámetros, catálogos, etc.)

---

## Fase 5.6 — Kardex e Inventario ✅

Pantallas SaaS para movimientos de inventario (Kardex) y consulta de stock físico (Inventario).

### Rutas

| Pantalla | Ruta | Nota |
|----------|------|------|
| Kardex | `/kardex` | Movimientos ENTRADA / SALIDA / AJUSTE |
| Inventario | `/inventario` | Ruta del sidebar (no `/inventory`) |

### Módulo Kardex — Funcionalidades

- Tabla **TanStack Table** (6 columnas): Fecha, Producto, Tipo, Cantidad, Stock resultante, Observación
- Búsqueda client-side por código/nombre de producto (debounce 300ms)
- Filtros server-side: producto (UUID), tipo, rango de fechas
- Paginación del servidor
- Modal registrar movimiento (RHF + Zod): Entrada, Salida, Ajuste
- Badges de tipo con colores distintivos
- Skeleton, empty state, error + retry, toasts
- Roles: ADMIN/SUPERVISOR (crear movimiento), CONSULTA (solo lectura)

### Módulo Inventario — Funcionalidades

- **4 cards superiores:** Productos, Stock total, Productos con stock bajo, Productos sin stock
- Tabla **TanStack Table** (6 columnas): Código, Producto, Categoría, Stock actual, Stock mínimo, Estado
- Badges de estado: NORMAL, BAJO STOCK, SIN STOCK
- Búsqueda y filtro por categoría (client-side, enriquecido desde productos)
- Filtro por estado (server-side)
- Paginación del servidor
- Skeleton independiente en cards y tabla, empty/error states, tooltips, Framer Motion

### Endpoints consumidos

| Endpoint | Uso |
|----------|-----|
| `GET /kardex` | Listado paginado + filtros (`producto`, `tipo`, `fechaDesde`, `fechaHasta`) |
| `POST /kardex` | Crear movimiento (ENTRADA / SALIDA / AJUSTE) |
| `GET /inventory` | Listado paginado + filtro `estado` |
| `GET /dashboard/kpis` | Stock total para card de resumen |
| `GET /products` | Enriquecer categoría en tabla de inventario |

### Archivos creados

```
types/kardex.ts
types/inventory.ts
lib/kardex/
  services/kardex.service.ts
  schemas.ts
  utils.ts
lib/inventory/
  services/inventory.service.ts
  utils.ts
hooks/kardex/
  use-kardex-list.ts
  use-create-kardex-movement.ts
  index.ts
hooks/inventory/
  use-inventory-list.ts   # incluye useInventorySummary
  index.ts
components/kardex/
  kardex-page.tsx
  kardex-table.tsx
  kardex-toolbar.tsx
  kardex-movement-modal.tsx
  kardex-tipo-badge.tsx
  kardex-pagination.tsx
  kardex-empty.tsx
  kardex-skeleton.tsx
  index.ts
components/inventory/
  inventory-page.tsx
  inventory-table.tsx
  inventory-toolbar.tsx
  inventory-summary-cards.tsx
  inventory-estado-badge.tsx
  inventory-pagination.tsx
  inventory-empty.tsx
  inventory-skeleton.tsx
  index.ts
```

### Archivos modificados

```
app/(dashboard)/kardex/page.tsx
app/(dashboard)/inventario/page.tsx
lib/query/keys.ts
```

### Decisiones de implementación

- **Kardex búsqueda:** client-side (API no expone `search` textual)
- **Inventario categoría/búsqueda:** client-side; categoría desde `GET /products`
- **Inventario resumen:** `meta.total` por estado + `stockTotalDisponible` de KPIs
- **Estado API `BAJO`:** UI muestra badge "BAJO STOCK"
- **AJUSTE:** cantidad = stock resultante deseado (según contrato backend)

### Verificación

```bash
npm run dev:api && npm run dev:web
npm run build:web
```

1. Login como Admin → `/kardex`
2. Filtrar por producto, tipo y fechas; paginar
3. Registrar Entrada / Salida / Ajuste → toast + tabla actualizada
4. Navegar a `/inventario` → ver cards y tabla con badges
5. Filtrar por estado, categoría y búsqueda
6. Login como Consulta → Kardex sin botón "Registrar movimiento"

### Build

```
✓ /kardex      8.75 kB   First Load JS 265 kB
✓ /inventario  5.95 kB   First Load JS 212 kB
```

---

## Fase 5.5 — Gestión de GRE ✅

Pantalla SaaS para Guías de Remisión Electrónica con CRUD completo, timeline visual y upload de archivos.

### Funcionalidades

- Tabla TanStack Table con 7 columnas
- Búsqueda por número (debounce 300ms)
- Filtros: serie, estado, rango de fechas
- Paginación del servidor
- Modal crear / editar (RHF + Zod + líneas de productos)
- Detalle con timeline visual, productos y archivos
- Upload XML/PDF vía `POST /gre/:id/upload`
- Soft delete con AlertDialog
- Badges de estado: Pendiente, Conciliada, Con diferencia
- Skeleton, empty, error + retry, toasts
- Optimistic UI en update/delete
- Roles: ADMIN/SUPERVISOR (CRUD), CONSULTA (solo lectura)

### Endpoints consumidos

| Endpoint | Uso |
|----------|-----|
| `GET /gre` | Listado paginado + filtros |
| `GET /gre/:id` | Detalle con productos y archivos |
| `POST /gre` | Crear GRE |
| `PATCH /gre/:id` | Editar GRE |
| `DELETE /gre/:id` | Soft delete |
| `POST /gre/:id/upload` | Upload XML/PDF (multipart) |

### Archivos creados

```
types/gre.ts
lib/gre/
  services/gre.service.ts
  schemas.ts
  utils.ts
hooks/gre/
  use-gre-list.ts
  use-gre-detail.ts
  use-create-gre.ts
  use-update-gre.ts
  use-delete-gre.ts
  use-upload-gre-file.ts
  index.ts
components/gre/
  gre-page.tsx
  gre-table.tsx
  gre-toolbar.tsx
  gre-pagination.tsx
  gre-form-modal.tsx
  gre-detail-dialog.tsx
  gre-upload-dialog.tsx
  delete-gre-dialog.tsx
  gre-estado-badge.tsx
  gre-timeline.tsx
  gre-empty.tsx
  gre-skeleton.tsx
  index.ts
```

### Archivos modificados

```
app/(dashboard)/gre/page.tsx
lib/query/keys.ts
```

### Flujo de navegación

```
Login → Sidebar "GRE" → /gre
  ├── Buscar / filtrar / paginar
  ├── Ver detalle → Timeline + productos + archivos
  ├── [ADMIN/SUPERVISOR] Nueva GRE → Modal → POST
  ├── [ADMIN/SUPERVISOR] Editar → Modal → PATCH
  ├── [ADMIN/SUPERVISOR] Subir XML/PDF → Upload dialog
  └── [ADMIN/SUPERVISOR] Desactivar → AlertDialog → DELETE
```

---

## Fase 5.4 — Gestión de Productos ✅

Pantalla comercial SaaS para catálogo de productos con TanStack Table, filtros, paginación server-side y CRUD completo.

### Funcionalidades

- Tabla moderna con **TanStack Table** (8 columnas)
- Búsqueda en tiempo real (debounce 300ms)
- Filtros: categoría, estado stock, activo/inactivo
- Paginación del servidor (`page`, `limit`)
- Modal crear / editar (RHF + Zod)
- Soft delete con AlertDialog de confirmación
- Badges: NORMAL, BAJO STOCK, SIN STOCK
- Skeleton, empty state, error state con retry
- Toasts Sonner, optimistic UI en update/delete
- Roles: ADMIN/SUPERVISOR (CRUD), CONSULTA (solo lectura)

### Endpoints consumidos

| Endpoint | Uso |
|----------|-----|
| `GET /products` | Listado paginado + filtros |
| `GET /products/:id` | Detalle (preparado en service) |
| `POST /products` | Crear producto |
| `PATCH /products/:id` | Editar producto |
| `DELETE /products/:id` | Soft delete |

### Archivos creados

```
types/products.ts
lib/products/
  services/products.service.ts
  schemas.ts
  utils.ts
hooks/
  use-debounce.ts
  products/
    use-products-list.ts
    use-create-product.ts
    use-update-product.ts
    use-delete-product.ts
    index.ts
components/products/
  products-page.tsx
  products-table.tsx
  products-toolbar.tsx
  products-pagination.tsx
  product-form-modal.tsx
  delete-product-dialog.tsx
  product-stock-badge.tsx
  products-empty.tsx
  products-skeleton.tsx
  index.ts
components/ui/
  dialog.tsx
  alert-dialog.tsx
```

### Archivos modificados

```
app/(dashboard)/products/page.tsx
lib/query/keys.ts
package.json (+ @tanstack/react-table, @radix-ui/react-dialog, @radix-ui/react-alert-dialog)
```

### Flujo de navegación

```
Login → Sidebar "Productos" → /products
  ├── Buscar / filtrar (server-side)
  ├── Paginar (server-side)
  ├── [ADMIN/SUPERVISOR] Nuevo producto → Modal → POST
  ├── [ADMIN/SUPERVISOR] Editar → Modal → PATCH (optimistic)
  └── [ADMIN/SUPERVISOR] Desactivar → AlertDialog → DELETE (optimistic)
```

### Verificación

```bash
npm run dev:api && npm run dev:web
npm run build:web
```

1. Login como Admin → `/products`
2. Ver tabla con productos del seed
3. Buscar "ARROZ", filtrar categoría
4. Crear producto de prueba
5. Editar stock mínimo
6. Desactivar producto
7. Login como Consulta → solo lectura (sin botones CRUD)

---

## Fase 5.3 — Dashboard Ejecutivo ✅

Dashboard principal con diseño SaaS premium (Stripe/Linear/Vercel). Consume exclusivamente los endpoints del backend existente.

### Funcionalidades

- **10 KPI cards** con iconos Lucide, tendencias, colores, hover, animación y tooltip
- **4 gráficos Recharts** animados y responsive (GRE, Kardex, diferencias, stock bajo)
- **Panel derecho** con tabs: últimas GRE, incidencias y alertas
- **Tabla de productos críticos** con stock, mínimo, estado y badge
- Estados: skeleton, loading, error con retry, empty state
- Framer Motion, glassmorphism sutil, modo oscuro
- TanStack Query + Axios (sin datos ficticios)

### Endpoints consumidos

| Endpoint | Uso |
|----------|-----|
| `GET /dashboard/kpis` | 10 KPI cards |
| `GET /dashboard/charts?dias=30` | 4 gráficos + tendencias |
| `GET /dashboard/recent-gre?limit=6` | Panel GRE |
| `GET /dashboard/recent-incidents?limit=6` | Panel incidencias |
| `GET /dashboard/recent-alerts?limit=6` | Panel alertas |
| `GET /dashboard/critical-products` | Tabla productos críticos |

### Archivos creados

```
types/dashboard.ts
lib/dashboard/
  services/dashboard.service.ts
  utils.ts
hooks/dashboard/
  use-dashboard-kpis.ts
  use-dashboard-charts.ts
  use-dashboard-recent-gre.ts
  use-dashboard-recent-incidents.ts
  use-dashboard-recent-alerts.ts
  use-dashboard-critical-products.ts
  index.ts
components/dashboard/
  dashboard-executive.tsx    # Orquestador principal
  kpi-grid.tsx               # Grid de 10 KPIs
  kpi-card.tsx               # Card individual con tooltip
  dashboard-charts.tsx       # AreaChart + BarChart
  charts-section.tsx         # Sección de 4 gráficos
  right-panel.tsx            # Panel actividad reciente
  recent-gre-list.tsx
  recent-incidents-list.tsx
  recent-alerts-list.tsx
  critical-products-table.tsx
  dashboard-skeleton.tsx
  dashboard-error.tsx
  dashboard-empty.tsx
  index.ts
app/(dashboard)/dashboard/ejecutivo/page.tsx  # Página actualizada
```

### Verificación

```bash
npm run dev:api   # Terminal 1 — puerto 3001
npm run dev:web   # Terminal 2 — puerto 3000
npm run build:web # Build producción
```

1. Login con credenciales demo
2. Navegar a `/dashboard/ejecutivo` desde sidebar
3. Verificar KPIs, gráficos, panel y tabla con datos reales
4. Probar botón "Actualizar" y estados de error (detener API)

---

## Fase 5.2 — Login funcional ✅

Pantalla de autenticación completa con diseño SaaS premium (Stripe/Linear/Vercel).

### Funcionalidades

- Formulario con **React Hook Form + Zod** (validación en tiempo real)
- **TanStack Query** mutation para login/logout
- **Axios** → `POST /api/auth/login`
- JWT access token + refresh token (cookie HttpOnly)
- Redirección automática si ya hay sesión
- Persistencia de sesión + restauración silenciosa vía refresh
- **Recordar sesión** (email + preferencia en localStorage)
- Toasts elegantes con **Sonner**
- Loading durante autenticación
- Mostrar/ocultar contraseña
- Credenciales demo con autocompletado rápido
- Logout funcional desde topbar con toast

### Archivos principales

```
components/auth/
  login-form.tsx          # Formulario funcional
  login-showcase.tsx      # Panel hero (desktop)
  login-page-content.tsx  # Layout split responsive
components/ui/
  label.tsx, checkbox.tsx, sonner.tsx
lib/auth/
  remember-session.ts     # Recordar email/sesión
  hooks/use-auth-mutations.ts
```

### Credenciales demo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@gre-demo.pe | Demo2024! |
| Supervisor | supervisor@gre-demo.pe | Demo2024! |
| Consulta | consulta@gre-demo.pe | Demo2024! |

### Verificación

```bash
npm run dev:api   # Terminal 1 — puerto 3001
npm run dev:web   # Terminal 2 — puerto 3000
```

1. Abrir `http://localhost:3000/login`
2. Clic en chip demo o ingresar credenciales
3. Toast de bienvenida → redirect a `/dashboard/operativo`
4. Cerrar sesión desde topbar → toast + redirect a login

---

## Fase 5.1 — Arquitectura base

Infraestructura frontend sin pantallas funcionales de negocio. El login, dashboards y CRUDs se implementan en fases posteriores.

### Stack

| Tecnología | Uso |
|------------|-----|
| Next.js 15 (App Router) | Routing, layouts, middleware |
| TypeScript | Tipado estricto |
| Tailwind CSS + design tokens | Estilos y layout SaaS |
| shadcn/ui | Componentes base (`components/ui/`) |
| TanStack Query | Estado servidor y caché |
| Axios | Cliente HTTP con JWT + refresh |
| React Hook Form + Zod | Formularios (schema base en `lib/forms/`) |
| Recharts | Gráficos (`components/charts/chart-container.tsx`) |
| Lucide React | Iconografía |
| next-themes | Tema claro/oscuro |

### Estructura

```
apps/web/
├── app/
│   ├── (auth)/              # Rutas públicas (login, forgot-password)
│   ├── (dashboard)/         # Rutas protegidas con AppShell
│   ├── layout.tsx           # Root layout + providers
│   ├── page.tsx             # Redirect → /dashboard/operativo
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn/ui
│   ├── layout/              # Sidebar, Topbar, AppShell, AuthGuard
│   ├── providers/           # Theme, Query, Auth, AppProviders
│   ├── shared/              # Logo, PageHeader, EmptyState, etc.
│   └── charts/              # Wrapper Recharts
├── config/                  # env, site, rutas públicas
├── hooks/                   # useAuth, useSidebar, useMediaQuery
├── lib/
│   ├── api/                 # Axios + interceptors
│   ├── auth/                # JWT, session, token storage
│   ├── forms/               # Schemas Zod
│   ├── navigation/          # Mapeo iconos Lucide
│   └── query/               # React Query client + keys
├── middleware.ts            # Protección por cookie `gre-auth`
├── styles/design-tokens.css
└── types/                   # Auth, API
```

### Autenticación (infraestructura)

- **Access token:** `localStorage` (`gre_access_token`)
- **Cookie middleware:** `gre-auth=1` (sincronizada al guardar token)
- **Refresh token:** cookie HttpOnly `gre_refresh_token` (backend)
- **Axios:** `withCredentials: true`, interceptor 401 → refresh → retry
- **AuthGuard:** redirección client-side a `/login` si no hay sesión

### Rutas

- **Públicas:** `/login`, `/forgot-password`
- **Protegidas:** todas las rutas del sidebar (`@gre-smart/shared` navigation)
- **Placeholders:** cada ruta muestra `RoutePlaceholder` (sin lógica de negocio)

### Variables de entorno

Copiar `.env.example` → `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=GRE Smart Control
```

### Comandos

```bash
# Desde la raíz del monorepo
npm install
npm run dev:web          # http://localhost:3000
npm run build:web
```

### Verificación manual

1. Abrir `http://localhost:3000` → redirige a `/login` (sin cookie)
2. Placeholder de login visible (Fase 6)
3. Con cookie `gre-auth=1` + token en localStorage → acceso al shell con sidebar/topbar
4. Toggle tema claro/oscuro en topbar
5. Sidebar colapsable persiste en `localStorage`

### Próxima fase

**Fase 6 — Autenticación:** login/logout funcional, formulario RHF+Zod, guards por rol.

## Puerto

`3000` — App en `http://localhost:3000`
