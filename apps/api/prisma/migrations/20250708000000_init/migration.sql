-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PlanEmpresa" AS ENUM ('MVP', 'PRO', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "AccionPermiso" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'EXECUTE', 'EXPORT');

-- CreateEnum
CREATE TYPE "EstadoEntidad" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoUbicacion" AS ENUM ('ZONA', 'ESTANTE', 'PASILLO', 'RECEPCION', 'DESPACHO', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoMovimientoKardex" AS ENUM ('ENTRADA', 'SALIDA', 'AJUSTE');

-- CreateEnum
CREATE TYPE "ReferenciaMovimientoTipo" AS ENUM ('GRE', 'AJUSTE', 'TRANSFERENCIA', 'MANUAL');

-- CreateEnum
CREATE TYPE "MetodoStockFisico" AS ENUM ('MANUAL', 'SCANNER', 'IMPORTACION');

-- CreateEnum
CREATE TYPE "GreEstado" AS ENUM ('PENDIENTE', 'CONCILIADA', 'CON_DIFERENCIA', 'ANULADA');

-- CreateEnum
CREATE TYPE "EstadoSunat" AS ENUM ('NO_ENVIADO', 'ACEPTADO', 'RECHAZADO', 'OBSERVADO');

-- CreateEnum
CREATE TYPE "TipoArchivoGre" AS ENUM ('XML', 'PDF', 'CDR', 'OTRO');

-- CreateEnum
CREATE TYPE "ConciliacionEstado" AS ENUM ('EN_PROCESO', 'COMPLETADA', 'CON_DIFERENCIAS', 'ERROR');

-- CreateEnum
CREATE TYPE "ConciliacionMetodo" AS ENUM ('MANUAL', 'AUTOMATICO', 'IA', 'SUNAT');

-- CreateEnum
CREATE TYPE "HistorialConciliacionResultado" AS ENUM ('OK', 'DIFERENCIA', 'NO_ENCONTRADO');

-- CreateEnum
CREATE TYPE "TipoIncidencia" AS ENUM ('GRE_KARDEX', 'GRE_FISICO', 'KARDEX_FISICO', 'TRIPLE');

-- CreateEnum
CREATE TYPE "IncidenciaEstado" AS ENUM ('PENDIENTE', 'REVISADA', 'RESUELTA', 'DESCARTADA');

-- CreateEnum
CREATE TYPE "IncidenciaPrioridad" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "TipoAlerta" AS ENUM ('STOCK_INSUFICIENTE', 'STOCK_MINIMO', 'DIFERENCIA_GRE', 'DIFERENCIA_KARDEX', 'DIFERENCIA_FISICO', 'GRE_PENDIENTE', 'TRIBUTARIA', 'SUNAT_RECHAZADO', 'CONCILIACION_PENDIENTE');

-- CreateEnum
CREATE TYPE "NivelAlerta" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "TipoEventoTrazabilidad" AS ENUM ('GRE_EMITIDA', 'ARCHIVO_CARGADO', 'MOVIMIENTO_KARDEX', 'STOCK_FISICO_REGISTRADO', 'CONCILIACION_INICIADA', 'CONCILIACION_COMPLETADA', 'CONCILIACION_CON_DIFERENCIA', 'INCIDENCIA_CREADA', 'INCIDENCIA_RESUELTA');

-- CreateEnum
CREATE TYPE "AccionAuditoria" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'EXECUTE');

-- CreateEnum
CREATE TYPE "TipoConfiguracion" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON');

-- CreateEnum
CREATE TYPE "CategoriaConfiguracion" AS ENUM ('SISTEMA', 'CONCILIACION', 'SUNAT', 'UI', 'IA', 'POWERBI');

-- CreateEnum
CREATE TYPE "TipoIntegracion" AS ENUM ('SUNAT', 'POWER_BI', 'WEBHOOK', 'OCR', 'ERP', 'EMAIL');

-- CreateEnum
CREATE TYPE "EstadoIntegracion" AS ENUM ('ACTIVA', 'INACTIVA', 'ERROR', 'PENDIENTE_CONFIG');

-- CreateEnum
CREATE TYPE "TipoCatalogoSunat" AS ENUM ('TIPO_DOCUMENTO', 'MOTIVO_TRASLADO', 'UNIDAD_SUNAT', 'ESTADO_CPE', 'TIPO_TRANSPORTE', 'TIPO_DOC_IDENTIDAD', 'OTRO');

-- CreateTable
CREATE TABLE "empresas" (
    "id" UUID NOT NULL,
    "ruc" VARCHAR(11) NOT NULL,
    "razon_social" VARCHAR(255) NOT NULL,
    "nombre_comercial" VARCHAR(255),
    "direccion" VARCHAR(500),
    "telefono" VARCHAR(20),
    "email" VARCHAR(255),
    "logo_url" VARCHAR(500),
    "plan" "PlanEmpresa" NOT NULL DEFAULT 'MVP',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "es_sistema" BOOLEAN NOT NULL DEFAULT false,
    "empresa_id" UUID,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "modulo" VARCHAR(50) NOT NULL,
    "accion" "AccionPermiso" NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rol_permisos" (
    "id" UUID NOT NULL,
    "rol_id" UUID NOT NULL,
    "permiso_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rol_permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "apellido" VARCHAR(150),
    "rol_id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "ultimo_login_at" TIMESTAMP(3),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades_medida" (
    "id" UUID NOT NULL,
    "empresa_id" UUID,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "simbolo" VARCHAR(10),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unidades_medida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "ruc" VARCHAR(11) NOT NULL,
    "razon_social" VARCHAR(255) NOT NULL,
    "nombre_comercial" VARCHAR(255),
    "direccion" VARCHAR(500),
    "telefono" VARCHAR(20),
    "correo" VARCHAR(255),
    "estado" "EstadoEntidad" NOT NULL DEFAULT 'ACTIVO',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "ruc" VARCHAR(11) NOT NULL,
    "razon_social" VARCHAR(255) NOT NULL,
    "nombre_comercial" VARCHAR(255),
    "direccion" VARCHAR(500),
    "telefono" VARCHAR(20),
    "correo" VARCHAR(255),
    "estado" "EstadoEntidad" NOT NULL DEFAULT 'ACTIVO',
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "unidad_medida_id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "codigo_barras" VARCHAR(50),
    "stock_minimo" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "almacenes" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(500),
    "es_principal" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "almacenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ubicaciones" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "almacen_id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "tipo" "TipoUbicacion" NOT NULL DEFAULT 'ZONA',
    "ubicacion_padre_id" UUID,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ubicaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kardex" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "saldo_actual" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "ultimo_movimiento_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kardex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_kardex" (
    "id" UUID NOT NULL,
    "kardex_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "ubicacion_id" UUID,
    "tipo" "TipoMovimientoKardex" NOT NULL,
    "cantidad" DECIMAL(18,4) NOT NULL,
    "saldo_anterior" DECIMAL(18,4) NOT NULL,
    "saldo_nuevo" DECIMAL(18,4) NOT NULL,
    "referencia" VARCHAR(100),
    "referencia_tipo" "ReferenciaMovimientoTipo",
    "referencia_id" UUID,
    "observacion" TEXT,
    "usuario_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_kardex_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventarios" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "almacen_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "ubicacion_id" UUID NOT NULL,
    "cantidad_kardex" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "cantidad_fisica" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "cantidad_disponible" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "cantidad_reservada" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "ultima_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_fisico" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "ubicacion_id" UUID NOT NULL,
    "cantidad" DECIMAL(18,4) NOT NULL,
    "fecha_conteo" DATE NOT NULL,
    "metodo" "MetodoStockFisico" NOT NULL DEFAULT 'MANUAL',
    "observacion" TEXT,
    "usuario_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_fisico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_sunat" (
    "id" UUID NOT NULL,
    "tipo" "TipoCatalogoSunat" NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,
    "metadata" JSONB,
    "vigente_desde" DATE,
    "vigente_hasta" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "catalogo_sunat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_documento" (
    "id" UUID NOT NULL,
    "empresa_id" UUID,
    "catalogo_sunat_id" UUID,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "codigo_sunat" VARCHAR(10),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipos_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "series" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tipo_documento_id" UUID NOT NULL,
    "codigo" VARCHAR(10) NOT NULL,
    "correlativo_actual" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_documento" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tipo_documento_id" UUID,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "color" VARCHAR(7) NOT NULL DEFAULT '#64748B',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "estados_documento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gre" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tipo_documento_id" UUID NOT NULL,
    "serie_id" UUID NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "fecha_emision" DATE NOT NULL,
    "ruc_emisor" VARCHAR(11) NOT NULL,
    "ruc_destinatario" VARCHAR(11),
    "proveedor_id" UUID,
    "cliente_id" UUID,
    "transportista" VARCHAR(255),
    "origen" VARCHAR(500),
    "destino" VARCHAR(500),
    "estado" "GreEstado" NOT NULL DEFAULT 'PENDIENTE',
    "estado_documento_id" UUID,
    "codigo_sunat" VARCHAR(50),
    "hash_cpe" VARCHAR(64),
    "estado_sunat" "EstadoSunat" NOT NULL DEFAULT 'NO_ENVIADO',
    "fecha_envio_sunat" TIMESTAMP(3),
    "respuesta_sunat" JSONB,
    "observacion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "deleted_at" TIMESTAMP(3),
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_gre" (
    "id" UUID NOT NULL,
    "gre_id" UUID NOT NULL,
    "producto_id" UUID,
    "codigo_producto" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255) NOT NULL,
    "cantidad" DECIMAL(18,4) NOT NULL,
    "unidad_medida_id" UUID,
    "orden" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "detalle_gre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivo_gre" (
    "id" UUID NOT NULL,
    "gre_id" UUID NOT NULL,
    "tipo" "TipoArchivoGre" NOT NULL,
    "nombre_original" VARCHAR(255) NOT NULL,
    "nombre_almacenado" VARCHAR(255) NOT NULL,
    "ruta" VARCHAR(500) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "tamano_bytes" BIGINT NOT NULL,
    "hash_sha256" VARCHAR(64) NOT NULL,
    "procesado" BOOLEAN NOT NULL DEFAULT false,
    "contenido_parseado" JSONB,
    "error_procesamiento" TEXT,
    "usuario_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivo_gre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conciliaciones" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "gre_id" UUID NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "estado" "ConciliacionEstado" NOT NULL DEFAULT 'EN_PROCESO',
    "metodo" "ConciliacionMetodo" NOT NULL DEFAULT 'AUTOMATICO',
    "total_lineas" INTEGER NOT NULL DEFAULT 0,
    "lineas_ok" INTEGER NOT NULL DEFAULT 0,
    "lineas_con_diferencia" INTEGER NOT NULL DEFAULT 0,
    "confianza_ia" DECIMAL(5,2),
    "sugerencia_ia" JSONB,
    "ejecutado_por_id" UUID NOT NULL,
    "iniciado_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completado_at" TIMESTAMP(3),
    "duracion_ms" INTEGER,
    "observacion" TEXT,

    CONSTRAINT "conciliaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_conciliaciones" (
    "id" UUID NOT NULL,
    "conciliacion_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "detalle_gre_id" UUID NOT NULL,
    "cantidad_gre" DECIMAL(18,4) NOT NULL,
    "cantidad_kardex" DECIMAL(18,4) NOT NULL,
    "cantidad_fisico" DECIMAL(18,4) NOT NULL,
    "diff_gre_kardex" DECIMAL(18,4) NOT NULL,
    "diff_gre_fisico" DECIMAL(18,4) NOT NULL,
    "diff_kardex_fisico" DECIMAL(18,4) NOT NULL,
    "resultado" "HistorialConciliacionResultado" NOT NULL,
    "score_ia" DECIMAL(5,2),
    "explicacion_ia" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_conciliaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidencias" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "gre_id" UUID NOT NULL,
    "producto_id" UUID NOT NULL,
    "conciliacion_id" UUID NOT NULL,
    "historial_conciliacion_id" UUID NOT NULL,
    "tipo" "TipoIncidencia" NOT NULL,
    "cantidad_gre" DECIMAL(18,4) NOT NULL,
    "cantidad_kardex" DECIMAL(18,4) NOT NULL,
    "cantidad_fisico" DECIMAL(18,4) NOT NULL,
    "diferencia" DECIMAL(18,4) NOT NULL,
    "estado" "IncidenciaEstado" NOT NULL DEFAULT 'PENDIENTE',
    "prioridad" "IncidenciaPrioridad" NOT NULL DEFAULT 'MEDIA',
    "observacion" TEXT,
    "resuelto_por_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "incidencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alertas" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tipo" "TipoAlerta" NOT NULL,
    "nivel" "NivelAlerta" NOT NULL DEFAULT 'WARNING',
    "mensaje" TEXT NOT NULL,
    "producto_id" UUID,
    "gre_id" UUID,
    "conciliacion_id" UUID,
    "incidencia_id" UUID,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expira_at" TIMESTAMP(3),

    CONSTRAINT "alertas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trazabilidad_eventos" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "producto_id" UUID,
    "gre_id" UUID,
    "tipo_evento" "TipoEventoTrazabilidad" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "entidad" VARCHAR(50) NOT NULL,
    "entidad_id" UUID NOT NULL,
    "metadata" JSONB,
    "usuario_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trazabilidad_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditorias" (
    "id" UUID NOT NULL,
    "empresa_id" UUID,
    "usuario_id" UUID,
    "usuario_nombre" VARCHAR(200),
    "usuario_email" VARCHAR(255),
    "fecha" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" VARCHAR(45),
    "user_agent" VARCHAR(500),
    "accion" "AccionAuditoria" NOT NULL,
    "entidad" VARCHAR(50) NOT NULL,
    "entidad_id" UUID,
    "registro_anterior" JSONB,
    "registro_nuevo" JSONB,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuraciones" (
    "id" UUID NOT NULL,
    "empresa_id" UUID,
    "clave" VARCHAR(100) NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" "TipoConfiguracion" NOT NULL DEFAULT 'STRING',
    "categoria" "CategoriaConfiguracion" NOT NULL DEFAULT 'SISTEMA',
    "descripcion" VARCHAR(255),
    "es_secreto" BOOLEAN NOT NULL DEFAULT false,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" UUID,

    CONSTRAINT "configuraciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integraciones" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "tipo" "TipoIntegracion" NOT NULL,
    "proveedor" VARCHAR(100) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "estado" "EstadoIntegracion" NOT NULL DEFAULT 'PENDIENTE_CONFIG',
    "credenciales" JSONB,
    "configuracion" JSONB,
    "ultima_sync_at" TIMESTAMP(3),
    "ultimo_error" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integraciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dashboard_cache" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "clave" VARCHAR(100) NOT NULL,
    "periodo" VARCHAR(20) NOT NULL,
    "payload" JSONB NOT NULL,
    "computed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "dashboard_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "power_bi_config" (
    "id" UUID NOT NULL,
    "empresa_id" UUID NOT NULL,
    "workspace_id" VARCHAR(100),
    "report_id" VARCHAR(100),
    "dataset_id" VARCHAR(100),
    "embed_url" VARCHAR(500),
    "filtro_empresa" VARCHAR(200),
    "refresh_schedule" VARCHAR(50),
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "power_bi_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_ruc_key" ON "empresas"("ruc");

-- CreateIndex
CREATE INDEX "empresas_activo_idx" ON "empresas"("activo");

-- CreateIndex
CREATE INDEX "empresas_deleted_at_idx" ON "empresas"("deleted_at");

-- CreateIndex
CREATE INDEX "roles_empresa_id_idx" ON "roles"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_codigo_empresa_id_key" ON "roles"("codigo", "empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_codigo_key" ON "permisos"("codigo");

-- CreateIndex
CREATE INDEX "permisos_modulo_idx" ON "permisos"("modulo");

-- CreateIndex
CREATE UNIQUE INDEX "rol_permisos_rol_id_permiso_id_key" ON "rol_permisos"("rol_id", "permiso_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_empresa_id_idx" ON "usuarios"("empresa_id");

-- CreateIndex
CREATE INDEX "usuarios_rol_id_idx" ON "usuarios"("rol_id");

-- CreateIndex
CREATE INDEX "usuarios_deleted_at_idx" ON "usuarios"("deleted_at");

-- CreateIndex
CREATE INDEX "categorias_empresa_id_idx" ON "categorias"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_codigo_empresa_id_key" ON "categorias"("codigo", "empresa_id");

-- CreateIndex
CREATE INDEX "unidades_medida_empresa_id_idx" ON "unidades_medida"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_medida_codigo_empresa_id_key" ON "unidades_medida"("codigo", "empresa_id");

-- CreateIndex
CREATE INDEX "proveedores_empresa_id_idx" ON "proveedores"("empresa_id");

-- CreateIndex
CREATE INDEX "proveedores_estado_idx" ON "proveedores"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_ruc_empresa_id_key" ON "proveedores"("ruc", "empresa_id");

-- CreateIndex
CREATE INDEX "clientes_empresa_id_idx" ON "clientes"("empresa_id");

-- CreateIndex
CREATE INDEX "clientes_estado_idx" ON "clientes"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_ruc_empresa_id_key" ON "clientes"("ruc", "empresa_id");

-- CreateIndex
CREATE INDEX "productos_empresa_id_idx" ON "productos"("empresa_id");

-- CreateIndex
CREATE INDEX "productos_categoria_id_idx" ON "productos"("categoria_id");

-- CreateIndex
CREATE INDEX "productos_codigo_barras_idx" ON "productos"("codigo_barras");

-- CreateIndex
CREATE INDEX "productos_deleted_at_idx" ON "productos"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "productos_codigo_empresa_id_key" ON "productos"("codigo", "empresa_id");

-- CreateIndex
CREATE INDEX "almacenes_empresa_id_idx" ON "almacenes"("empresa_id");

-- CreateIndex
CREATE INDEX "almacenes_es_principal_idx" ON "almacenes"("es_principal");

-- CreateIndex
CREATE UNIQUE INDEX "almacenes_codigo_empresa_id_key" ON "almacenes"("codigo", "empresa_id");

-- CreateIndex
CREATE INDEX "ubicaciones_empresa_id_idx" ON "ubicaciones"("empresa_id");

-- CreateIndex
CREATE INDEX "ubicaciones_almacen_id_idx" ON "ubicaciones"("almacen_id");

-- CreateIndex
CREATE UNIQUE INDEX "ubicaciones_codigo_almacen_id_key" ON "ubicaciones"("codigo", "almacen_id");

-- CreateIndex
CREATE UNIQUE INDEX "kardex_producto_id_key" ON "kardex"("producto_id");

-- CreateIndex
CREATE INDEX "kardex_empresa_id_idx" ON "kardex"("empresa_id");

-- CreateIndex
CREATE INDEX "movimientos_kardex_producto_id_created_at_idx" ON "movimientos_kardex"("producto_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "movimientos_kardex_empresa_id_created_at_idx" ON "movimientos_kardex"("empresa_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "movimientos_kardex_kardex_id_idx" ON "movimientos_kardex"("kardex_id");

-- CreateIndex
CREATE INDEX "inventarios_empresa_id_ultima_actualizacion_idx" ON "inventarios"("empresa_id", "ultima_actualizacion" DESC);

-- CreateIndex
CREATE INDEX "inventarios_almacen_id_idx" ON "inventarios"("almacen_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventarios_producto_id_ubicacion_id_key" ON "inventarios"("producto_id", "ubicacion_id");

-- CreateIndex
CREATE INDEX "stock_fisico_producto_id_ubicacion_id_fecha_conteo_idx" ON "stock_fisico"("producto_id", "ubicacion_id", "fecha_conteo" DESC);

-- CreateIndex
CREATE INDEX "stock_fisico_empresa_id_idx" ON "stock_fisico"("empresa_id");

-- CreateIndex
CREATE INDEX "catalogo_sunat_tipo_activo_idx" ON "catalogo_sunat"("tipo", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_sunat_tipo_codigo_key" ON "catalogo_sunat"("tipo", "codigo");

-- CreateIndex
CREATE INDEX "tipos_documento_empresa_id_idx" ON "tipos_documento"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_documento_codigo_empresa_id_key" ON "tipos_documento"("codigo", "empresa_id");

-- CreateIndex
CREATE INDEX "series_empresa_id_idx" ON "series"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "series_codigo_empresa_id_key" ON "series"("codigo", "empresa_id");

-- CreateIndex
CREATE INDEX "estados_documento_empresa_id_idx" ON "estados_documento"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "estados_documento_codigo_empresa_id_tipo_documento_id_key" ON "estados_documento"("codigo", "empresa_id", "tipo_documento_id");

-- CreateIndex
CREATE INDEX "gre_empresa_id_estado_fecha_emision_idx" ON "gre"("empresa_id", "estado", "fecha_emision" DESC);

-- CreateIndex
CREATE INDEX "gre_empresa_id_estado_sunat_idx" ON "gre"("empresa_id", "estado_sunat");

-- CreateIndex
CREATE INDEX "gre_proveedor_id_idx" ON "gre"("proveedor_id");

-- CreateIndex
CREATE INDEX "gre_cliente_id_idx" ON "gre"("cliente_id");

-- CreateIndex
CREATE INDEX "gre_deleted_at_idx" ON "gre"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "gre_serie_id_numero_empresa_id_key" ON "gre"("serie_id", "numero", "empresa_id");

-- CreateIndex
CREATE INDEX "detalle_gre_gre_id_idx" ON "detalle_gre"("gre_id");

-- CreateIndex
CREATE INDEX "detalle_gre_producto_id_idx" ON "detalle_gre"("producto_id");

-- CreateIndex
CREATE INDEX "archivo_gre_gre_id_tipo_idx" ON "archivo_gre"("gre_id", "tipo");

-- CreateIndex
CREATE INDEX "archivo_gre_hash_sha256_idx" ON "archivo_gre"("hash_sha256");

-- CreateIndex
CREATE INDEX "conciliaciones_gre_id_completado_at_idx" ON "conciliaciones"("gre_id", "completado_at" DESC);

-- CreateIndex
CREATE INDEX "conciliaciones_empresa_id_idx" ON "conciliaciones"("empresa_id");

-- CreateIndex
CREATE UNIQUE INDEX "conciliaciones_gre_id_version_key" ON "conciliaciones"("gre_id", "version");

-- CreateIndex
CREATE INDEX "historial_conciliaciones_conciliacion_id_resultado_idx" ON "historial_conciliaciones"("conciliacion_id", "resultado");

-- CreateIndex
CREATE INDEX "historial_conciliaciones_producto_id_idx" ON "historial_conciliaciones"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "incidencias_historial_conciliacion_id_key" ON "incidencias"("historial_conciliacion_id");

-- CreateIndex
CREATE INDEX "incidencias_empresa_id_estado_created_at_idx" ON "incidencias"("empresa_id", "estado", "created_at" DESC);

-- CreateIndex
CREATE INDEX "incidencias_gre_id_estado_idx" ON "incidencias"("gre_id", "estado");

-- CreateIndex
CREATE INDEX "alertas_empresa_id_activa_created_at_idx" ON "alertas"("empresa_id", "activa", "created_at" DESC);

-- CreateIndex
CREATE INDEX "alertas_empresa_id_leida_activa_idx" ON "alertas"("empresa_id", "leida", "activa");

-- CreateIndex
CREATE INDEX "trazabilidad_eventos_producto_id_created_at_idx" ON "trazabilidad_eventos"("producto_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "trazabilidad_eventos_gre_id_created_at_idx" ON "trazabilidad_eventos"("gre_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "trazabilidad_eventos_empresa_id_created_at_idx" ON "trazabilidad_eventos"("empresa_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "auditorias_entidad_entidad_id_created_at_idx" ON "auditorias"("entidad", "entidad_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "auditorias_empresa_id_created_at_idx" ON "auditorias"("empresa_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "auditorias_usuario_id_created_at_idx" ON "auditorias"("usuario_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "configuraciones_categoria_idx" ON "configuraciones"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "configuraciones_clave_empresa_id_key" ON "configuraciones"("clave", "empresa_id");

-- CreateIndex
CREATE INDEX "integraciones_empresa_id_tipo_activo_idx" ON "integraciones"("empresa_id", "tipo", "activo");

-- CreateIndex
CREATE INDEX "dashboard_cache_expires_at_idx" ON "dashboard_cache"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "dashboard_cache_empresa_id_clave_periodo_key" ON "dashboard_cache"("empresa_id", "clave", "periodo");

-- CreateIndex
CREATE UNIQUE INDEX "power_bi_config_empresa_id_key" ON "power_bi_config"("empresa_id");

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades_medida" ADD CONSTRAINT "unidades_medida_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proveedores" ADD CONSTRAINT "proveedores_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "unidades_medida"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "almacenes" ADD CONSTRAINT "almacenes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubicaciones" ADD CONSTRAINT "ubicaciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubicaciones" ADD CONSTRAINT "ubicaciones_almacen_id_fkey" FOREIGN KEY ("almacen_id") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubicaciones" ADD CONSTRAINT "ubicaciones_ubicacion_padre_id_fkey" FOREIGN KEY ("ubicacion_padre_id") REFERENCES "ubicaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kardex" ADD CONSTRAINT "kardex_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kardex" ADD CONSTRAINT "kardex_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_kardex" ADD CONSTRAINT "movimientos_kardex_kardex_id_fkey" FOREIGN KEY ("kardex_id") REFERENCES "kardex"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_kardex" ADD CONSTRAINT "movimientos_kardex_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_kardex" ADD CONSTRAINT "movimientos_kardex_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_kardex" ADD CONSTRAINT "movimientos_kardex_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_kardex" ADD CONSTRAINT "movimientos_kardex_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_almacen_id_fkey" FOREIGN KEY ("almacen_id") REFERENCES "almacenes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventarios" ADD CONSTRAINT "inventarios_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_fisico" ADD CONSTRAINT "stock_fisico_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_fisico" ADD CONSTRAINT "stock_fisico_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_fisico" ADD CONSTRAINT "stock_fisico_ubicacion_id_fkey" FOREIGN KEY ("ubicacion_id") REFERENCES "ubicaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_fisico" ADD CONSTRAINT "stock_fisico_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_documento" ADD CONSTRAINT "tipos_documento_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipos_documento" ADD CONSTRAINT "tipos_documento_catalogo_sunat_id_fkey" FOREIGN KEY ("catalogo_sunat_id") REFERENCES "catalogo_sunat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "series" ADD CONSTRAINT "series_tipo_documento_id_fkey" FOREIGN KEY ("tipo_documento_id") REFERENCES "tipos_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estados_documento" ADD CONSTRAINT "estados_documento_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estados_documento" ADD CONSTRAINT "estados_documento_tipo_documento_id_fkey" FOREIGN KEY ("tipo_documento_id") REFERENCES "tipos_documento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gre" ADD CONSTRAINT "gre_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gre" ADD CONSTRAINT "gre_tipo_documento_id_fkey" FOREIGN KEY ("tipo_documento_id") REFERENCES "tipos_documento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gre" ADD CONSTRAINT "gre_serie_id_fkey" FOREIGN KEY ("serie_id") REFERENCES "series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gre" ADD CONSTRAINT "gre_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gre" ADD CONSTRAINT "gre_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gre" ADD CONSTRAINT "gre_estado_documento_id_fkey" FOREIGN KEY ("estado_documento_id") REFERENCES "estados_documento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gre" ADD CONSTRAINT "gre_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_gre" ADD CONSTRAINT "detalle_gre_gre_id_fkey" FOREIGN KEY ("gre_id") REFERENCES "gre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_gre" ADD CONSTRAINT "detalle_gre_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_gre" ADD CONSTRAINT "detalle_gre_unidad_medida_id_fkey" FOREIGN KEY ("unidad_medida_id") REFERENCES "unidades_medida"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivo_gre" ADD CONSTRAINT "archivo_gre_gre_id_fkey" FOREIGN KEY ("gre_id") REFERENCES "gre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivo_gre" ADD CONSTRAINT "archivo_gre_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliaciones" ADD CONSTRAINT "conciliaciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliaciones" ADD CONSTRAINT "conciliaciones_gre_id_fkey" FOREIGN KEY ("gre_id") REFERENCES "gre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conciliaciones" ADD CONSTRAINT "conciliaciones_ejecutado_por_id_fkey" FOREIGN KEY ("ejecutado_por_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_conciliaciones" ADD CONSTRAINT "historial_conciliaciones_conciliacion_id_fkey" FOREIGN KEY ("conciliacion_id") REFERENCES "conciliaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_conciliaciones" ADD CONSTRAINT "historial_conciliaciones_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_conciliaciones" ADD CONSTRAINT "historial_conciliaciones_detalle_gre_id_fkey" FOREIGN KEY ("detalle_gre_id") REFERENCES "detalle_gre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_gre_id_fkey" FOREIGN KEY ("gre_id") REFERENCES "gre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_conciliacion_id_fkey" FOREIGN KEY ("conciliacion_id") REFERENCES "conciliaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_historial_conciliacion_id_fkey" FOREIGN KEY ("historial_conciliacion_id") REFERENCES "historial_conciliaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias" ADD CONSTRAINT "incidencias_resuelto_por_id_fkey" FOREIGN KEY ("resuelto_por_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_gre_id_fkey" FOREIGN KEY ("gre_id") REFERENCES "gre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_conciliacion_id_fkey" FOREIGN KEY ("conciliacion_id") REFERENCES "conciliaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alertas" ADD CONSTRAINT "alertas_incidencia_id_fkey" FOREIGN KEY ("incidencia_id") REFERENCES "incidencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazabilidad_eventos" ADD CONSTRAINT "trazabilidad_eventos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazabilidad_eventos" ADD CONSTRAINT "trazabilidad_eventos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazabilidad_eventos" ADD CONSTRAINT "trazabilidad_eventos_gre_id_fkey" FOREIGN KEY ("gre_id") REFERENCES "gre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trazabilidad_eventos" ADD CONSTRAINT "trazabilidad_eventos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuraciones" ADD CONSTRAINT "configuraciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuraciones" ADD CONSTRAINT "configuraciones_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integraciones" ADD CONSTRAINT "integraciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dashboard_cache" ADD CONSTRAINT "dashboard_cache_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "power_bi_config" ADD CONSTRAINT "power_bi_config_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
