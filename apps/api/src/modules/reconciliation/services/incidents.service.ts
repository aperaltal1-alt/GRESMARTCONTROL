import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { RECONCILIATION_CONSTANTS } from '../constants';
import { ListIncidentsQueryDto } from '../dto';
import { IncidentSummaryItem, PaginatedIncidents } from '../interfaces';
import { ReconciliationRepository } from '../repositories';

type IncidenciaRecord = Awaited<
  ReturnType<ReconciliationRepository['findManyIncidencias']>
>[number];

@Injectable()
export class IncidentsService {
  constructor(private readonly reconciliationRepo: ReconciliationRepository) {}

  async listIncidents(
    empresaId: string,
    query: ListIncidentsQueryDto,
  ): Promise<PaginatedIncidents> {
    const page = query.page ?? RECONCILIATION_CONSTANTS.DEFAULT_PAGE;
    const limit = query.limit ?? RECONCILIATION_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filters = { greId: query.greId, estado: query.estado };

    const [items, total] = await Promise.all([
      this.reconciliationRepo.findManyIncidencias(empresaId, {
        skip,
        take: limit,
        ...filters,
      }),
      this.reconciliationRepo.countIncidencias(empresaId, filters),
    ]);

    return {
      items: items.map((item) => this.toIncident(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async resolveIncident(
    id: string,
    user: AuthenticatedUser,
  ): Promise<{ id: string; estado: string; resolvedAt: string; message: string }> {
    const incidencia = await this.reconciliationRepo.findIncidenciaById(id, user.empresaId);
    if (!incidencia) {
      throw new NotFoundException('Incidencia no encontrada');
    }

    const updated = await this.reconciliationRepo.resolveIncidencia(id, user.id);

    return {
      id: updated.id,
      estado: updated.estado,
      resolvedAt: updated.resolvedAt!.toISOString(),
      message: 'Incidencia marcada como resuelta',
    };
  }

  private toIncident(item: IncidenciaRecord): IncidentSummaryItem {
    return {
      id: item.id,
      greId: item.greId,
      greNumero: item.gre.numero,
      greSerie: item.gre.serie.codigo,
      productoId: item.productoId,
      codigoProducto: item.producto.codigo,
      nombreProducto: item.producto.nombre,
      tipo: item.tipo,
      cantidadGre: Number(item.cantidadGre),
      cantidadKardex: Number(item.cantidadKardex),
      cantidadInventario: Number(item.cantidadFisico),
      diferencia: Number(item.diferencia),
      estado: item.estado,
      prioridad: item.prioridad,
      observacion: item.observacion,
      createdAt: item.createdAt.toISOString(),
      resolvedAt: item.resolvedAt?.toISOString() ?? null,
    };
  }
}
