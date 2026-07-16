# DESPLIEGUE HOY — GRE SMART CONTROL

Sigue estos pasos en orden. Tiempo estimado: 30 minutos.

---

## PASO 0 — Subir código a GitHub (si aún no está)

El repo debe estar en: `https://github.com/aperaltal1-alt/GRESMARTCONTROL`

---

## PASO 1 — Render (Backend)

### Botones a presionar:

1. Ir a **https://dashboard.render.com**
2. Clic en **New +** (arriba derecha)
3. Clic en **Blueprint**
4. Clic en **Connect account** → conectar GitHub si no está conectado
5. Buscar y seleccionar el repo **GRESMARTCONTROL**
6. Clic en **Connect**
7. Render detectará `render.yaml` automáticamente
8. En la pantalla de variables, completar las que dicen **sync: false**:

| Variable | Valor exacto a pegar |
|----------|---------------------|
| `APP_URL` | `https://gre-smart-api.onrender.com` |
| `DATABASE_URL` | `postgresql://postgres.yvmvhhxktwvlyyatkdwe:TU_PASSWORD@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require` |
| `DIRECT_DATABASE_URL` | `postgresql://postgres.yvmvhhxktwvlyyatkdwe:TU_PASSWORD@aws-1-us-west-2.pooler.supabase.com:5432/postgres?sslmode=require` |
| `CORS_ORIGIN` | `https://gre-smart-control.vercel.app` *(actualizar después si Vercel da otra URL)* |

> Reemplaza `TU_PASSWORD` con tu contraseña de Supabase (la que configuraste al crear el proyecto).

9. `JWT_SECRET` y `JWT_REFRESH_SECRET` → Render los genera automáticamente (dejar así)
10. Clic en **Apply**

### Esperar:
- Build ~5 minutos
- Estado debe quedar **Live** (verde)

### Verificar:
Abrir en navegador: `https://gre-smart-api.onrender.com/api/health`
Debe mostrar: `"status":"ok"`

---

## PASO 2 — Vercel (Frontend)

### Botones a presionar:

1. Ir a **https://vercel.com/dashboard**
2. Clic en **Add New...** → **Project**
3. Clic en **Import** junto al repo **GRESMARTCONTROL**
4. En **Configure Project**:

| Campo | Valor |
|-------|-------|
| Framework Preset | Next.js |
| Root Directory | Clic **Edit** → escribir `apps/web` → **Continue** |
| Build Command | `npm run build` (default) |
| Install Command | `cd ../.. && npm install` |
| Output Directory | `.next` (default) |

5. Expandir **Environment Variables** y agregar:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://gre-smart-api.onrender.com/api` |
| `NEXT_PUBLIC_APP_URL` | `https://gre-smart-control.vercel.app` |
| `NEXT_PUBLIC_APP_NAME` | `GRE Smart Control` |

6. Clic en **Deploy**

### Esperar:
- Build ~3 minutos
- Copiar la URL que Vercel asigna (ej: `gre-smart-control-xxx.vercel.app`)

---

## PASO 3 — Conectar Frontend ↔ Backend

### Si Vercel te dio una URL diferente a `gre-smart-control.vercel.app`:

1. Volver a **Render Dashboard**
2. Clic en el servicio **gre-smart-api**
3. Clic en **Environment** (menú izquierdo)
4. Editar `CORS_ORIGIN` → pegar la URL exacta de Vercel (con `https://`, sin `/` al final)
5. Editar `APP_URL` si cambiaste el dominio de Render
6. Clic en **Save Changes** → Render redeploya solo

### En Vercel:
1. **Settings** → **Environment Variables**
2. Actualizar `NEXT_PUBLIC_APP_URL` con la URL real de Vercel
3. Ir a **Deployments** → clic en **...** del último deploy → **Redeploy**

---

## PASO 4 — Probar en producción

1. Abrir la URL de Vercel
2. Login: `admin@gre-demo.pe` / `Demo2024!`
3. Debe cargar el dashboard

### Si falla el login:
- Esperar 60 segundos (cold start de Render free tier)
- Verificar en DevTools → Network que las peticiones van a `gre-smart-api.onrender.com`

---

## URLs finales esperadas

| Servicio | URL |
|----------|-----|
| Frontend | `https://gre-smart-control.vercel.app` |
| Backend | `https://gre-smart-api.onrender.com/api` |
| Health | `https://gre-smart-api.onrender.com/api/health` |
| Supabase | Ya configurado |

---

## Credenciales demo

```
admin@gre-demo.pe      / Demo2024!
supervisor@gre-demo.pe / Demo2024!
consulta@gre-demo.pe   / Demo2024!
```
