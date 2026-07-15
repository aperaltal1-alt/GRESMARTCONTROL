# GRE SMART CONTROL

MVP para centralizar Guías de Remisión Electrónicas (GRE), Kardex, Stock Físico e Inventario con conciliación automática triple.

## Propuesta de valor

Detectar diferencias entre GRE, Kardex y Stock Físico **antes** de que se conviertan en riesgos tributarios.

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS, Shadcn UI |
| Backend | NestJS, TypeScript |
| Base de datos | PostgreSQL 16 |
| ORM | Prisma |
| Autenticación | JWT (access + refresh tokens) |

## Módulos del MVP

| Módulo | Descripción |
|--------|-------------|
| Dashboard Operativo | KPIs del día, alertas, actividad reciente |
| Dashboard Ejecutivo | Tendencias, KPIs agregados, slot Power BI |
| GRE | CRUD con archivos XML/PDF |
| Productos | Catálogo de productos |
| Kardex | Entradas, salidas, ajustes |
| Stock Físico | Conteos físicos independientes |
| Conciliación | Comparación triple automática |
| Trazabilidad | Timeline de mercadería end-to-end |
| Alertas | Stock insuficiente, diferencias, stock mínimo |
| Configuración | Empresas, parámetros, catálogos, series |
| Reportes | Exportación Excel y PDF |
| Auditoría | Registro completo de cambios |

## Fases de desarrollo

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Arquitectura del proyecto | ✅ Completada |
| 2 | Diseño UI/UX | ✅ Completada |
| 2.5 | Validación prototipo Premium | ✅ Completada (8.4/10) |
| 3 | Base de datos | ✅ Completada |
| 4 | Backend (estructura base) | ✅ Fase 4.1 + 4.2 |
| 5 | Frontend | Pendiente |
| 6 | Autenticación | Pendiente |
| 7 | CRUD Productos | Pendiente |
| 8 | CRUD GRE | Pendiente |
| 9 | Kardex y Stock Físico | Pendiente |
| 10 | Conciliación automática | Pendiente |
| 11 | Dashboards y Trazabilidad | Pendiente |
| 12 | Configuración y Reportes | Pendiente |
| 13 | Pruebas | Pendiente |

## Documentación

- [Arquitectura](./docs/ARCHITECTURE.md)
- [Modelo de datos](./docs/DATABASE.md)
- [Diseño UI/UX (Fase 2)](./docs/design/README.md)
- [Auditoría Fase 2.5](./docs/design/07-AUDITORIA-FASE-2.5.md)
- [Plan de fases](./docs/PHASES.md)

## Licencia

Proyecto académico / MVP demostrativo.
