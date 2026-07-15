# Diseño UI/UX — GRE SMART CONTROL

> Fase 2 — Guía de estilo visual y patrones de interfaz.
> Inspiración: Stripe, Linear, Notion, Vercel Dashboard, Odoo.

## 1. Identidad visual

### Personalidad de marca

| Atributo | Descripción |
|----------|-------------|
| Profesional | Transmite confianza para empresarios y auditores |
| Tecnológico | Interfaz moderna que sugiere innovación |
| Limpio | Sin ruido visual; cada elemento tiene propósito |
| Confiable | Colores sobrios, tipografía clara, estados bien definidos |

### Logo y nombre

```
┌──────────────────────────────────────┐
│  ◆  GRE Smart Control               │
│     Control inteligente de mercadería│
└──────────────────────────────────────┘
```

- Icono: diamante/hexágono con gradiente brand (indigo → violet)
- Nombre: "GRE Smart Control" en Inter Semibold
- Tagline: "Control inteligente de mercadería" en Inter Regular, muted

---

## 2. Paleta de colores

### Color primario — Indigo

| Token | Hex | Uso |
|-------|-----|-----|
| brand-500 | `#6366F1` | Botones primarios, links, iconos activos |
| brand-600 | `#4F46E5` | Hover de botones primarios |
| brand-50 | `#EEF2FF` | Fondos de items activos en sidebar |

### Colores semánticos

| Estado | Color | Fondo badge | Texto badge |
|--------|-------|-------------|-------------|
| Éxito / Conciliada | `#10B981` | `#D1FAE5` | `#065F46` |
| Advertencia / Pendiente | `#F59E0B` | `#FEF3C7` | `#92400E` |
| Error / Diferencia | `#EF4444` | `#FEE2E2` | `#991B1B` |
| Info | `#3B82F6` | `#EFF6FF` | `#1D4ED8` |
| Neutral / Anulada | `#64748B` | `#F1F5F9` | `#475569` |

### Modo claro vs oscuro

| Superficie | Claro | Oscuro |
|------------|-------|--------|
| Background | `#FFFFFF` | `#020617` |
| Background subtle | `#F8FAFC` | `#0F172A` |
| Card | `#FFFFFF` | `#0F172A` |
| Border | `#E2E8F0` | `#1E293B` |
| Text primary | `#0F172A` | `#F8FAFC` |
| Text muted | `#64748B` | `#94A3B8` |

---

## 3. Tipografía

### Familia

- **Principal:** Inter (Google Fonts) — legible, profesional, usado por Linear y Vercel
- **Monoespaciada:** JetBrains Mono — para códigos de producto, RUC, números GRE

### Escala tipográfica

| Nivel | Tamaño | Peso | Uso |
|-------|--------|------|-----|
| Display | 36px / 2.25rem | 700 | Títulos de dashboard ejecutivo |
| H1 | 30px / 1.875rem | 600 | Título de página |
| H2 | 24px / 1.5rem | 600 | Secciones |
| H3 | 20px / 1.25rem | 600 | Subsecciones, card titles |
| Body | 16px / 1rem | 400 | Texto general |
| Small | 14px / 0.875rem | 400 | Labels, metadata |
| Caption | 12px / 0.75rem | 500 | Badges, timestamps |

---

## 4. Layout SaaS

### Estructura general

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌──────────────────────────────────────────────┐  │
│ │          │ │  Header (56px)                                │  │
│ │          │ │  Breadcrumb · Search · Notifications · User  │  │
│ │ Sidebar  │ ├──────────────────────────────────────────────┤  │
│ │ (260px)  │ │                                               │  │
│ │          │ │  Content Area                                 │  │
│ │  Logo    │ │  (max-width: 1400px, padding: 24px)          │  │
│ │  Nav     │ │                                               │  │
│ │  groups  │ │                                               │  │
│ │          │ │                                               │  │
│ │  User    │ │                                               │  │
│ └──────────┘ └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Sidebar — Navegación

```
◆ GRE Smart Control
─────────────────────
PRINCIPAL
  ⊞ Dashboard Operativo
  ◫ Dashboard Ejecutivo

OPERACIONES
  📄 Guías de Remisión
  📦 Productos
  📊 Kardex
  📋 Stock Físico
  ⚖ Conciliación
  🔍 Trazabilidad

MONITOREO
  🔔 Alertas
  📑 Reportes

SISTEMA
  ⚙ Configuración
    ├ Empresas
    ├ Parámetros
    ├ Catálogos
    ├ Tipos de Documento
    ├ Series
    └ Estados

─────────────────────
  👤 Juan Pérez
     Administrador
```

### Header

- Altura fija: 56px
- Izquierda: Breadcrumb dinámico (`Dashboard > GRE > GRE-001`)
- Centro: Barra de búsqueda global (opcional en MVP)
- Derecha: Toggle tema · Notificaciones (badge con count) · Avatar + menú

---

## 5. Componentes del design system

### 5.1 KPI Card

```
┌─────────────────────────┐
│  Total GRE         📄   │
│                         │
│  128                    │
│  ▲ 12% vs mes anterior  │
└─────────────────────────┘
```

- Fondo: card-bg con border sutil
- Número: text-3xl, font-bold
- Trend: text-sm con color semántico (verde/rojo)
- Icono: esquina superior derecha, muted

### 5.2 Status Badge

| Estado | Variante |
|--------|----------|
| Pendiente | `warning` — fondo amarillo suave |
| Conciliada | `success` — fondo verde suave |
| Con Diferencia | `danger` — fondo rojo suave |
| Anulada | `neutral` — fondo gris suave |

### 5.3 Data Table

- Header: fondo subtle, text-sm font-medium, uppercase tracking
- Rows: hover con background-subtle, border-bottom
- Acciones: iconos ghost al final de cada fila
- Paginación: centrada debajo, estilo minimal
- Filtros: barra superior con inputs compactos

### 5.4 Timeline (Trazabilidad)

```
  ● GRE Emitida ─────────── 15/03/2024 09:30
  │  GRE-001 · 100 unidades de ARROZ-001
  │
  ● Archivo XML cargado ─── 15/03/2024 09:35
  │  guia_remision_001.xml
  │
  ● Movimiento Kardex ───── 15/03/2024 10:00
  │  Salida: -100 unidades
  │
  ● Stock Físico ────────── 15/03/2024 14:00
  │  Conteo: 95 unidades
  │
  ◆ Conciliación ────────── 15/03/2024 14:05
     ⚠ Diferencia detectada: 5 unidades
```

- Línea vertical conectando eventos
- Iconos circulares por tipo de evento
- Color del nodo según tipo (brand, success, warning, danger)
- Card expandible con metadata

### 5.5 Power BI Placeholder (Dashboard Ejecutivo)

```
┌─────────────────────────────────────────────────┐
│  Análisis avanzado                    [Beta]   │
│                                                 │
│         ┌─────────────────────────┐             │
│         │                         │             │
│         │    📊 Power BI          │             │
│         │    Próximamente         │             │
│         │                         │             │
│         │  Análisis interactivo    │             │
│         │  con Power BI Embedded  │             │
│         │                         │             │
│         └─────────────────────────┘             │
│                                                 │
└─────────────────────────────────────────────────┘
```

- Borde dashed, fondo subtle
- Icono centrado con texto descriptivo
- Badge "Beta" o "Próximamente"
- El componente `PowerBiEmbed` reemplazará este placeholder sin cambiar el layout

### 5.6 Formulario

- Labels: text-sm, font-medium, encima del input
- Inputs: border, radius-md, focus ring brand
- Secciones: separadas con títulos H3 y divider
- Acciones: botón primario derecha, secundario/ghost izquierda
- Validación: mensaje error en danger-500 debajo del campo

### 5.7 Alert Card

```
┌─────────────────────────────────────────────────┐
│ ⚠ Diferencia GRE vs Stock Físico          hace 2h│
│   Producto ARROZ-001: GRE declara 100, físico 95 │
│   [Ver incidencia]  [Marcar leída]               │
└─────────────────────────────────────────────────┘
```

- Borde izquierdo de 3px con color semántico
- Fondo danger-50 (o warning-50)
- Acciones inline

---

## 6. Patrones de pantalla

### Dashboard Operativo

- Grid 4 columnas de KPI cards en desktop, 2 en tablet, 1 en mobile
- Fila de 2 gráficos (movimientos + diferencias) con Recharts
- Columna derecha: alertas activas + actividad reciente
- Tabla inferior: últimas GRE registradas

### Dashboard Ejecutivo

- KPIs agregados más grandes (tendencias mensuales/trimestrales)
- Gráfico de tendencia de conciliación (línea temporal)
- Resumen por empresa (si multi-empresa)
- **Slot Power BI** ocupando 60% del ancho inferior
- Filtros de periodo: Mes / Trimestre / Año

### Listado (GRE, Productos, etc.)

- Header con título + botón "Nuevo" (primario, derecha)
- Barra de filtros: búsqueda, estado, fecha
- Data table con paginación
- Empty state ilustrado cuando no hay datos

### Detalle (GRE, Producto)

- Header con título + status badge + acciones
- Tabs: Información / Detalle / Archivos / Trazabilidad
- Formulario en modo lectura o edición según permisos

### Configuración

- Sub-navegación lateral con tabs verticales
- Formularios simples de CRUD
- Tablas compactas para catálogos

---

## 7. Responsive breakpoints

| Breakpoint | Ancho | Comportamiento |
|------------|-------|----------------|
| Mobile | < 768px | Sidebar colapsada (hamburger), cards en 1 columna |
| Tablet | 768–1024px | Sidebar colapsada (iconos), cards en 2 columnas |
| Desktop | 1024–1400px | Sidebar expandida, layout completo |
| Wide | > 1400px | Content max-width centrado |

---

## 8. Iconografía

- **Librería:** Lucide React (incluida con Shadcn UI)
- **Estilo:** Outline, 20px por defecto, stroke-width 1.5
- **Consistencia:** Un icono por módulo de navegación, siempre el mismo

| Módulo | Icono Lucide |
|--------|-------------|
| Dashboard Operativo | `LayoutDashboard` |
| Dashboard Ejecutivo | `BarChart3` |
| GRE | `FileText` |
| Productos | `Package` |
| Kardex | `ArrowLeftRight` |
| Stock Físico | `ClipboardList` |
| Conciliación | `Scale` |
| Trazabilidad | `Route` |
| Alertas | `Bell` |
| Reportes | `FileSpreadsheet` |
| Configuración | `Settings` |

---

## 9. Animaciones y micro-interacciones

| Elemento | Animación |
|----------|-----------|
| Sidebar toggle | Width transition 200ms ease |
| Theme switch | Background/color transition 150ms |
| Cards hover | Shadow elevation (sm → md) |
| Page transitions | Fade in 150ms |
| Toast notifications | Slide in from top-right |
| Loading states | Skeleton shimmer (Shadcn Skeleton) |
| KPI numbers | Count-up animation al cargar |

---

## 10. Accesibilidad

- Contraste mínimo WCAG AA (4.5:1 para texto)
- Focus visible con ring brand en todos los interactivos
- Labels asociados a inputs
- Navegación por teclado en sidebar y tablas
- `aria-label` en iconos sin texto
- Modo oscuro con contraste verificado

---

## 11. Shadcn UI — Componentes a instalar (Fase 5)

```
button, input, label, card, badge, table, dialog, dropdown-menu,
select, tabs, toast, skeleton, separator, avatar, sheet, command,
popover, tooltip, switch, checkbox, form, calendar, scroll-area
```

Todos personalizados con los design tokens definidos en `design-tokens.css`.
