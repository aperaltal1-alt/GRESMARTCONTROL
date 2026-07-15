import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TipoAlerta, TipoIncidencia } from '@prisma/client';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { RECONCILIATION_CONSTANTS } from '../constants';
import { ListReconciliationQueryDto } from '../dto';
import {
  PaginatedReconciliations,
  ReconciliationDetail,
  ReconciliationSummaryItem,
  RunReconciliationResult,
} from '../interfaces';
import {
  LineComparisonResult,
  ReconciliationRepository,
} from '../repositories';

type ConciliacionListRecord = Awaited<
  ReturnType<ReconciliationRepository['findManyConciliaciones']>
>[number];
type ConciliacionDetailRecord = NonNullable<
  Awaited<ReturnType<ReconciliationRepository['findConciliacionById']>>
>;

@Injectable()
export class ReconciliationService {
  constructor(private readonly reconciliationRepo: ReconciliationRepository) {}

  async listReconciliations(
    empresaId: string,
    query: ListReconciliationQueryDto,
  ): Promise<PaginatedReconciliations> {
    const page = query.page ?? RECONCILIATION_CONSTANTS.DEFAULT_PAGE;
    const limit = query.limit ?? RECONCILIATION_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filters = { greId: query.greId, estado: query.estado };

    const [items, total] = await Promise.all([
      this.reconciliationRepo.findManyConciliaciones(empresaId, {
        skip,
        take: limit,
        ...filters,
      }),
      this.reconciliationRepo.countConciliaciones(empresaId, filters),
    ]);

    return {
      items: items.map((item) => this.toSummary(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getReconciliationById(id: string, empresaId: string): Promise<ReconciliationDetail> {
    const conciliacion = await this.reconciliationRepo.findConciliacionById(id, empresaId);
    if (!conciliacion) {
      throw new NotFoundException('Conciliación no encontrada');
    }
    return this.toDetail(conciliacion);
  }

  async runReconciliation(
    greId: string,
    user: AuthenticatedUser,
  ): Promise<RunReconciliationResult> {
    const startedAt = Date.now();
    const gre = await this.reconciliationRepo.findGreForReconciliation(greId, user.empresaId);

    if (!gre) {
      throw new NotFoundException('GRE no encontrada');
    }

    if (!gre.detalles.length) {
      throw new BadRequestException('La GRE no tiene productos para conciliar');
    }

    const lineas: LineComparisonResult[] = [];

    for (const detalle of gre.detalles) {
      if (!detalle.productoId || !detalle.producto) {
        throw new BadRequestException(
          `El detalle ${detalle.codigoProducto} no tiene producto asociado`,
        );
      }

      const kardex = await this.reconciliationRepo.findKardexByProductoId(detalle.productoId);
      const cantidadKardex = kardex?.saldoActual ?? new Prisma.Decimal(0);
      const cantidadInventario = await this.reconciliationRepo.getInventarioStock(
        detalle.productoId,
        user.empresaId,
        cantidadKardex,
      );

      const cantidadGre = detalle.cantidad;
      const diffGreKardex = cantidadGre.sub(cantidadKardex);
      const diffGreInventario = cantidadGre.sub(cantidadInventario);
      const diffKardexInventario = cantidadKardex.sub(cantidadInventario);

      const hasDifference =
        !diffGreKardex.isZero() || !diffGreInventario.isZero() || !diffKardexInventario.isZero();

      const diferencia = Math.max(
        Math.abs(Number(diffGreKardex)),
        Math.abs(Number(diffGreInventario)),
        Math.abs(Number(diffKardexInventario)),
      );

      lineas.push({
        detalleGreId: detalle.id,
        productoId: detalle.productoId,
        codigoProducto: detalle.producto.codigo,
        nombreProducto: detalle.producto.nombre,
        cantidadGre,
        cantidadKardex,
        cantidadInventario,
        diffGreKardex,
        diffGreInventario,
        diffKardexInventario,
        resultado: hasDifference ? 'DIFERENCIA' : 'OK',
        diferencia,
        ...(hasDifference
          ? {
              tipoIncidencia: this.resolveIncidenciaType(
                diffGreKardex,
                diffGreInventario,
                diffKardexInventario,
              ),
              tipoAlerta: this.resolveAlertaType(
                diffGreKardex,
                diffGreInventario,
                diffKardexInventario,
              ),
            }
          : {}),
      });
    }

    const hasDifferences = lineas.some((linea) => linea.resultado === 'DIFERENCIA');
    const greEstado = hasDifferences
      ? RECONCILIATION_CONSTANTS.GRE_ESTADO_CON_DIFERENCIA
      : RECONCILIATION_CONSTANTS.GRE_ESTADO_CONCILIADA;
    const conciliacionEstado = hasDifferences
      ? RECONCILIATION_CONSTANTS.CONCILIACION_CON_DIFERENCIAS
      : RECONCILIATION_CONSTANTS.CONCILIACION_COMPLETADA;

    const estadoDocumento = await this.reconciliationRepo.findEstadoDocumento(
      user.empresaId,
      gre.tipoDocumento.id,
      greEstado,
    );

    const version = await this.reconciliationRepo.getNextVersion(gre.id);
    const duracionMs = Date.now() - startedAt;

    const result = await this.reconciliationRepo.runReconciliation({
      greId: gre.id,
      empresaId: user.empresaId,
      ejecutadoPorId: user.id,
      version,
      lineas,
      greEstado,
      estadoDocumentoId: estadoDocumento?.id,
      conciliacionEstado,
      greSerie: gre.serie.codigo,
      greNumero: gre.numero,
      duracionMs,
    });

    return {
      conciliacionId: result.conciliacion.id,
      greId: gre.id,
      version,
      estado: result.conciliacion.estado,
      resultadoGre: greEstado,
      totalLineas: lineas.length,
      lineasOk: result.lineasOk,
      lineasConDiferencia: result.lineasConDiferencia,
      incidenciasCreadas: result.incidenciasCreadas,
      alertasCreadas: result.alertasCreadas,
      duracionMs,
    };
  }

  private resolveIncidenciaType(
    diffGreKardex: Prisma.Decimal,
    diffGreInventario: Prisma.Decimal,
    diffKardexInventario: Prisma.Decimal,
  ): TipoIncidencia {
    const hasGreKardex = !diffGreKardex.isZero();
    const hasGreInventario = !diffGreInventario.isZero();
    const hasKardexInventario = !diffKardexInventario.isZero();

    if ([hasGreKardex, hasGreInventario, hasKardexInventario].filter(Boolean).length >= 2) {
      return 'TRIPLE';
    }
    if (hasGreKardex) return 'GRE_KARDEX';
    if (hasGreInventario) return 'GRE_FISICO';
    return 'KARDEX_FISICO';
  }

  private resolveAlertaType(
    diffGreKardex: Prisma.Decimal,
    diffGreInventario: Prisma.Decimal,
    diffKardexInventario: Prisma.Decimal,
  ): TipoAlerta {
    if (!diffGreKardex.isZero()) return 'DIFERENCIA_GRE';
    if (!diffGreInventario.isZero()) return 'DIFERENCIA_FISICO';
    return 'DIFERENCIA_KARDEX';
  }

  private toSummary(item: ConciliacionListRecord): ReconciliationSummaryItem {
    return {
      id: item.id,
      greId: item.greId,
      greNumero: item.gre.numero,
      greSerie: item.gre.serie.codigo,
      version: item.version,
      estado: item.estado,
      metodo: item.metodo,
      totalLineas: item.totalLineas,
      lineasOk: item.lineasOk,
      lineasConDiferencia: item.lineasConDiferencia,
      resultadoGre: item.gre.estado,
      ejecutadoPor: item.ejecutadoPor.email,
      iniciadoAt: item.iniciadoAt.toISOString(),
      completadoAt: item.completadoAt?.toISOString() ?? null,
      duracionMs: item.duracionMs,
    };
  }

  private toDetail(item: ConciliacionDetailRecord): ReconciliationDetail {
    return {
      ...this.toSummary(item),
      observacion: item.observacion,
      lineas: item.historial.map((linea) => ({
        id: linea.id,
        productoId: linea.productoId,
        codigoProducto: linea.producto.codigo,
        nombreProducto: linea.producto.nombre,
        cantidadGre: Number(linea.cantidadGre),
        cantidadKardex: Number(linea.cantidadKardex),
        cantidadInventario: Number(linea.cantidadFisico),
        diffGreKardex: Number(linea.diffGreKardex),
        diffGreInventario: Number(linea.diffGreFisico),
        diffKardexInventario: Number(linea.diffKardexFisico),
        resultado: linea.resultado,
        diferencia: Math.max(
          Math.abs(Number(linea.diffGreKardex)),
          Math.abs(Number(linea.diffGreFisico)),
          Math.abs(Number(linea.diffKardexFisico)),
        ),
      })),
      incidencias: item.incidencias.map((inc) => ({
        id: inc.id,
        greId: inc.greId,
        greNumero: inc.gre.numero,
        greSerie: inc.gre.serie.codigo,
        productoId: inc.productoId,
        codigoProducto: inc.producto.codigo,
        nombreProducto: inc.producto.nombre,
        tipo: inc.tipo,
        cantidadGre: Number(inc.cantidadGre),
        cantidadKardex: Number(inc.cantidadKardex),
        cantidadInventario: Number(inc.cantidadFisico),
        diferencia: Number(inc.diferencia),
        estado: inc.estado,
        prioridad: inc.prioridad,
        observacion: inc.observacion,
        createdAt: inc.createdAt.toISOString(),
        resolvedAt: inc.resolvedAt?.toISOString() ?? null,
      })),
      alertas: item.alertas.map((alerta) => ({
        id: alerta.id,
        tipo: alerta.tipo,
        nivel: alerta.nivel,
        mensaje: alerta.mensaje,
        productoId: alerta.productoId,
        codigoProducto: alerta.producto?.codigo ?? null,
        greId: alerta.greId,
        greNumero: alerta.gre ? `${alerta.gre.serie.codigo}-${alerta.gre.numero}` : null,
        conciliacionId: alerta.conciliacionId,
        incidenciaId: alerta.incidenciaId,
        leida: alerta.leida,
        activa: alerta.activa,
        createdAt: alerta.createdAt.toISOString(),
      })),
    };
  }
}
