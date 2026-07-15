# Backend — NestJS API

API REST para GRE SMART CONTROL.

## Fase 4.1 ✅ — Base técnica del Backend

NestJS + Prisma + PostgreSQL + Swagger + Pino Logger.

## Fase 4.2 ✅ — Autenticación y Autorización

Sistema JWT empresarial con refresh token rotativo, rate limiting de login, cookies HttpOnly y RBAC preparado para Enterprise.

## Gestión de usuarios (MVP)

Módulo `users` — solo rol **ADMIN**. Usuarios scoped a la empresa del token JWT.

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/users` | Listar usuarios (paginado, búsqueda, filtro activo) |
| GET | `/users/roles` | Roles: ADMIN, SUPERVISOR, CONSULTA |
| GET | `/users/:id` | Detalle de usuario |
| POST | `/users` | Crear usuario |
| PATCH | `/users/:id` | Editar usuario |
| PATCH | `/users/:id/status` | Activar / desactivar |

## Productos (MVP) — Fase 4.4

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/products` | ADMIN, SUPERVISOR, CONSULTA | Listar (search, activo, categoría) |
| GET | `/products/:id` | ADMIN, SUPERVISOR, CONSULTA | Detalle |
| POST | `/products` | ADMIN, SUPERVISOR | Crear |
| PATCH | `/products/:id` | ADMIN, SUPERVISOR | Editar |
| DELETE | `/products/:id` | ADMIN, SUPERVISOR | Soft delete |

## GRE (MVP) — Fase 4.5

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/gre` | ADMIN, SUPERVISOR, CONSULTA | Listar (numero, serie, estado, fechas, RUC) |
| GET | `/gre/:id` | ADMIN, SUPERVISOR, CONSULTA | Detalle con productos y archivos |
| POST | `/gre` | ADMIN, SUPERVISOR | Crear con detalle de productos |
| PATCH | `/gre/:id` | ADMIN, SUPERVISOR | Editar cabecera y/o productos |
| DELETE | `/gre/:id` | ADMIN, SUPERVISOR | Soft delete |
| POST | `/gre/:id/upload` | ADMIN, SUPERVISOR | Subir XML o PDF (solo almacenar) |

## Kardex e Inventario (MVP) — Fase 4.6

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/kardex` | ADMIN, SUPERVISOR, CONSULTA | Historial de movimientos (producto, tipo, fechas) |
| POST | `/kardex` | ADMIN, SUPERVISOR | Registrar ENTRADA, SALIDA o AJUSTE |
| GET | `/inventory` | ADMIN, SUPERVISOR, CONSULTA | Stock actual, mínimo y estado (NORMAL/BAJO/SIN STOCK) |

## Conciliación (MVP) — Fase 4.7

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| POST | `/reconciliation/:greId/run` | ADMIN, SUPERVISOR | Ejecutar conciliación triple |
| GET | `/reconciliation` | ADMIN, SUPERVISOR, CONSULTA | Listar conciliaciones |
| GET | `/reconciliation/:id` | ADMIN, SUPERVISOR, CONSULTA | Detalle completo |
| GET | `/incidents` | ADMIN, SUPERVISOR, CONSULTA | Listar incidencias |
| PATCH | `/incidents/:id/resolve` | ADMIN, SUPERVISOR | Resolver incidencia |
| GET | `/alerts` | ADMIN, SUPERVISOR, CONSULTA | Listar alertas activas |
| PATCH | `/alerts/:id/read` | ADMIN, SUPERVISOR, CONSULTA | Marcar alerta leída |

## Dashboard (MVP) — Fase 4.8

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| GET | `/dashboard/summary` | ADMIN, SUPERVISOR, CONSULTA | Resumen ejecutivo con KPIs |
| GET | `/dashboard/kpis` | ADMIN, SUPERVISOR, CONSULTA | Indicadores del negocio |
| GET | `/dashboard/charts` | ADMIN, SUPERVISOR, CONSULTA | Datos JSON para gráficos |
| GET | `/dashboard/recent-gre` | ADMIN, SUPERVISOR, CONSULTA | Últimas GRE |
| GET | `/dashboard/recent-incidents` | ADMIN, SUPERVISOR, CONSULTA | Últimas incidencias |
| GET | `/dashboard/recent-alerts` | ADMIN, SUPERVISOR, CONSULTA | Últimas alertas activas |
| GET | `/dashboard/critical-products` | ADMIN, SUPERVISOR, CONSULTA | Productos críticos |

### Endpoints Auth

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/auth/login` | Público | Login email + contraseña |
| POST | `/auth/logout` | Público | Revoca refresh token |
| POST | `/auth/refresh` | Público | Renueva access token |
| POST | `/auth/forgot-password` | Público | Recuperación (simulada MVP) |
| POST | `/auth/reset-password` | Público | Restablecer con token |
| POST | `/auth/change-password` | Bearer JWT | Cambiar contraseña |
| GET | `/auth/profile` | Bearer JWT | Perfil + permisos RBAC |

### Seguridad

| Parámetro | Valor |
|-----------|-------|
| Access Token | 15 minutos (JWT) |
| Refresh Token | 7 días (JWT + hash SHA-256 en BD) |
| Hash contraseñas | bcrypt (12 rounds) |
| Rate limit login | 5 intentos → bloqueo 15 min (email + IP) |
| Cookie refresh | `gre_refresh_token` HttpOnly |

### Inicio rápido

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev:api
```

### URLs

| Recurso | URL |
|---------|-----|
| API Base | http://localhost:3001/api |
| Swagger | http://localhost:3001/api/docs |
| Health | http://localhost:3001/api/health |

### Scripts

```bash
npm run dev
npm run build
npm run test:e2e
npm run db:migrate
npm run db:seed
```

### Credenciales demo

| Email | Rol | Password |
|-------|-----|----------|
| admin@gre-demo.pe | ADMIN | Demo2024! |
| supervisor@gre-demo.pe | SUPERVISOR | Demo2024! |
| consulta@gre-demo.pe | CONSULTA | Demo2024! |

## Variables de entorno

Copiar `.env.example` a `.env` en esta carpeta.

## Puerto

`3001` — API en `http://localhost:3001/api`
