# Design System — GRE SMART CONTROL
## Sistema de diseño completo para implementación en Fase 5

---

## 1. Fundamentos

### Stack de implementación (Fase 5)
| Tecnología | Rol |
|------------|-----|
| Tailwind CSS 4 | Utility classes + custom properties |
| Shadcn UI | Componentes base accesibles |
| Lucide React | Iconografía |
| Framer Motion | Microanimaciones |
| next-themes | Dark/Light mode |
| Recharts | Gráficos de dashboard |
| class-variance-authority | Variantes de componentes |

### Principios de diseño

1. **Claridad sobre decoración** — Cada pixel comunica información
2. **Consistencia semántica** — Mismo color = mismo significado en todo el sistema
3. **Progresión visual** — De lo general (dashboard) a lo específico (detalle)
4. **Feedback inmediato** — Toda acción tiene respuesta visual en <200ms
5. **Densidad adaptable** — Más compacto en tablas, más aire en dashboards

---

## 2. Tokens de diseño

Archivo de referencia: `design/prototype/css/tokens.css`

### Colores (CSS Custom Properties)

```css
/* Brand */
--brand-primary:    #2563EB;
--brand-secondary:  #60A5FA;
--brand-dark:       #1D4ED8;
--brand-50:         #EFF6FF;

/* Semantic */
--success:          #22C55E;
--warning:          #F59E0B;
--error:            #EF4444;
--info:             #0EA5E9;

/* Surfaces - Light */
--bg-primary:       #FFFFFF;
--bg-secondary:     #F8FAFC;
--bg-tertiary:      #F1F5F9;

/* Surfaces - Dark */
--bg-primary-dark:  #0F172A;
--bg-secondary-dark:#1E293B;
--bg-tertiary-dark: #334155;
```

### Mapeo a Tailwind (Fase 5)

```js
// tailwind.config.ts
colors: {
  brand: {
    DEFAULT: '#2563EB',
    light: '#60A5FA',
    dark: '#1D4ED8',
    50: '#EFF6FF',
  },
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
}
```

---

## 3. Layout System

### Estructura SaaS

```
┌─────────────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌──────────────────────────────────────────┐  │
│ │ SIDEBAR  │ │ HEADER (56px)                             │  │
│ │ 260px    │ │ Breadcrumb │ Search │ 🔔 │ 🌙 │ Avatar    │  │
│ │ fijo     │ ├──────────────────────────────────────────┤  │
│ │          │ │                                           │  │
│ │ Logo     │ │  MAIN CONTENT                             │  │
│ │ Nav      │ │  padding: 24px                            │  │
│ │ Groups   │ │  max-width: 1440px                        │  │
│ │          │ │                                           │  │
│ │ Footer   │ │                                           │  │
│ │ user     │ ├──────────────────────────────────────────┤  │
│ │          │ │ FOOTER: v0.1.0 · © GRE Smart Control      │  │
│ └──────────┘ └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Dimensiones fijas

| Elemento | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Sidebar | 260px | 68px (iconos) | Overlay 280px |
| Header | 56px | 56px | 48px |
| Content padding | 24px | 16px | 12px |
| Footer | 40px | 40px | Oculto |

### Z-index scale

| Capa | Valor | Elemento |
|------|-------|----------|
| Base | 0 | Contenido |
| Dropdown | 50 | Menús, selects |
| Sticky | 100 | Header |
| Sidebar overlay | 200 | Mobile sidebar |
| Modal | 300 | Diálogos |
| Toast | 400 | Notificaciones |

---

## 4. Navegación (Sidebar)

### Estructura de grupos

```
PRINCIPAL
  ⊞ Dashboard Ejecutivo
  ◫ Dashboard Operativo

OPERACIONES
  📄 GRE
  📦 Productos
  🏭 Inventario
  ↔ Kardex
  ⚖ Conciliación
  🔍 Trazabilidad

CONTROL
  🔔 Alertas
  ⚠ Incidencias
  📑 Reportes

SISTEMA
  ⚙ Configuración
  👥 Usuarios
```

### Estados del item

| Estado | Visual |
|--------|--------|
| Default | Text secondary, icon muted |
| Hover | Background tertiary, text primary |
| Active | Background brand-50, text brand, border-left 3px brand |
| Disabled | Opacity 40%, no pointer |

### Animación (Framer Motion)
```tsx
// Sidebar item hover
whileHover={{ x: 2 }}
transition={{ duration: 0.15 }}

// Sidebar collapse
animate={{ width: collapsed ? 68 : 260 }}
transition={{ duration: 0.2, ease: 'easeInOut' }}
```

---

## 5. Header

### Elementos (izquierda → derecha)

1. **Hamburger** (mobile/tablet only)
2. **Breadcrumb** — `Dashboard Ejecutivo > Conciliación > GRE-050`
3. **Spacer**
4. **Search** — `⌘K` shortcut, búsqueda global
5. **Notifications** — Bell icon + badge count
6. **Theme toggle** — Sun/Moon
7. **User menu** — Avatar + nombre + rol + dropdown

---

## 6. Patrones de página

### Tipo A: Dashboard
- Page title + periodo selector
- KPI row (4-7 cards)
- Charts row (2/3 + 1/3 split)
- Tables/widgets row

### Tipo B: Listado (CRUD)
- Page title + CTA primario ("Nueva GRE")
- Filter bar (search + dropdowns + date range)
- Data table con paginación
- Empty state si no hay datos

### Tipo C: Detalle
- Page title + status badge + acciones
- Tabs: Info | Detalle | Archivos | Trazabilidad
- Content cards
- Sidebar panel (opcional) para acciones rápidas

### Tipo D: Comparación (Conciliación)
- Page title + botón "Conciliar nuevamente"
- Resumen KPIs de incidencias
- Visualización triple GRE ↔ Kardex ↔ Físico
- Tabla de incidencias con acciones

### Tipo E: Timeline (Trazabilidad)
- Buscador prominente
- Timeline vertical con eventos
- Cards expandibles por evento
- Filtros por tipo de evento

---

## 7. Dark Mode

### Estrategia
- `next-themes` con `class="dark"` en `<html>`
- Todos los tokens tienen par `--*` y `--*-dark`
- Transición suave: `transition: background-color 0.2s, color 0.2s`

### Reglas dark mode

| Elemento | Light | Dark |
|----------|-------|------|
| Page background | `#F8FAFC` | `#0F172A` |
| Card background | `#FFFFFF` | `#1E293B` |
| Card border | `#E2E8F0` | `#334155` |
| Sidebar | `#FFFFFF` | `#1E293B` |
| Input background | `#FFFFFF` | `#0F172A` |
| Table header | `#F8FAFC` | `#1E293B` |
| Table row hover | `#F8FAFC` | `#334155` |
| Shadow | rgba(0,0,0,0.08) | rgba(0,0,0,0.3) |

### Gráficos en dark mode
- Grid lines: `#334155`
- Text labels: `#94A3B8`
- Tooltip background: `#1E293B`
- Series colors: mantener semánticos con opacity 0.9

---

## 8. Responsive Design

### Breakpoints

| Nombre | Rango | Layout |
|--------|-------|--------|
| `mobile` | 0–639px | 1 columna, sidebar overlay, tablas → cards |
| `tablet` | 640–1023px | 2 columnas KPI, sidebar colapsado |
| `laptop` | 1024–1279px | Layout completo, sidebar expandido |
| `desktop` | 1280px+ | Layout completo + max-width centrado |

### Adaptaciones por breakpoint

**Mobile:**
- Sidebar → drawer overlay con backdrop
- KPI cards → stack vertical (1 col)
- Tablas → card list con campos clave
- Breadcrumb → solo último nivel
- Search → icono que abre modal
- Conciliación triple → stack vertical con flechas

**Tablet:**
- Sidebar → solo iconos (68px), tooltip on hover
- KPI → 2 columnas
- Charts → stack vertical
- Filter bar → wrap en 2 filas

**Desktop:**
- Layout completo según wireframes

---

## 9. Microanimaciones (Framer Motion)

### Catálogo de animaciones

| Elemento | Animación | Duración | Easing |
|----------|-----------|----------|--------|
| Page enter | fade + slideUp 8px | 200ms | easeOut |
| KPI card | fade + scale 0.95→1 | 300ms | spring |
| KPI number | countUp | 800ms | easeOut |
| Card hover | y: -2px, shadow increase | 150ms | ease |
| Button hover | brightness 1.05 | 150ms | ease |
| Button press | scale 0.97 | 100ms | ease |
| Sidebar item | x: 2px | 150ms | ease |
| Table row hover | background fade | 150ms | ease |
| Modal open | fade + scale 0.95→1 | 200ms | spring |
| Toast | slideIn from right | 300ms | spring |
| Timeline node | stagger fadeIn | 100ms each | ease |
| Alert badge pulse | scale 1→1.1→1 | 2s loop | ease |
| Skeleton | shimmer gradient | 1.5s loop | linear |
| Theme switch | rotate 180° | 300ms | ease |

### Implementación de referencia (Fase 5)
```tsx
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};
```

---

## 10. Accesibilidad (WCAG 2.1 AA)

| Criterio | Implementación |
|----------|----------------|
| Contraste texto | Mínimo 4.5:1 (verificado en ambos modos) |
| Focus visible | Ring 2px brand con offset 2px |
| Keyboard nav | Tab order lógico, Escape cierra modales |
| Screen readers | aria-label en iconos, role en tablas |
| Color no único indicador | Iconos + texto acompañan colores semánticos |
| Touch targets | Mínimo 44×44px en mobile |

---

## 11. Shadcn UI — Configuración

### Tema Shadcn (Fase 5)
```css
:root {
  --background: 210 40% 98%;      /* #F8FAFC */
  --foreground: 222 47% 11%;     /* #0F172A */
  --primary: 217 91% 53%;        /* #2563EB */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --muted: 210 40% 96%;
  --accent: 210 40% 96%;
  --destructive: 0 84% 60%;      /* #EF4444 */
  --border: 214 32% 91%;
  --ring: 217 91% 53%;
  --radius: 0.5rem;
}

.dark {
  --background: 222 47% 11%;     /* #0F172A */
  --foreground: 210 40% 98%;
  --primary: 217 91% 60%;
  --border: 217 33% 17%;
}
```

### Componentes Shadcn a instalar
`button` `input` `label` `card` `badge` `table` `dialog` `dropdown-menu` `select` `tabs` `toast` `skeleton` `separator` `avatar` `sheet` `command` `popover` `tooltip` `switch` `checkbox` `form` `calendar` `scroll-area` `progress` `alert` `breadcrumb` `navigation-menu`
