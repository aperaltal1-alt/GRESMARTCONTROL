import { Injectable } from '@nestjs/common';
import {
  ConciliacionEstado,
  HistorialConciliacionResultado,
  NivelAlerta,
  Prisma,
  TipoAlerta,
  TipoIncidencia,
} from '@prisma/client';
import { BaseRepository } from '../../../database/base.repository';
import { RECONCILIATION_CONSTANTS } from '../constants';

const conciliacionListInclude = {
  gre: { select: { numero: true, serie: { select: { codigo: true } }, estado: true } },
  ejecutadoPor: { select: { email: true } },
} as const;

const conciliacionDetailInclude = {
  gre: { select: { numero: true, serie: { select: { codigo: true } }, estado: true } },
  ejecutadoPor: { select: { email: true } },
  historial: {
    orderBy: { createdAt: 'asc' as const },
    include: {
      producto: { select: { codigo: true, nombre: true } },
      detalleGre: { select: { codigoProducto: true } },
    },
  },
  incidencias: {
    include: {
      producto: { select: { codigo: true, nombre: true } },
      gre: { select: { numero: true, serie: { select: { codigo: true } } } },
    },
  },
  alertas: {
    include: {
      producto: { select: { codigo: true } },
      gre: { select: { numero: true, serie: { select: { codigo: true } } } },
    },
  },
} as const;

const incidenciaInclude = {
  producto: { select: { codigo: true, nombre: true } },
  gre: { select: { numero: true, serie: { select: { codigo: true } } } },
} as const;

const alertaInclude = {
  producto: { select: { codigo: true } },
  gre: { select: { numero: true, serie: { select: { codigo: true } } } },
} as const;

export interface LineComparisonResult {
  detalleGreId: string;
  productoId: string;
  codigoProducto: string;
  nombreProducto: string;
  cantidadGre: Prisma.Decimal;
  cantidadKardex: Prisma.Decimal;
  cantidadInventario: Prisma.Decimal;
  diffGreKardex: Prisma.Decimal;
  diffGreInventario: Prisma.Decimal;
  diffKardexInventario: Prisma.Decimal;
  resultado: HistorialConciliacionResultado;
  diferencia: number;
  tipoIncidencia?: TipoIncidencia;
  tipoAlerta?: TipoAlerta;
}

@Injectable()
export class ReconciliationRepository extends BaseRepository {
  findKardexByProductoId(productoId: string) {
    return this.prisma.kardex.findUnique({
      where: { productoId },
      select: { saldoActual: true },
    });
  }

  findGreForReconciliation(greId: string, empresaId: string) {
    return this.prisma.gre.findFirst({
      where: { id: greId, empresaId, deletedAt: null, activo: true },
      include: {
        serie: { select: { codigo: true } },
        tipoDocumento: { select: { id: true } },
        detalles: {
          orderBy: { orden: 'asc' },
          include: {
            producto: { select: { id: true, codigo: true, nombre: true } },
          },
        },
      },
    });
  }

  getNextVersion(greId: string) {
    return this.prisma.conciliacion
      .aggregate({
        where: { greId },
        _max: { version: true },
      })
      .then((result) => (result._max.version ?? 0) + 1);
  }

  findEstadoDocumento(empresaId: string, tipoDocumentoId: string, codigo: string) {
    return this.prisma.estadoDocumento.findFirst({
      where: { empresaId, tipoDocumentoId, codigo, activo: true },
    });
  }

  async getInventarioStock(productoId: string, empresaId: string, kardexFallback: Prisma.Decimal) {
    const inventarios = await this.prisma.inventario.findMany({
      where: { productoId, empresaId },
      select: { cantidadFisica: true },
    });

    if (!inventarios.length) {
      return kardexFallback;
    }

    return inventarios.reduce(
      (total, item) => total.add(item.cantidadFisica),
      new Prisma.Decimal(0),
    );
  }

  runReconciliation(params: {
    greId: string;
    empresaId: string;
    ejecutadoPorId: string;
    version: number;
    lineas: LineComparisonResult[];
    greEstado: 'CONCILIADA' | 'CON_DIFERENCIA';
    estadoDocumentoId?: string;
    conciliacionEstado: ConciliacionEstado;
    greSerie: string;
    greNumero: string;
    duracionMs: number;
  }) {
    const lineasOk = params.lineas.filter((l) => l.resultado === 'OK').length;
    const lineasConDiferencia = params.lineas.length - lineasOk;

    return this.prisma.$transaction(async (tx) => {
      const conciliacion = await tx.conciliacion.create({
        data: {
          empresaId: params.empresaId,
          greId: params.greId,
          version: params.version,
          estado: params.conciliacionEstado,
          metodo: 'MANUAL',
          totalLineas: params.lineas.length,
          lineasOk,
          lineasConDiferencia,
          ejecutadoPorId: params.ejecutadoPorId,
          completadoAt: new Date(),
          duracionMs: params.duracionMs,
          observacion:
            lineasConDiferencia > 0
              ? `Conciliación con ${lineasConDiferencia} línea(s) con diferencias`
              : 'Conciliación completada sin diferencias',
        },
      });

      let incidenciasCreadas = 0;
      let alertasCreadas = 0;

      for (const linea of params.lineas) {
        const historial = await tx.historialConciliacion.create({
          data: {
            conciliacionId: conciliacion.id,
            productoId: linea.productoId,
            detalleGreId: linea.detalleGreId,
            cantidadGre: linea.cantidadGre,
            cantidadKardex: linea.cantidadKardex,
            cantidadFisico: linea.cantidadInventario,
            diffGreKardex: linea.diffGreKardex,
            diffGreFisico: linea.diffGreInventario,
            diffKardexFisico: linea.diffKardexInventario,
            resultado: linea.resultado,
          },
        });

        if (linea.resultado === 'DIFERENCIA' && linea.tipoIncidencia && linea.tipoAlerta) {
          const incidencia = await tx.incidencia.create({
            data: {
              empresaId: params.empresaId,
              greId: params.greId,
              productoId: linea.productoId,
              conciliacionId: conciliacion.id,
              historialConciliacionId: historial.id,
              tipo: linea.tipoIncidencia,
              cantidadGre: linea.cantidadGre,
              cantidadKardex: linea.cantidadKardex,
              cantidadFisico: linea.cantidadInventario,
              diferencia: new Prisma.Decimal(linea.diferencia),
              estado: 'PENDIENTE',
              prioridad: linea.diferencia >= 50 ? 'ALTA' : 'MEDIA',
              observacion: `Diferencia detectada en ${linea.codigoProducto}: ${linea.diferencia} unidades`,
            },
          });
          incidenciasCreadas++;

          await tx.alerta.create({
            data: {
              empresaId: params.empresaId,
              tipo: linea.tipoAlerta,
              nivel: 'WARNING' as NivelAlerta,
              mensaje: `Diferencia en ${linea.codigoProducto} — GRE ${params.greSerie}-${params.greNumero} (${linea.diferencia} uds)`,
              productoId: linea.productoId,
              greId: params.greId,
              conciliacionId: conciliacion.id,
              incidenciaId: incidencia.id,
              activa: true,
              leida: false,
            },
          });
          alertasCreadas++;
        }
      }

      await tx.gre.update({
        where: { id: params.greId },
        data: {
          estado: params.greEstado,
          ...(params.estadoDocumentoId ? { estadoDocumentoId: params.estadoDocumentoId } : {}),
        },
      });

      return {
        conciliacion,
        incidenciasCreadas,
        alertasCreadas,
        lineasOk,
        lineasConDiferencia,
      };
    });
  }

  findManyConciliaciones(
    empresaId: string,
    options: {
      skip: number;
      take: number;
      greId?: string;
      estado?: ConciliacionEstado;
    },
  ) {
    return this.prisma.conciliacion.findMany({
      where: {
        empresaId,
        ...(options.greId ? { greId: options.greId } : {}),
        ...(options.estado ? { estado: options.estado } : {}),
      },
      skip: options.skip,
      take: options.take,
      orderBy: [{ completadoAt: 'desc' }, { version: 'desc' }],
      include: conciliacionListInclude,
    });
  }

  countConciliaciones(
    empresaId: string,
    options: { greId?: string; estado?: ConciliacionEstado },
  ) {
    return this.prisma.conciliacion.count({
      where: {
        empresaId,
        ...(options.greId ? { greId: options.greId } : {}),
        ...(options.estado ? { estado: options.estado } : {}),
      },
    });
  }

  findConciliacionById(id: string, empresaId: string) {
    return this.prisma.conciliacion.findFirst({
      where: { id, empresaId },
      include: conciliacionDetailInclude,
    });
  }

  findManyIncidencias(
    empresaId: string,
    options: {
      skip: number;
      take: number;
      greId?: string;
      estado?: Prisma.EnumIncidenciaEstadoFilter['equals'];
    },
  ) {
    return this.prisma.incidencia.findMany({
      where: {
        empresaId,
        ...(options.greId ? { greId: options.greId } : {}),
        ...(options.estado ? { estado: options.estado } : {}),
      },
      skip: options.skip,
      take: options.take,
      orderBy: [{ createdAt: 'desc' }],
      include: incidenciaInclude,
    });
  }

  countIncidencias(
    empresaId: string,
    options: { greId?: string; estado?: Prisma.EnumIncidenciaEstadoFilter['equals'] },
  ) {
    return this.prisma.incidencia.count({
      where: {
        empresaId,
        ...(options.greId ? { greId: options.greId } : {}),
        ...(options.estado ? { estado: options.estado } : {}),
      },
    });
  }

  findIncidenciaById(id: string, empresaId: string) {
    return this.prisma.incidencia.findFirst({
      where: { id, empresaId },
    });
  }

  resolveIncidencia(id: string, resueltoPorId: string) {
    return this.prisma.incidencia.update({
      where: { id },
      data: {
        estado: 'RESUELTA',
        resueltoPorId,
        resolvedAt: new Date(),
      },
    });
  }

  findManyAlertas(
    empresaId: string,
    options: { skip: number; take: number; activa?: boolean },
  ) {
    return this.prisma.alerta.findMany({
      where: {
        empresaId,
        ...(options.activa !== undefined ? { activa: options.activa } : {}),
      },
      skip: options.skip,
      take: options.take,
      orderBy: [{ createdAt: 'desc' }],
      include: alertaInclude,
    });
  }

  countAlertas(empresaId: string, options: { activa?: boolean }) {
    return this.prisma.alerta.count({
      where: {
        empresaId,
        ...(options.activa !== undefined ? { activa: options.activa } : {}),
      },
    });
  }

  findAlertaById(id: string, empresaId: string) {
    return this.prisma.alerta.findFirst({
      where: { id, empresaId },
    });
  }

  markAlertRead(id: string) {
    return this.prisma.alerta.update({
      where: { id },
      data: { leida: true },
    });
  }
}
