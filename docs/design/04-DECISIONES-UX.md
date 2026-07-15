# Decisiones UX por Pantalla
## GRE SMART CONTROL — Fase 2

> Cada pantalla está diseñada para resolver un problema específico del usuario
> y facilitar la integración GRE + Kardex + Stock Físico sin capacitación.

---

## Problema central que resuelve el diseño

Las empresas operan con **tres fuentes de verdad desconectadas**:
1. **GRE** — Lo que dice el documento tributario
2. **Kardex** — Lo que dice el registro contable
3. **Stock Físico** — Lo que realmente hay en almacén

El diseño UX prioriza la **visibilidad de las diferencias** entre estas tres fuentes y la **trazabilidad** del recorrido de cada producto.

---

## 1. Login

### Problema UX
Primera impresión. Debe transmitir confianza empresarial y seguridad.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Split layout (form + ilustración) | Patrón enterprise (Dynamics, SAP) que separa acción de branding |
| Logo grande centrado | Refuerza identidad de marca |
| Slogan visible | Comunica valor inmediatamente |
| "Recordarme" checkbox | Reduce fricción para usuarios frecuentes |
| Animación sutil de entrada | Transmite modernidad sin distraer (fade-in del card) |
| Ilustración de cadena logística | Refuerza el concepto de trazabilidad |
| Sin registro público | Es software empresarial; el admin crea usuarios |

### Flujo
```
Usuario llega → Ve marca y slogan → Ingresa credenciales → Dashboard Operativo
```

---

## 2. Dashboard Ejecutivo

### Problema UX
El gerente/director necesita una **vista de 30,000 pies** del estado tributario y logístico sin entrar al detalle operativo.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Es la pantalla principal para roles directivos | Primera impresión de valor del producto |
| Indicador de Riesgo Tributario prominente | KPI exclusivo que comunica el valor central del producto |
| 7 KPI cards en la fila superior | Cobertura completa: GRE, productos, stock, alertas, incidencias |
| Gráficos de tendencia (no solo números) | Permite detectar patrones temporales |
| Slot Power BI al 60% del ancho inferior | Preparado para análisis avanzado sin rediseño |
| Selector de periodo (Mes/Trimestre/Año) | Contexto temporal para decisiones |
| Sin acciones de edición | Solo lectura; las acciones viven en el dashboard operativo |
| Timeline de actividad reciente | Conexión con operaciones del día |

### Jerarquía visual
1. Riesgo Tributario (gauge) — lo más importante
2. KPIs numéricos — estado actual
3. Gráficos de tendencia — dirección
4. Power BI slot — análisis profundo (futuro)

---

## 3. Dashboard Operativo

### Problema UX
El supervisor/logístico necesita **accionar rápidamente** sobre GRE pendientes, alertas y diferencias del día.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| KPIs operativos (no estratégicos) | Enfoque en "qué hacer hoy" |
| Panel de alertas activas lateral | Acceso inmediato a problemas |
| Últimas GRE en tabla inferior | Acceso rápido a documentos recientes |
| Gráfico de movimientos (7 días) | Contexto operativo inmediato |
| Productos críticos (stock bajo) | Prevención proactiva |
| Botones de acción en cada widget | "Ver todas", "Resolver" — accionable |
| Diferente del Dashboard Ejecutivo | Evita confusión entre roles |

---

## 4. GRE (Guías de Remisión)

### Problema UX
La GRE es el **documento origen** de todo el flujo. Su gestión debe ser rápida y sin errores.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Tabla como vista principal | Máxima densidad de información (patrón Oracle/Odoo) |
| Badges de estado con color semántico | Identificación instantánea del estado de conciliación |
| Filtros en barra superior | Búsqueda por número, estado, fecha sin cambiar de vista |
| Drawer lateral para detalle rápido | Ver info sin perder contexto del listado |
| Upload XML/PDF en formulario y detalle | Almacenamiento para futura lectura automática |
| Vista previa de archivos | Confirmar que se subió el documento correcto |
| Botón "Nueva GRE" prominente (primary) | CTA principal siempre visible |
| Líneas de productos dinámicas en formulario | Agregar/quitar productos sin recargar |

### Flujo de creación
```
Nueva GRE → Datos generales → Agregar productos → Subir XML/PDF → Guardar
    → Conciliación automática → Alerta si hay diferencia
```

---

## 5. Productos

### Problema UX
Catálogo maestro que alimenta GRE, Kardex y Stock Físico. Debe ser fácil de mantener.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Vista dual: tabla + tarjetas (toggle) | Tabla para gestión masiva, tarjetas para vista visual |
| Stock kardex visible en listado | Dato crítico siempre visible |
| Indicador visual de stock bajo mínimo | ⚠ automático cuando stock < mínimo |
| Categorías desde catálogo configurable | Consistencia con módulo Configuración |
| Código de producto en monospace | Diferenciación visual de identificadores |

---

## 6. Inventario

### Problema UX
Vista consolidada del estado del almacén: qué hay, dónde está, qué está disponible.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Vista separada de Productos | Productos = catálogo; Inventario = estado actual |
| Columnas: Stock, Ubicación, Disponible, Reservado | Información logística completa |
| Filtro por ubicación/almacén | Multi-almacén preparado |
| Semáforo visual de disponibilidad | Verde/amarillo/rojo según nivel |
| Link a Kardex y Stock Físico | Navegación contextual entre módulos relacionados |

---

## 7. Kardex

### Problema UX
Registro histórico de movimientos. El usuario necesita entender **qué pasó y cuándo**.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Timeline como vista alternativa | Complementa la tabla para narrativa visual |
| Tipos con color: Entrada (verde), Salida (rojo), Ajuste (amarillo) | Identificación instantánea |
| Stock anterior → Stock nuevo en cada fila | Trazabilidad del cambio |
| Referencia al documento origen (GRE-050) | Conexión con trazabilidad |
| Filtro por producto y rango de fechas | Investigación de movimientos específicos |
| Botón "Nuevo Movimiento" con tipo preseleccionable | Reduce pasos para operaciones frecuentes |

---

## 8. Stock Físico

### Problema UX
El conteo físico es la **tercera fuente de verdad**. Debe ser fácil de registrar y comparar.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Comparación visual Físico vs Kardex en cada fila | Diferencia visible sin entrar a conciliación |
| ✓ / ⚠ indicadores inline | Coincidencia o diferencia de un vistazo |
| Botón "Conciliar" por producto | Acción directa desde el conteo |
| Fecha de conteo prominente | Saber qué tan actual es el dato |
| Ubicación/almacén | Contexto físico del conteo |

---

## 9. Conciliación (Pantalla más importante)

### Problema UX
**El corazón del producto.** Aquí se demuestra el valor: detectar diferencias entre GRE, Kardex y Stock Físico.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Visualización triple lado a lado | Comparación directa sin cálculo mental |
| Colores: verde (coincide), rojo (difiere) | Semántica universal |
| Flechas/arrows entre las tres columnas | Flujo visual GRE → Kardex → Físico |
| Resumen de incidencias arriba | Cantidad pendiente/revisada/resuelta |
| Botón "Conciliar nuevamente" | Re-ejecutar después de correcciones |
| Detalle expandible por producto | Profundizar sin cambiar de vista |
| Step progress: GRE → Kardex → Físico → Resultado | Narrativa del proceso |
| Esta pantalla se muestra en demos | Debe ser la más impactante visualmente |

### Visualización triple
```
         GRE           Kardex         Físico
        ┌────┐        ┌────┐        ┌────┐
        │100 │ ──≠──  │ 98 │ ──≠──  │ 95 │
        └────┘        └────┘        └────┘
           │             │             │
           └──── +2 ─────┘──── +3 ─────┘
```

---

## 10. Trazabilidad

### Problema UX
Responder: "¿Qué le pasó a este producto desde que se emitió la GRE?"

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Timeline vertical como vista principal | Narrativa cronológica natural |
| Búsqueda por producto, GRE o código | Múltiples puntos de entrada |
| Nodos con icono y color por tipo de evento | Escaneo visual rápido |
| Metadata expandible en cada nodo | Detalle sin saturar la vista |
| Conexión con incidencias y alertas | Trazabilidad incluye problemas |
| Filtro por tipo de evento | Enfoque en un aspecto del recorrido |

### Eventos del timeline
```
GRE Emitida → XML Cargado → Salida Kardex → Conteo Físico →
Conciliación → [Incidencia] → Resolución
```

---

## 11. Alertas

### Problema UX
Notificaciones proactivas que previenen riesgos tributarios.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Tabs por tipo: Todas, Diferencias, Stock, Tributarias | Filtrado sin búsqueda |
| Cards (no tabla) | Cada alerta es un "problema" que necesita atención |
| Borde izquierdo con color semántico | Prioridad visual |
| Acciones inline: "Ver incidencia", "Marcar leída" | Resolver sin navegar |
| Timestamp relativo ("hace 2h") | Contexto temporal inmediato |
| Badge count en sidebar | Indicador persistente de pendientes |

---

## 12. Incidencias

### Problema UX
Gestión formal de diferencias detectadas. Requiere seguimiento y resolución.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Separada de Alertas | Alertas = notificación; Incidencias = caso formal |
| Tabla con tipo de diferencia (GRE-Kardex, GRE-Físico, Kardex-Físico) | Clasificación clara |
| Estados: Pendiente → Revisada → Resuelta | Flujo de resolución |
| Acción "Resolver" con observación | Documentar la corrección |
| Link a GRE y producto relacionado | Contexto completo |

---

## 13. Reportes

### Problema UX
Exportar datos para análisis externo, auditorías y presentaciones.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Cards de reporte (no lista) | Cada reporte es un "producto" con descripción |
| Filtros de periodo globales | Aplican a todos los reportes |
| Botones Excel y PDF por reporte | Formatos estándar empresariales |
| Vista previa antes de exportar | Confirmar contenido |
| 4 reportes MVP: GRE, Productos, Kardex, Resumen Ejecutivo | Cobertura sin complejidad |

---

## 14. Configuración

### Problema UX
Administración del sistema. Solo para rol Admin.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Sub-navegación lateral (tabs verticales) | 6 secciones sin saturar |
| Formularios simples de CRUD | Patrón consistente |
| Separada de operaciones diarias | No confundir con trabajo operativo |
| Solo visible para Admin en sidebar | Control de acceso visual |

### Secciones
Empresas · Parámetros · Catálogos · Tipos de Documento · Series · Estados

---

## 15. Usuarios

### Problema UX
Gestión de accesos y roles.

### Decisiones
| Decisión | Justificación |
|----------|---------------|
| Tabla con rol badge | Identificación de permisos |
| 3 roles fijos: Admin, Supervisor, Consulta | Simplicidad MVP |
| Toggle activo/inactivo | Desactivar sin eliminar |
| Asociación a empresa | Multi-tenant preparado |

---

## Principios UX transversales

| Principio | Aplicación |
|-----------|------------|
| **Zero training** | Iconos universales, colores semánticos, labels claros |
| **3 clicks máximo** | Cualquier dato accesible en ≤3 clicks desde dashboard |
| **Feedback inmediato** | Toast en cada acción, loading en cada proceso |
| **Consistencia** | Misma estructura de listado en todos los módulos CRUD |
| **Prevención** | Alertas antes de que el problema escale |
| **Contexto** | Breadcrumb + links cruzados entre módulos relacionados |
| **Progresive disclosure** | Resumen primero, detalle bajo demanda |
