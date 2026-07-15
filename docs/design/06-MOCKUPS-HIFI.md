# Mockups de Alta Fidelidad — GRE SMART CONTROL

> Los mockups hi-fi están implementados como **prototipo navegable HTML**
> en `design/prototype/`. Este documento describe cada pantalla, sus decisiones
> visuales y cómo validarlas.

---

## Cómo acceder al prototipo

1. Abrir `design/prototype/login.html` en el navegador
2. Navegar con el sidebar entre las 15 pantallas
3. Usar el botón 🌙/☀ en el header para alternar Dark/Light mode
4. Redimensionar la ventana para validar responsive

**Pantallas incluidas:** Login, Dashboard Ejecutivo, Dashboard Operativo, GRE, Productos, Inventario, Kardex, Stock Físico, Conciliación, Trazabilidad, Alertas, Incidencias, Reportes, Configuración, Usuarios.

---

## 1. Login (Premium)

**Archivo:** `login.html`

| Elemento | Especificación |
|----------|---------------|
| Layout | Split 42/58 — formulario izquierda, branding derecha |
| Logo | Hexágono 56px con gradiente `#2563EB → #60A5FA` |
| Título | Inter Bold 28px |
| Slogan | Inter Regular 14px, muted |
| Inputs | Height 42px, border `#E2E8F0`, focus ring brand |
| CTA | Botón primary full-width, 48px height |
| Panel derecho | Gradiente brand-50 → brand-secondary |
| Animación | Fade-in del formulario al cargar |

**UX:** Primera impresión enterprise. Sin distracciones. Credenciales demo pre-cargadas.

---

## 2. Dashboard Ejecutivo (Pantalla estrella)

**Archivo:** `dashboard-ejecutivo.html`

| Sección | Componentes | Datos demo |
|---------|-------------|------------|
| Header | Period selector (Mes/Trimestre/Año) | Mes activo |
| KPI Row 1 | Risk Gauge + 6 KPI cards | Riesgo 32% Moderado |
| Charts Row 1 | Line chart + Donut chart | 6 meses conciliación |
| Charts Row 2 | Area chart + Activity timeline | Diferencias mensuales |
| Power BI Slot | Placeholder dashed border | "Próximamente" badge |

**Colores clave:**
- Riesgo Moderado: `#F59E0B` (warning)
- KPI trends positivos: `#22C55E` (success)
- KPI trends negativos: `#EF4444` (error)

**Responsive:**
- Desktop: 7 KPIs en grid auto-fit
- Tablet: 2 columnas KPI
- Mobile: 1 columna stack

---

## 3. Dashboard Operativo

**Archivo:** `dashboard-operativo.html`

| Widget | Posición | Contenido |
|--------|----------|-----------|
| 4 KPIs | Top row | GRE Hoy, Pendientes, Diferencias, Stock |
| Movimientos chart | Left 2/3 | Bar chart 7 días |
| Alertas activas | Right 1/3 | 3 alert cards con borde semántico |
| Actividad reciente | Right 1/3 (below alerts) | Mini timeline 3 eventos |
| Últimas GRE | Full width | Tabla 3 filas con badges |
| Productos críticos | Full width | Tabla con stock en rojo |

---

## 4. Conciliación (Pantalla más importante)

**Archivo:** `conciliacion.html`

| Elemento | Descripción visual |
|----------|-------------------|
| Step progress | 4 pasos: GRE → Kardex → Conciliación → Resultado |
| Comparison grid | 3 columnas: GRE / Kardex / Físico con flechas ≠ o = |
| Match state | Borde verde `#22C55E`, fondo `#DCFCE7` |
| Mismatch state | Borde rojo `#EF4444`, fondo `#FEE2E2` |
| Delta indicators | `△ +N` debajo de cada valor que difiere |
| Summary alert | Banner rojo con resumen de 3 diferencias |
| Incidencias table | 8 columnas con botón "Resolver" |

**UX:** El usuario ve de un vistazo si GRE, Kardex y Físico coinciden. Sin cálculos mentales.

---

## 5. Trazabilidad

**Archivo:** `trazabilidad.html`

| Evento | Color nodo | Icono |
|--------|-----------|-------|
| GRE Emitida | Brand `#2563EB` | file-text |
| Archivo cargado | Brand | upload |
| Movimiento Kardex | Warning `#F59E0B` | arrow-left-right |
| Stock Físico | Warning | clipboard-list |
| Conciliación OK | Success | check |
| Conciliación FAIL | Error | alert-triangle |
| Incidencia | Error | alert-octagon |

**Línea conectora:** 2px solid `#E2E8F0` (light) / `#334155` (dark)

---

## 6. GRE

**Archivo:** `gre.html`

- Tabla con 9 columnas incluyendo archivos adjuntos
- Badges para XML (info) y PDF (neutral)
- Upload zone con borde dashed
- Archivo subido con barra de progreso
- Paginación funcional visual

---

## 7–15. Demás pantallas

| Pantalla | Archivo | Highlight visual |
|----------|---------|-----------------|
| Productos | `productos.html` | Toggle tabla/tarjetas, stock bajo en rojo |
| Inventario | `inventario.html` | 4 KPIs almacén, semáforo disponible |
| Kardex | `kardex.html` | Badges por tipo movimiento (E/S/A) |
| Stock Físico | `stock-fisico.html` | Comparación inline ✓/⚠, botón Conciliar |
| Alertas | `alertas.html` | Cards con borde izquierdo semántico, tabs |
| Incidencias | `incidencias.html` | Tabla formal con estados y tipos |
| Reportes | `reportes.html` | 4 report cards con acciones Excel/PDF/Preview |
| Configuración | `configuracion.html` | Sub-nav lateral + tabla empresas |
| Usuarios | `usuarios.html` | Roles con badges de color |

---

## Dark Mode — Todas las pantallas

| Token | Light | Dark |
|-------|-------|------|
| Page BG | `#F8FAFC` | `#0F172A` |
| Card BG | `#FFFFFF` | `#1E293B` |
| Sidebar BG | `#FFFFFF` | `#1E293B` |
| Text | `#0F172A` | `#F8FAFC` |
| Border | `#E2E8F0` | `#334155` |
| Brand active | `#EFF6FF` | `rgba(37,99,235,0.15)` |

Toggle persistente via `localStorage`.

---

## Responsive — Breakpoints validados

| Breakpoint | Comportamiento verificado |
|------------|--------------------------|
| ≥1280px | Layout completo, sidebar 260px |
| 1024–1279px | Sidebar 260px, grids adaptan |
| 640–1023px | Sidebar overlay, search oculto, grids 1 col |
| <640px | Padding reducido, tablas scroll horizontal |

---

## Mapeo a componentes React (Fase 5)

| Prototipo HTML | Componente React | Shadcn base |
|----------------|-----------------|-------------|
| `.kpi-card` | `<KpiCard />` | Card |
| `.badge-*` | `<StatusBadge />` | Badge |
| `.comparison-grid` | `<TripleComparison />` | Custom |
| `.timeline` | `<TraceabilityTimeline />` | Custom |
| `.alert-card` | `<AlertCard />` | Alert |
| `.powerbi-slot` | `<PowerBiPlaceholder />` | Custom |
| `.sidebar` | `<AppSidebar />` | Sheet (mobile) |
| `.header` | `<AppHeader />` | Custom |
| `.upload-zone` | `<FileUpload />` | Custom |
| `.steps` | `<StepProgress />` | Custom |
| `.risk-gauge` | `<RiskIndicator />` | Progress |

---

## Checklist de validación UX

- [x] Usuario puede navegar todas las pantallas sin instrucciones
- [x] Colores semánticos consistentes en todo el sistema
- [x] Conciliación triple visible sin cálculo mental
- [x] Trazabilidad narrativa cronológica clara
- [x] Dark mode funcional en todas las pantallas
- [x] Responsive adapta sidebar y grids
- [x] Power BI slot preparado sin romper layout
- [x] Alertas e incidencias visualmente diferenciadas
- [x] Login transmite profesionalismo enterprise
- [x] Dashboard Ejecutivo destaca riesgo tributario
