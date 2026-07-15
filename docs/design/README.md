# GRE SMART CONTROL — Diseño UI/UX (Fase 2)

## Entregables completados

| # | Entregable | Archivo |
|---|-----------|---------|
| 1 | Manual de identidad visual | [01-IDENTIDAD-VISUAL.md](./01-IDENTIDAD-VISUAL.md) |
| 2 | Sistema de diseño (Design System) | [02-DESIGN-SYSTEM.md](./02-DESIGN-SYSTEM.md) |
| 3 | Guía de componentes | [03-GUIA-COMPONENTES.md](./03-GUIA-COMPONENTES.md) |
| 4 | Decisiones UX por pantalla | [04-DECISIONES-UX.md](./04-DECISIONES-UX.md) |
| 5 | Wireframes | [05-WIREFRAMES.md](./05-WIREFRAMES.md) |
| 6 | Mockups alta fidelidad | [06-MOCKUPS-HIFI.md](./06-MOCKUPS-HIFI.md) |
| 7 | Prototipo navegable | [`../../design/prototype/`](../../design/prototype/) |
| 8 | Validación v2.5 Premium | [07-AUDITORIA-FASE-2.5.md](./07-AUDITORIA-FASE-2.5.md) |
| 8 | Design tokens CSS | [`../../design/prototype/css/tokens.css`](../../design/prototype/css/tokens.css) |
| 9 | Librería de componentes | [03-GUIA-COMPONENTES.md](./03-GUIA-COMPONENTES.md) + prototipo |
| 10 | Responsive + Dark/Light | [02-DESIGN-SYSTEM.md](./02-DESIGN-SYSTEM.md) secciones 7-8 |

---

## Prototipo navegable

Abrir en el navegador:

```
design/prototype/login.html
```

### Pantallas (15)

1. `login.html` — Login premium
2. `dashboard-ejecutivo.html` — Dashboard Ejecutivo + Power BI slot
3. `dashboard-operativo.html` — Dashboard Operativo
4. `gre.html` — Guías de Remisión
5. `productos.html` — Productos (tabla + tarjetas)
6. `inventario.html` — Inventario
7. `kardex.html` — Kardex
8. `stock-fisico.html` — Stock Físico
9. `conciliacion.html` — Conciliación triple ★
10. `trazabilidad.html` — Trazabilidad timeline
11. `alertas.html` — Alertas
12. `incidencias.html` — Incidencias
13. `reportes.html` — Reportes
14. `configuracion.html` — Configuración
15. `usuarios.html` — Usuarios

### Funcionalidades del prototipo

- Navegación completa via sidebar
- Dark/Light mode toggle (persistente)
- Responsive (sidebar overlay en mobile)
- Iconos Lucide
- Animaciones CSS (fade-in, hover, pulse)
- Datos de demostración realistas

---

## Paleta de colores

| Color | Hex | Uso |
|-------|-----|-----|
| Azul Corporativo | `#2563EB` | Primario |
| Azul Claro | `#60A5FA` | Secundario |
| Éxito | `#22C55E` | Conciliada, OK |
| Advertencia | `#F59E0B` | Pendiente, stock bajo |
| Error | `#EF4444` | Diferencia, riesgo |
| Información | `#0EA5E9` | Tips, archivos |
| Fondo claro | `#F8FAFC` | Background |
| Fondo oscuro | `#0F172A` | Dark mode |

---

## Stack de implementación (Fase 5)

- Tailwind CSS + Shadcn UI
- Lucide React
- Framer Motion (animaciones documentadas en Design System)
- next-themes (dark mode)
- Recharts (gráficos)

---

## Próxima fase

**Fase 3 — Base de datos:** Schema Prisma con 17 tablas, migraciones y seed.
