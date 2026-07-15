# Guía de despliegue — GRE SMART CONTROL

Despliegue en producción sin cambiar la arquitectura:

| Componente | Plataforma | URL ejemplo |
|------------|------------|-------------|
| Frontend (Next.js) | Vercel | `https://gre-smart-control.vercel.app` |
| Backend (NestJS) | Render | `https://gre-smart-api.onrender.com` |
| Base de datos (PostgreSQL) | Supabase | Conexión remota con SSL |

---

## Requisitos previos

- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Render](https://render.com)
- Cuenta en [Vercel](https://vercel.com)
- Repositorio Git del proyecto (GitHub, GitLab o Bitbucket)
- Node.js 20+ localmente (para pruebas)

---

## Paso 1 — Base de datos en Supabase

### 1.1 Crear proyecto

1. Inicia sesión en [Supabase Dashboard](https://supabase.com/dashboard).
2. Clic en **New Project**.
3. Elige organización, nombre (`gre-smart-control`), contraseña de base de datos y región cercana a tus usuarios.
4. Espera a que el proyecto esté listo (~2 minutos).

### 1.2 Obtener URLs de conexión

1. Ve a **Project Settings → Database**.
2. En **Connection string**, selecciona **URI**.
3. Copia dos URLs:

**Conexión directa** (puerto 5432 — para migraciones):

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require
```

**Connection pooler** (puerto 6543 — para la API en runtime):

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require
```

> Reemplaza `[PASSWORD]` con la contraseña del proyecto. Si contiene caracteres especiales, codifícalos en URL.

### 1.3 Ejecutar migraciones (primera vez)

Desde tu máquina local, con las variables de Supabase:

```bash
# En apps/api/.env (temporalmente para migrar)
DATABASE_URL="postgresql://...pooler...6543/...?pgbouncer=true&connection_limit=1&sslmode=require"
DIRECT_DATABASE_URL="postgresql://...directo...5432/...?sslmode=require"

# Desde la raíz del monorepo
npm run db:migrate:deploy
```

### 1.4 (Opcional) Datos de demostración

```bash
npm run db:seed
```

Usuarios de prueba:

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@gre-demo.pe` | `Demo2024!` | ADMIN |
| `supervisor@gre-demo.pe` | `Demo2024!` | SUPERVISOR |
| `consulta@gre-demo.pe` | `Demo2024!` | CONSULTA |

---

## Paso 2 — Backend en Render

### 2.1 Crear servicio web

1. Inicia sesión en [Render Dashboard](https://dashboard.render.com).
2. Clic en **New → Blueprint** (recomendado) o **New → Web Service**.
3. Conecta tu repositorio Git.
4. Si usas Blueprint, Render detectará `render.yaml` en la raíz.

### 2.2 Configuración manual (si no usas Blueprint)

| Campo | Valor |
|-------|-------|
| **Name** | `gre-smart-api` |
| **Region** | Oregon (o la más cercana) |
| **Branch** | `main` |
| **Root Directory** | *(vacío — raíz del monorepo)* |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build:api:prod` |
| **Start Command** | `npm run start:prod --workspace=apps/api` |
| **Health Check Path** | `/api/health` |

> `build:api:prod` ejecuta automáticamente `prisma migrate deploy` antes del build.

### 2.3 Variables de entorno en Render

Configura en **Environment → Environment Variables**:

| Variable | Valor | Notas |
|----------|-------|-------|
| `NODE_ENV` | `production` | |
| `APP_URL` | `https://gre-smart-api.onrender.com` | URL pública HTTPS de Render |
| `DATABASE_URL` | URL pooler Supabase (puerto 6543) | Runtime de la API |
| `DIRECT_DATABASE_URL` | URL directa Supabase (puerto 5432) | Migraciones en build |
| `JWT_SECRET` | Secreto aleatorio 64+ chars | Generar con `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | Otro secreto aleatorio | Diferente al anterior |
| `CORS_ORIGIN` | `https://tu-app.vercel.app` | URL exacta del frontend |
| `API_PREFIX` | `api` | |
| `SWAGGER_ENABLED` | `false` | Recomendado en producción |
| `LOG_LEVEL` | `info` | |

### 2.4 Desplegar

1. Clic en **Create Web Service** (o **Apply** en Blueprint).
2. Espera el build (~3-5 min la primera vez).
3. Verifica:

```bash
curl https://gre-smart-api.onrender.com/api/health
curl https://gre-smart-api.onrender.com/api/health/db
```

Respuesta esperada: `{"success":true,"data":{"status":"ok",...}}`

---

## Paso 3 — Frontend en Vercel

### 3.1 Importar proyecto

1. Inicia sesión en [Vercel Dashboard](https://vercel.com/dashboard).
2. Clic en **Add New → Project**.
3. Importa el repositorio Git.
4. Configura:

| Campo | Valor |
|-------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `apps/web` |
| **Build Command** | `npm run build` *(default)* |
| **Install Command** | `cd ../.. && npm install` *(definido en vercel.json)* |

### 3.2 Variables de entorno en Vercel

En **Settings → Environment Variables** (entorno Production):

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://gre-smart-api.onrender.com/api` |
| `NEXT_PUBLIC_APP_URL` | `https://tu-app.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `GRE Smart Control` |

> Las variables `NEXT_PUBLIC_*` se inyectan en build time. Tras cambiarlas, haz **Redeploy**.

### 3.3 Desplegar

1. Clic en **Deploy**.
2. Espera el build (~2-3 min).
3. Abre la URL de Vercel (ej. `https://gre-smart-control.vercel.app`).

### 3.4 Actualizar CORS en Render

Una vez tengas la URL final de Vercel, actualiza en Render:

```
CORS_ORIGIN=https://gre-smart-control.vercel.app
```

Si usas dominio personalizado, inclúyelo separado por coma:

```
CORS_ORIGIN=https://gre-smart-control.vercel.app,https://app.tudominio.com
```

Render redeployará automáticamente.

---

## Paso 4 — Verificación end-to-end

### Checklist

- [ ] `GET /api/health` responde 200 en Render
- [ ] `GET /api/health/db` responde 200 (conexión Supabase OK)
- [ ] Frontend carga en Vercel sin errores de consola
- [ ] Login con `admin@gre-demo.pe` / `Demo2024!` funciona
- [ ] Las peticiones API van a la URL de Render (revisar Network tab)
- [ ] Refresh token funciona (sesión persiste al recargar)

### Probar autenticación

```bash
curl -X POST https://gre-smart-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gre-demo.pe","password":"Demo2024!"}'
```

---

## Paso 5 — Dominio personalizado (opcional)

### Vercel (frontend)

1. **Settings → Domains → Add**.
2. Configura DNS según instrucciones de Vercel (CNAME).
3. HTTPS se activa automáticamente.

### Render (backend)

1. **Settings → Custom Domains → Add**.
2. Configura CNAME apuntando al servicio Render.
3. Actualiza `APP_URL` y `CORS_ORIGIN` con el nuevo dominio.

---

## Scripts de producción disponibles

Desde la raíz del monorepo:

```bash
# Build completo (API con migraciones + Web)
npm run build:prod

# Solo API con migraciones
npm run build:api:prod

# Solo Web
npm run build:web

# Iniciar API en producción (local)
npm run start:api

# Migraciones en producción (manual)
npm run db:migrate:deploy
```

---

## Variables de entorno — resumen

### Desarrollo local

```bash
# API (apps/api/.env)
DATABASE_URL=postgresql://gre_admin:gre_secret_2024@localhost:5432/gre_smart_control?schema=public
DIRECT_DATABASE_URL=postgresql://gre_admin:gre_secret_2024@localhost:5432/gre_smart_control?schema=public
CORS_ORIGIN=http://localhost:3000
APP_URL=http://localhost:3001

# Web (apps/web/.env)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producción

```bash
# Render (API)
APP_URL=https://gre-smart-api.onrender.com
DATABASE_URL=<supabase-pooler-6543>
DIRECT_DATABASE_URL=<supabase-direct-5432>
CORS_ORIGIN=https://gre-smart-control.vercel.app
JWT_SECRET=<secreto-seguro>
JWT_REFRESH_SECRET=<secreto-seguro>

# Vercel (Web)
NEXT_PUBLIC_API_URL=https://gre-smart-api.onrender.com/api
NEXT_PUBLIC_APP_URL=https://gre-smart-control.vercel.app
```

---

## Notas importantes

### HTTPS y cookies

- En producción, las cookies de refresh usan `Secure` + `SameSite=None` para funcionar entre dominios distintos (Vercel ↔ Render).
- Todas las URLs de producción deben usar `https://`.

### Uploads de archivos GRE

El backend guarda archivos en disco local (`UPLOAD_DIR`). En Render el filesystem es **efímero** — los archivos se pierden al reiniciar. Para producción con uploads, migra a Supabase Storage o S3.

### Plan gratuito de Render

- El servicio se "duerme" tras inactividad (~15 min).
- La primera petición tras dormir puede tardar 30-60 segundos (cold start).
- Considera un plan de pago para uso continuo.

### Prisma y Supabase

- `DATABASE_URL` → pooler (6543) para queries en runtime.
- `DIRECT_DATABASE_URL` → conexión directa (5432) para `prisma migrate deploy`.
- Siempre incluir `sslmode=require` en producción.

---

## Solución de problemas

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| CORS error en browser | `CORS_ORIGIN` incorrecto | URL exacta de Vercel en Render, sin `/` final |
| Login OK pero sesión no persiste | Cookies cross-origin | Verificar `APP_URL` y `CORS_ORIGIN` con HTTPS |
| `Missing required production env vars` | Falta variable en Render | Revisar todas las variables de la tabla |
| `prisma migrate deploy` falla | `DIRECT_DATABASE_URL` incorrecta | Usar puerto 5432, no 6543 |
| Frontend llama a localhost | `NEXT_PUBLIC_API_URL` no configurada | Configurar en Vercel y redeploy |
| API no responde tras inactividad | Cold start Render free | Esperar 30-60s o upgrade de plan |
| Build falla en Vercel | Monorepo no instala shared | Verificar `installCommand` en `vercel.json` |

---

## Orden recomendado de despliegue

```
1. Supabase  →  crear BD, migrar esquema
2. Render    →  desplegar API, verificar /api/health
3. Vercel    →  desplegar frontend con NEXT_PUBLIC_API_URL
4. Render    →  actualizar CORS_ORIGIN con URL de Vercel
5. Verificar →  login, dashboard, peticiones API
```
