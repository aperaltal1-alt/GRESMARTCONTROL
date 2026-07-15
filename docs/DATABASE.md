# Modelo de datos — GRE SMART CONTROL MVP

> Diseño actualizado tras ajustes de Fase 1. Implementación en Fase 3.

## Diagrama entidad-relación

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│   Rol    │────<│  Usuario │>────│   Empresa    │
└──────────┘     └────┬─────┘     └──────┬───────┘
                      │                   │
                 ┌────▼────┐         ┌────▼────────────┐
                 │Auditoria│         │ ParametroSistema  │
                 └─────────┘         │ Catalogo          │
                                     │ TipoDocumento     │
                                     │ Serie             │
                                     │ EstadoDocumento   │
                                     └───────────────────┘

┌───────────┐     ┌─────────────┐     ┌──────────────┐
│  Producto │────<│ DetalleGRE  │>────│     GRE      │
└─────┬─────┘     └─────────────┘     └──────┬───────┘
      │                                      │
      │         ┌─────────────┐         ┌────▼───────┐
      ├────────<│ Movimiento  │         │ GreArchivo │
      │         │   Kardex    │         │ (XML/PDF)  │
      │         └─────────────┘         └────────────┘
      │
      ├────────<┌─────────────┐
      │         │ StockFisico │
      │         └─────────────┘
      │
      └────────<┌──────────────────┐
                │ TrazabilidadEvento│
                └──────────────────┘

┌──────────┐     ┌──────────────┐
│  Alerta  │     │  Incidencia  │
└──────────┘     └──────────────┘
```

## Tablas

### Rol
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| nombre | ENUM | ADMIN, SUPERVISOR, CONSULTA |
| descripcion | VARCHAR | Descripción del rol |

### Usuario
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| email | VARCHAR | Único |
| password | VARCHAR | Hash bcrypt |
| nombre | VARCHAR | Nombre completo |
| rolId | UUID | FK → Rol |
| empresaId | UUID | FK → Empresa |
| activo | BOOLEAN | Estado de la cuenta |
| createdAt | TIMESTAMP | |
| updatedAt | TIMESTAMP | |

### Empresa
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| ruc | VARCHAR(11) | RUC peruano |
| razonSocial | VARCHAR | Nombre legal |
| direccion | VARCHAR | |
| telefono | VARCHAR | |
| email | VARCHAR | |
| activo | BOOLEAN | |

### Producto
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| codigo | VARCHAR | Código único por empresa |
| nombre | VARCHAR | |
| categoria | VARCHAR | Referencia a Catalogo |
| unidad | VARCHAR | UND, KG, LT, etc. |
| stockKardex | DECIMAL | Stock derivado del kardex |
| stockMinimo | DECIMAL | Umbral de alerta |
| empresaId | UUID | FK → Empresa |
| activo | BOOLEAN | |

> **Nota:** `stockKardex` se actualiza automáticamente con cada movimiento de kardex. El stock físico vive en la tabla `StockFisico` de forma independiente.

### GRE (Guía de Remisión Electrónica)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| numero | VARCHAR | Número GRE |
| serie | VARCHAR | FK lógica → Serie |
| fecha | DATE | Fecha de emisión |
| empresaId | UUID | FK → Empresa |
| ruc | VARCHAR(11) | RUC emisor |
| transportista | VARCHAR | |
| origen | VARCHAR | Dirección origen |
| destino | VARCHAR | Dirección destino |
| estado | ENUM | PENDIENTE, CONCILIADA, CON_DIFERENCIA, ANULADA |
| tipoDocumentoId | UUID | FK → TipoDocumento |
| createdAt | TIMESTAMP | |
| updatedAt | TIMESTAMP | |

> Los archivos XML/PDF se almacenan en la tabla `GreArchivo` (relación 1:N).

### DetalleGRE
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| greId | UUID | FK → GRE |
| productoId | UUID | FK → Producto |
| codigo | VARCHAR | Código del producto en la GRE |
| descripcion | VARCHAR | Nombre del producto |
| cantidad | DECIMAL | Cantidad declarada en GRE |

### GreArchivo (nueva)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| greId | UUID | FK → GRE |
| tipo | ENUM | XML, PDF |
| nombreOriginal | VARCHAR | Nombre del archivo subido |
| nombreAlmacenado | VARCHAR | Nombre en disco/S3 |
| ruta | VARCHAR | Ruta completa del archivo |
| mimeType | VARCHAR | application/xml, application/pdf |
| tamano | INTEGER | Tamaño en bytes |
| hash | VARCHAR | SHA-256 para integridad |
| procesado | BOOLEAN | false en MVP (futuro: parser automático) |
| usuarioId | UUID | FK → Usuario (quien subió) |
| createdAt | TIMESTAMP | |

### MovimientoKardex
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| productoId | UUID | FK → Producto |
| tipo | ENUM | ENTRADA, SALIDA, AJUSTE |
| cantidad | DECIMAL | Positivo para entrada, negativo para salida |
| stockAnterior | DECIMAL | Stock kardex antes del movimiento |
| stockNuevo | DECIMAL | Stock kardex después del movimiento |
| referencia | VARCHAR | GRE-001, AJUSTE-INV, etc. |
| observacion | TEXT | |
| usuarioId | UUID | FK → Usuario |
| createdAt | TIMESTAMP | |

### StockFisico (nueva)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| productoId | UUID | FK → Producto |
| cantidad | DECIMAL | Cantidad contada físicamente |
| ubicacion | VARCHAR | Almacén, estante, zona (opcional) |
| fechaConteo | DATE | Fecha del conteo físico |
| observacion | TEXT | |
| usuarioId | UUID | FK → Usuario (quien registró) |
| empresaId | UUID | FK → Empresa |
| createdAt | TIMESTAMP | |
| updatedAt | TIMESTAMP | |

> Registra conteos físicos independientes del kardex. La conciliación compara GRE vs Kardex vs Stock Físico.

### TrazabilidadEvento (nueva)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| productoId | UUID | FK → Producto |
| greId | UUID | FK → GRE (opcional) |
| tipoEvento | ENUM | Ver enum TipoEventoTrazabilidad |
| descripcion | TEXT | Descripción legible del evento |
| entidad | VARCHAR | GRE, Kardex, StockFisico, Incidencia |
| entidadId | UUID | ID del registro relacionado |
| metadata | JSON | Datos adicionales del evento |
| usuarioId | UUID | FK → Usuario |
| empresaId | UUID | FK → Empresa |
| createdAt | TIMESTAMP | |

**Tipos de evento (`TipoEventoTrazabilidad`):**
- `GRE_EMITIDA`
- `ARCHIVO_CARGADO`
- `MOVIMIENTO_KARDEX`
- `STOCK_FISICO_REGISTRADO`
- `CONCILIACION_INICIADA`
- `CONCILIACION_COMPLETADA`
- `CONCILIACION_CON_DIFERENCIA`
- `INCIDENCIA_CREADA`
- `INCIDENCIA_RESUELTA`

### Alerta
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| tipo | ENUM | STOCK_INSUFICIENTE, DIFERENCIA_GRE, DIFERENCIA_KARDEX, DIFERENCIA_FISICO, STOCK_MINIMO |
| mensaje | TEXT | Descripción legible |
| productoId | UUID | FK → Producto (opcional) |
| greId | UUID | FK → GRE (opcional) |
| empresaId | UUID | FK → Empresa |
| leida | BOOLEAN | |
| activa | BOOLEAN | |
| createdAt | TIMESTAMP | |

### Incidencia
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| greId | UUID | FK → GRE |
| productoId | UUID | FK → Producto |
| tipo | ENUM | GRE_KARDEX, GRE_FISICO, KARDEX_FISICO |
| cantidadGre | DECIMAL | Cantidad en la GRE |
| cantidadKardex | DECIMAL | Stock kardex al momento |
| cantidadFisico | DECIMAL | Stock físico al momento |
| diferencia | DECIMAL | Mayor diferencia detectada |
| estado | ENUM | PENDIENTE, REVISADA, RESUELTA |
| observacion | TEXT | |
| createdAt | TIMESTAMP | |
| resolvedAt | TIMESTAMP | |

### Auditoria (actualizada)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| usuarioId | UUID | FK → Usuario |
| usuarioNombre | VARCHAR | Snapshot del nombre al momento de la acción |
| fecha | DATE | Fecha de la acción |
| hora | TIME | Hora de la acción |
| ip | VARCHAR | Dirección IP del cliente |
| accion | ENUM | CREATE, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT |
| entidad | VARCHAR | Producto, GRE, Kardex, etc. |
| entidadId | UUID | ID del registro afectado |
| registroAnterior | JSON | Estado del registro ANTES del cambio |
| registroNuevo | JSON | Estado del registro DESPUÉS del cambio |
| createdAt | TIMESTAMP | |

### ParametroSistema (nueva — Configuración)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| clave | VARCHAR | Clave única (ej: `STOCK_MINIMO_DEFAULT`) |
| valor | TEXT | Valor del parámetro |
| descripcion | VARCHAR | Descripción legible |
| tipo | ENUM | STRING, NUMBER, BOOLEAN, JSON |
| empresaId | UUID | FK → Empresa (null = global) |
| updatedAt | TIMESTAMP | |

### Catalogo (nueva — Configuración)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| tipo | ENUM | CATEGORIA, UNIDAD, UBICACION, OTRO |
| codigo | VARCHAR | Código del ítem |
| nombre | VARCHAR | Nombre legible |
| descripcion | VARCHAR | |
| empresaId | UUID | FK → Empresa |
| activo | BOOLEAN | |

### TipoDocumento (nueva — Configuración)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| codigo | VARCHAR | GRE, FACTURA, BOLETA, etc. |
| nombre | VARCHAR | Nombre legible |
| descripcion | VARCHAR | |
| empresaId | UUID | FK → Empresa |
| activo | BOOLEAN | |

### Serie (nueva — Configuración)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| codigo | VARCHAR | T001, G001, etc. |
| tipoDocumentoId | UUID | FK → TipoDocumento |
| empresaId | UUID | FK → Empresa |
| correlativoActual | INTEGER | Último número usado |
| activo | BOOLEAN | |

### EstadoDocumento (nueva — Configuración)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| codigo | VARCHAR | PENDIENTE, CONCILIADA, etc. |
| nombre | VARCHAR | Nombre legible |
| color | VARCHAR | Color hex para UI (#10B981) |
| tipoDocumentoId | UUID | FK → TipoDocumento (opcional) |
| empresaId | UUID | FK → Empresa |
| activo | BOOLEAN | |

## Índices recomendados

- `Producto(codigo, empresaId)` — UNIQUE
- `GRE(numero, serie, empresaId)` — UNIQUE
- `GreArchivo(greId, tipo)` — búsqueda de archivos por GRE
- `StockFisico(productoId, fechaConteo DESC)` — último conteo físico
- `MovimientoKardex(productoId, createdAt)` — historial kardex
- `TrazabilidadEvento(productoId, createdAt)` — timeline
- `TrazabilidadEvento(greId, createdAt)` — timeline por GRE
- `Alerta(empresaId, activa)` — dashboard
- `Incidencia(greId, estado)` — conciliación
- `Auditoria(entidad, entidadId, createdAt)` — consulta de auditoría
- `ParametroSistema(clave, empresaId)` — UNIQUE
- `Catalogo(tipo, codigo, empresaId)` — UNIQUE
- `Serie(codigo, empresaId)` — UNIQUE

## Reglas de integridad

1. **Kardex → stockKardex**: cada movimiento actualiza `Producto.stockKardex` en transacción atómica
2. **Stock Físico independiente**: `StockFisico` NO modifica el kardex; es una fuente de verdad separada
3. **GRE → Conciliación triple**: al crear/actualizar GRE se compara contra kardex Y stock físico
4. **GRE → Trazabilidad**: cada operación sobre GRE genera evento en `TrazabilidadEvento`
5. **Archivos GRE**: múltiples archivos XML/PDF por GRE vía `GreArchivo`
6. **Stock mínimo**: si `stockKardex <= stockMinimo` se genera alerta `STOCK_MINIMO`
7. **Auditoría**: `AuditInterceptor` captura `registroAnterior` y `registroNuevo` en JSON
8. **Soft delete**: productos, GRE y catálogos usan campo `activo`

## Conciliación — ejemplo triple

```
Producto: ARROZ-001

  GRE declarada:     100 unidades
  Stock Kardex:       98 unidades  → diff GRE-Kardex: +2
  Stock Físico:       95 unidades  → diff GRE-Físico: +5, diff Kardex-Físico: +3

Resultado:
  → 3 Incidencias (GRE_KARDEX, GRE_FISICO, KARDEX_FISICO)
  → 3 Alertas
  → GRE.estado = CON_DIFERENCIA
  → Eventos de trazabilidad registrados
```
