# Manual de Identidad Visual
## GRE SMART CONTROL

---

## 1. Marca

### Nombre
**GRE SMART CONTROL**

### Slogan
*Control Inteligente para la Trazabilidad y Cumplimiento Tributario*

### Concepto visual
Software ERP moderno especializado en control logístico y tributario. Transmite la integración inteligente entre documentos electrónicos (GRE), registros contables (Kardex) y realidad física (Stock), con énfasis en trazabilidad, detección de inconsistencias y reducción de riesgos ante fiscalización.

### Personalidad de marca

| Atributo | Expresión visual |
|----------|------------------|
| **Profesionalismo** | Tipografía sobria, espaciado generoso, colores corporativos |
| **Tecnología** | Interfaces limpias, datos en tiempo real, gráficos precisos |
| **Innovación** | Conciliación triple visual, timeline de trazabilidad |
| **Seguridad** | Indicadores de riesgo tributario, auditoría visible |
| **Control empresarial** | KPIs ejecutivos, dashboards diferenciados por rol |
| **Inteligencia** | Alertas proactivas, comparaciones automáticas GRE-Kardex-Físico |

### Referentes de inspiración

| Plataforma | Elemento adoptado |
|------------|-------------------|
| SAP Fiori | Tiles de KPI, semántica de colores por estado |
| Microsoft Dynamics 365 | Layout empresarial, breadcrumbs contextuales |
| Oracle Fusion | Densidad de información controlada en tablas |
| Odoo Enterprise | Sidebar modular agrupado por función |
| Stripe Dashboard | Limpieza visual, cards con métricas claras |
| Linear | Microinteracciones sutiles, tipografía precisa |
| Notion | Jerarquía de contenido clara, espacios en blanco |
| Vercel Dashboard | Dark mode refinado, bordes sutiles |

---

## 2. Logotipo

### Construcción

```
┌────────────────────────────────────────┐
│                                        │
│   ┌──────┐                             │
│   │ ◆◆◆  │   GRE SMART CONTROL         │
│   │ ◆◆◆  │   Control Inteligente para  │
│   │ ◆◆◆  │   la Trazabilidad y         │
│   └──────┘   Cumplimiento Tributario   │
│                                        │
│   Icono: Hexágono con grid 3×3         │
│   Gradiente: #2563EB → #60A5FA         │
│                                        │
└────────────────────────────────────────┘
```

### Variantes

| Variante | Uso |
|----------|-----|
| **Completo** | Login, presentaciones, documentos |
| **Compacto** | Sidebar expandido |
| **Solo icono** | Sidebar colapsado, favicon, mobile |
| **Monocromo blanco** | Sobre fondos oscuros |
| **Monocromo azul** | Sobre fondos claros |

### Zona de protección
Margen mínimo equivalente al 50% del alto del icono en todos los lados.

### Tamaños mínimos
- Icono solo: 24px
- Compacto: 120px de ancho
- Completo: 200px de ancho

---

## 3. Paleta de colores

### Colores primarios

| Nombre | Hex | RGB | Uso |
|--------|-----|-----|-----|
| **Azul Corporativo** | `#2563EB` | 37, 99, 235 | Botones primarios, links, iconos activos, marca |
| **Azul Claro** | `#60A5FA` | 96, 165, 250 | Hover, acentos secundarios, gradientes |
| **Azul Oscuro** | `#1D4ED8` | 29, 78, 216 | Pressed states, sidebar activo (dark) |
| **Azul 50** | `#EFF6FF` | 239, 246, 255 | Fondos de selección, highlights |

### Colores semánticos

| Estado | Hex | Fondo (badge) | Texto (badge) | Uso |
|--------|-----|---------------|---------------|-----|
| **Éxito** | `#22C55E` | `#DCFCE7` | `#166534` | Conciliada, coincidencia, stock OK |
| **Advertencia** | `#F59E0B` | `#FEF3C7` | `#92400E` | Pendiente, stock mínimo, revisión |
| **Error** | `#EF4444` | `#FEE2E2` | `#991B1B` | Diferencia, riesgo tributario, incidencia |
| **Información** | `#0EA5E9` | `#E0F2FE` | `#075985` | Tips, ayuda contextual, archivos |

### Colores neutros

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| Background | `#FFFFFF` | `#0F172A` | Fondo principal |
| Background Subtle | `#F8FAFC` | `#1E293B` | Fondo de página, sidebar |
| Background Muted | `#F1F5F9` | `#334155` | Hover, zebra rows |
| Border | `#E2E8F0` | `#334155` | Bordes de cards, inputs, tablas |
| Text Primary | `#0F172A` | `#F8FAFC` | Títulos, contenido principal |
| Text Secondary | `#475569` | `#94A3B8` | Subtítulos, labels |
| Text Muted | `#94A3B8` | `#64748B` | Placeholders, timestamps |

### Indicador de Riesgo Tributario

Escala exclusiva del dashboard ejecutivo:

| Nivel | Color | Rango | Descripción |
|-------|-------|-------|-------------|
| **Bajo** | `#22C55E` | 0–25% | Sin incidencias críticas |
| **Moderado** | `#F59E0B` | 26–50% | Diferencias menores pendientes |
| **Alto** | `#F97316` | 51–75% | Múltiples incidencias sin resolver |
| **Crítico** | `#EF4444` | 76–100% | Riesgo inminente de observación SUNAT |

---

## 4. Tipografía

### Familia principal: Inter

```
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
```

### Escala tipográfica

| Token | Tamaño | Line-height | Peso | Uso |
|-------|--------|-------------|------|-----|
| `display` | 36px / 2.25rem | 1.2 | 700 Bold | KPIs grandes, dashboard ejecutivo |
| `h1` | 30px / 1.875rem | 1.3 | 600 SemiBold | Título de página |
| `h2` | 24px / 1.5rem | 1.35 | 600 SemiBold | Secciones principales |
| `h3` | 20px / 1.25rem | 1.4 | 600 SemiBold | Subsecciones, títulos de card |
| `h4` | 18px / 1.125rem | 1.45 | 500 Medium | Labels de grupo |
| `body` | 16px / 1rem | 1.5 | 400 Regular | Texto general |
| `body-sm` | 14px / 0.875rem | 1.5 | 400 Regular | Tablas, metadata |
| `caption` | 12px / 0.75rem | 1.4 | 500 Medium | Badges, timestamps, hints |

### Reglas de uso

- Máximo 3 niveles de jerarquía visible por pantalla
- Números de KPI siempre en Bold
- Códigos (RUC, GRE, producto) en `font-mono` JetBrains Mono 14px
- No usar más de 2 pesos en un mismo bloque de texto

---

## 5. Iconografía

**Librería:** Lucide Icons (outline, stroke-width 1.75, 20px default)

### Iconos por módulo

| Módulo | Icono | Justificación UX |
|--------|-------|------------------|
| Dashboard Ejecutivo | `BarChart3` | Visión estratégica, analítica |
| Dashboard Operativo | `LayoutDashboard` | Operaciones del día |
| GRE | `FileText` | Documento electrónico |
| Productos | `Package` | Catálogo de mercadería |
| Inventario | `Warehouse` | Control de almacén |
| Kardex | `ArrowLeftRight` | Movimientos entrada/salida |
| Conciliación | `Scale` | Comparación y equilibrio |
| Trazabilidad | `Route` | Recorrido de mercadería |
| Alertas | `Bell` | Notificaciones proactivas |
| Incidencias | `AlertTriangle` | Problemas por resolver |
| Reportes | `FileSpreadsheet` | Exportación de datos |
| Configuración | `Settings` | Administración del sistema |
| Usuarios | `Users` | Gestión de accesos |

### Tamaños

| Contexto | Tamaño |
|----------|--------|
| Sidebar | 20px |
| KPI card | 24px |
| Botones | 16px |
| Tabla acciones | 18px |
| Empty state | 48px |

---

## 6. Espaciado y grid

### Sistema de 4px

| Token | Valor | Uso |
|-------|-------|-----|
| `space-1` | 4px | Gaps mínimos |
| `space-2` | 8px | Padding interno compacto |
| `space-3` | 12px | Gaps entre elementos relacionados |
| `space-4` | 16px | Padding estándar |
| `space-6` | 24px | Padding de cards, secciones |
| `space-8` | 32px | Separación entre secciones |
| `space-12` | 48px | Margen de página |

### Grid de dashboard

- Desktop: 12 columnas, gap 24px
- KPI row: 4 columnas de 3 spans (o 3 de 4 spans)
- Content: 8 cols principal + 4 cols lateral

---

## 7. Bordes y sombras

### Border radius

| Token | Valor | Uso |
|-------|-------|-----|
| `radius-sm` | 6px | Badges, chips |
| `radius-md` | 8px | Inputs, botones |
| `radius-lg` | 12px | Cards, modales |
| `radius-xl` | 16px | Login card, panels grandes |

### Sombras

| Token | Valor | Uso |
|-------|-------|-----|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards en reposo |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.08)` | Cards hover, dropdowns |
| `shadow-lg` | `0 8px 24px rgba(0,0,0,0.12)` | Modales, drawer lateral |
| `shadow-brand` | `0 4px 14px rgba(37,99,235,0.25)` | Botón primario hover |

---

## 8. Fotografía e ilustración

### Login — Panel derecho
Ilustración vectorial empresarial que represente:
- Cadena de suministro conectada
- Documentos digitales (GRE)
- Almacén con control
- Estilo: líneas limpias, colores de marca (azul + gris), sin personajes caricaturescos

### Empty states
Iconos Lucide grandes (48px) + texto descriptivo + CTA. Sin ilustraciones complejas.

---

## 9. Tono de voz (UX Writing)

| Contexto | Tono | Ejemplo |
|----------|------|---------|
| Éxito | Confirmatorio, breve | "GRE conciliada correctamente" |
| Error | Claro, accionable | "Diferencia de 5 unidades detectada en ARROZ-001" |
| Vacío | Orientador | "No hay GRE registradas. Crea la primera guía." |
| Alerta | Urgente pero calmado | "Stock mínimo alcanzado en FIDEO-003" |
| Ayuda | Instructivo | "Sube el XML de SUNAT para almacenar el comprobante" |

---

## 10. Aplicaciones incorrectas

- No usar Bootstrap ni estilos genéricos
- No mezclar paleta indigo/violet de la versión anterior
- No usar más de 3 colores semánticos simultáneamente en una vista
- No colocar más de 7 items en un grupo de sidebar
- No usar tipografías decorativas
- No usar iconos filled (solo outline Lucide)
