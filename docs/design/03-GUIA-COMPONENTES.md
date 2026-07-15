# Guía de Componentes — GRE SMART CONTROL
## Librería de componentes reutilizables

---

## 1. Botones

### Variantes

| Variante | Uso | Estilo |
|----------|-----|--------|
| **Primary** | Acción principal (Guardar, Crear) | bg brand, text white, shadow-brand on hover |
| **Secondary** | Acción secundaria (Cancelar) | bg transparent, border, text primary |
| **Ghost** | Acciones terciarias (iconos tabla) | bg transparent, text secondary, hover bg tertiary |
| **Destructive** | Eliminar, anular | bg error, text white |
| **Outline** | Filtros, toggles | border brand, text brand |

### Tamaños

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 32px | 12px | 14px |
| `md` | 40px | 16px | 14px |
| `lg` | 48px | 24px | 16px |
| `icon` | 36px | 8px | — |

### Estados
- **Default** → colores base
- **Hover** → brightness/background change + shadow
- **Active/Pressed** → scale(0.97)
- **Disabled** → opacity 50%, cursor not-allowed
- **Loading** → spinner + text "Procesando..."

### Anatomía
```
┌─────────────────────────┐
│  [icon]  Guardar GRE    │  ← icon opcional izquierda
└─────────────────────────┘
  radius-md · font-medium · transition 150ms
```

---

## 2. Cards

### Variantes

| Variante | Uso |
|----------|-----|
| **KPI Card** | Métricas numéricas en dashboard |
| **Content Card** | Secciones de contenido, formularios |
| **Alert Card** | Alertas e incidencias |
| **Comparison Card** | Conciliación triple |
| **Stat Card** | Estadísticas con trend |

### KPI Card
```
┌──────────────────────────────┐
│  Total GRE            📄     │  ← label + icon
│                              │
│  128                         │  ← valor display bold
│  ▲ 12.5% vs mes anterior    │  ← trend (verde/rojo)
└──────────────────────────────┘
```
- Min-height: 120px
- Padding: 24px
- Border: 1px border
- Hover: shadow-md + y:-2px

### Comparison Card (Conciliación)
```
┌──────────────────────────────────────────────┐
│  ARROZ-001 · Arroz Premium                   │
│                                              │
│   GRE          Kardex        Físico          │
│  ┌────┐       ┌────┐       ┌────┐           │
│  │100 │  ≠    │ 98 │  ≠    │ 95 │           │
│  └────┘       └────┘       └────┘           │
│           ⚠ 3 diferencias detectadas        │
└──────────────────────────────────────────────┘
```

---

## 3. Inputs

### Tipos

| Tipo | Uso |
|------|------|
| Text | Campos generales |
| Email | Login, usuarios |
| Password | Login (con toggle visibility) |
| Number | Cantidades, stock |
| Search | Búsqueda global y filtros |
| Select | Dropdowns (estado, categoría) |
| Date | Filtros de fecha |
| Textarea | Observaciones |
| File | Upload XML/PDF |

### Anatomía
```
Label *                    ← font-medium 14px
┌────────────────────────┐
│ Placeholder text    🔍 │ ← height 40px, radius-md, border
└────────────────────────┘
Mensaje de ayuda           ← caption 12px muted
```

### Estados
- Default: border neutral
- Focus: ring 2px brand, border brand
- Error: border error, mensaje error debajo
- Disabled: bg muted, opacity 60%

---

## 4. Tablas (Data Table)

### Estructura
```
┌──────────────────────────────────────────────────────┐
│ ☐ │ Número  │ Serie │ Fecha  │ Estado  │ Acciones  │ ← header bg subtle
├───┼─────────┼───────┼────────┼─────────┼───────────┤
│ ☐ │ GRE-050 │ T001  │ 07/07  │ ●Pend.  │ 👁 ✏ 🗑  │ ← hover bg subtle
│ ☐ │ GRE-049 │ T001  │ 06/07  │ ●Concil │ 👁       │
└──────────────────────────────────────────────────────┘
  Mostrando 1-20 de 128        ◄ 1 2 3 4 5 ►
```

### Features
- Checkbox selección múltiple (header)
- Sort por columna (click header)
- Paginación inferior
- Responsive: en mobile → card list
- Row hover con transición 150ms
- Acciones: iconos ghost (ver, editar, eliminar)
- Empty state centrado

---

## 5. Badges (Status)

| Estado | Color | Ejemplo |
|--------|-------|---------|
| Pendiente | Warning | `● Pendiente` |
| Conciliada | Success | `● Conciliada` |
| Con Diferencia | Error | `● Con Diferencia` |
| Anulada | Neutral | `● Anulada` |
| En Revisión | Info | `● En Revisión` |
| Resuelta | Success | `● Resuelta` |

### Anatomía
```
┌──────────────┐
│ ● Pendiente  │  ← dot 6px + text caption medium
└──────────────┘
  padding: 4px 10px · radius-full · bg semantic-50
```

---

## 6. Alertas (Alert Cards)

### Variantes

| Tipo | Borde izquierdo | Icono | Uso |
|------|-----------------|-------|-----|
| Error | 3px error | `AlertTriangle` | Diferencias, riesgo |
| Warning | 3px warning | `AlertCircle` | Stock mínimo, pendientes |
| Info | 3px info | `Info` | Información general |
| Success | 3px success | `CheckCircle` | Conciliación exitosa |

### Anatomía
```
┌─────────────────────────────────────────────────────┐
│▌ ⚠ Diferencia GRE vs Stock Físico          hace 2h│
│▌   ARROZ-001: GRE declara 100, físico tiene 95     │
│▌   [Ver incidencia]  [Marcar leída]                 │
└─────────────────────────────────────────────────────┘
```

---

## 7. Modales (Dialog)

### Tamaños

| Size | Width | Uso |
|------|-------|-----|
| `sm` | 400px | Confirmaciones |
| `md` | 560px | Formularios simples |
| `lg` | 720px | Formularios complejos (GRE) |
| `xl` | 900px | Vista previa archivos |

### Anatomía
```
┌─────────────────────────────────────┐
│  Título del modal              ✕   │
├─────────────────────────────────────┤
│                                     │
│  Contenido                          │
│                                     │
├─────────────────────────────────────┤
│              [Cancelar] [Confirmar] │
└─────────────────────────────────────┘
  overlay: bg black/50 · animation: fade + scale
```

---

## 8. Dropdown

### Usos
- User menu (perfil, configuración, logout)
- Acciones de tabla (bulk actions)
- Filtros de estado/categoría

### Anatomía
```
┌──────────────────┐
│ 👤 Juan Pérez  ▾ │
└──────────────────┘
  ┌──────────────────┐
  │ Mi perfil        │
  │ Configuración    │
  │ ─────────────── │
  │ Cerrar sesión    │
  └──────────────────┘
```

---

## 9. Sidebar

Ver Design System sección 4. Componente principal de navegación.

### Sub-componentes
- `SidebarLogo` — Logo + nombre (colapsable)
- `SidebarGroup` — Título de grupo + items
- `SidebarItem` — Icon + label + badge opcional
- `SidebarUser` — Avatar + nombre + rol
- `SidebarCollapse` — Toggle button

---

## 10. Navbar (Header)

Ver Design System sección 5.

### Sub-componentes
- `BreadcrumbNav` — Ruta contextual
- `GlobalSearch` — Command palette (⌘K)
- `NotificationBell` — Icon + badge count
- `ThemeToggle` — Sun/Moon switch
- `UserMenu` — Avatar dropdown

---

## 11. KPIs

### Componente `KpiCard`
```tsx
<KpiCard
  label="Total GRE"
  value={128}
  trend={{ value: 12.5, direction: 'up' }}
  icon="FileText"
  color="brand"
/>
```

### Componente `RiskIndicator` (exclusivo ejecutivo)
```
┌────────────────────────────────┐
│  Riesgo Tributario             │
│                                │
│      ┌─────────┐               │
│      │  32%    │  ← gauge      │
│      │ MODERADO│               │
│      └─────────┘               │
│  ████████░░░░░░░░░░░░          │
└────────────────────────────────┘
```

---

## 12. Gráficos (Recharts)

| Gráfico | Pantalla | Tipo |
|---------|----------|------|
| Movimientos diarios | Dashboard Operativo | Bar chart |
| Tendencia conciliación | Dashboard Ejecutivo | Line chart |
| Stock por categoría | Dashboard Ejecutivo | Donut chart |
| Diferencias por mes | Dashboard Ejecutivo | Area chart |
| Distribución alertas | Dashboard Operativo | Pie chart |

### Estilo común
- Sin bordes en chart area
- Grid: líneas punteadas, color border token
- Tooltip: card style con shadow
- Legend: debajo del gráfico, horizontal
- Colores: brand, success, warning, error

---

## 13. Timeline

### Uso: Trazabilidad, Kardex, Actividad

```
  ●─── GRE Emitida ─────────── 07/07/2026 09:30
  │    GRE-050 · 100 unidades ARROZ-001
  │
  ●─── Archivo XML cargado ─── 07/07/2026 09:35
  │    guia_remision_050.xml (24 KB)
  │
  ●─── Salida Kardex ───────── 07/07/2026 10:00
  │    -100 unidades · Stock: 198 → 98
  │
  ◆─── Conciliación ────────── 07/07/2026 14:05
       ⚠ Diferencia: GRE(100) vs Físico(95) = +5
```

### Nodos
| Tipo | Icono | Color nodo |
|------|-------|------------|
| Documento | `FileText` | Brand |
| Movimiento | `ArrowLeftRight` | Info |
| Conteo | `ClipboardList` | Warning |
| Conciliación OK | `CheckCircle` | Success |
| Conciliación FAIL | `AlertTriangle` | Error |
| Incidencia | `AlertOctagon` | Error |

### Animación
- Nodos aparecen con stagger (100ms entre cada uno)
- Línea conectora se dibuja progresivamente

---

## 14. Progress

### Variantes

| Variante | Uso |
|----------|-----|
| **Bar** | Stock vs mínimo, conciliación % |
| **Gauge** | Riesgo tributario |
| **Steps** | Flujo de conciliación (3 pasos) |

### Step Progress (Conciliación)
```
  ✓ GRE Registrada  →  ✓ Kardex Actualizado  →  ◉ Conciliación
  ─────────────────────────────────────────────────────────
  verde                  verde                      azul (activo)
```

---

## 15. Widgets

| Widget | Pantalla | Contenido |
|--------|----------|-----------|
| `RecentActivity` | Dashboard Operativo | Últimas 10 acciones |
| `LatestGre` | Dashboard Operativo | Tabla compacta 5 GRE |
| `CriticalProducts` | Dashboard Operativo | Productos bajo mínimo |
| `ActiveAlerts` | Ambos dashboards | Top 5 alertas |
| `PowerBiSlot` | Dashboard Ejecutivo | Placeholder Power BI |
| `ConciliationSummary` | Dashboard Ejecutivo | % conciliación por mes |
| `TripleComparison` | Conciliación | GRE vs Kardex vs Físico |
| `FilePreview` | GRE detalle | Preview XML/PDF |

---

## 16. Footer

```
┌─────────────────────────────────────────────────────────────┐
│  GRE Smart Control v0.1.0  ·  © 2026  ·  Soporte  ·  Docs  │
└─────────────────────────────────────────────────────────────┘
```
- Height: 40px
- Font: caption muted
- Border-top: 1px border
- Oculto en mobile

---

## 17. Empty States

```
┌─────────────────────────────────────┐
│                                     │
│           📄 (48px icon)            │
│                                     │
│     No hay GRE registradas          │
│     Crea tu primera guía de         │
│     remisión para comenzar.         │
│                                     │
│        [+ Nueva GRE]                │
│                                     │
└─────────────────────────────────────┘
```

---

## 18. Loading States

- **Skeleton** — Para cards, tablas, KPIs (shimmer animation)
- **Spinner** — Para botones en loading
- **Progress bar** — Para uploads de archivos
- **Pulse** — Para badge de notificaciones

---

## 19. File Upload

```
┌─────────────────────────────────────────────────┐
│                                                 │
│     📎  Arrastra archivos XML o PDF aquí       │
│         o haz clic para seleccionar             │
│                                                 │
│     Formatos: .xml, .pdf · Máximo 10 MB        │
│                                                 │
└─────────────────────────────────────────────────┘
  border: 2px dashed border · hover: border brand
```

### Archivo subido
```
┌─────────────────────────────────────────────────┐
│  📄 guia_remision_050.xml  · 24 KB  ·  ✕      │
│  ████████████████████░░░░  85%                   │
└─────────────────────────────────────────────────┘
```

---

## 20. Drawer (Panel lateral)

### Uso: Detalle rápido de GRE desde listado

```
                    ┌────────────────────────┐
                    │  GRE-050          ✕   │
                    │  ● Pendiente          │
                    ├────────────────────────┤
                    │  Fecha: 07/07/2026    │
                    │  Transportista: Trans A│
                    │  Productos: 2          │
                    │  Archivos: 1 XML       │
                    │                       │
                    │  [Ver detalle completo]│
                    └────────────────────────┘
  Width: 400px · slide from right · overlay backdrop
```
