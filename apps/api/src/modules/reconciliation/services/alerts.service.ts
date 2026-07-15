import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { RECONCILIATION_CONSTANTS } from '../constants';
import { ListAlertsQueryDto } from '../dto';
import { AlertSummaryItem, PaginatedAlerts } from '../interfaces';
import { ReconciliationRepository } from '../repositories';

type AlertaRecord = Awaited<ReturnType<ReconciliationRepository['findManyAlertas']>>[number];

@Injectable()
export class AlertsService {
  constructor(private readonly reconciliationRepo: ReconciliationRepository) {}

  async listAlerts(empresaId: string, query: ListAlertsQueryDto): Promise<PaginatedAlerts> {
    const page = query.page ?? RECONCILIATION_CONSTANTS.DEFAULT_PAGE;
    const limit = query.limit ?? RECONCILIATION_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;
    const activa = query.activa ?? true;

    const [items, total] = await Promise.all([
      this.reconciliationRepo.findManyAlertas(empresaId, { skip, take: limit, activa }),
      this.reconciliationRepo.countAlertas(empresaId, { activa }),
    ]);

    return {
      items: items.map((item) => this.toAlert(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async markAlertRead(
    id: string,
    user: AuthenticatedUser,
  ): Promise<{ id: string; leida: boolean; message: string }> {
    const alerta = await this.reconciliationRepo.findAlertaById(id, user.empresaId);
    if (!alerta) {
      throw new NotFoundException('Alerta no encontrada');
    }

    const updated = await this.reconciliationRepo.markAlertRead(id);

    return {
      id: updated.id,
      leida: updated.leida,
      message: 'Alerta marcada como leída',
    };
  }

  private toAlert(item: AlertaRecord): AlertSummaryItem {
    return {
      id: item.id,
      tipo: item.tipo,
      nivel: item.nivel,
      mensaje: item.mensaje,
      productoId: item.productoId,
      codigoProducto: item.producto?.codigo ?? null,
      greId: item.greId,
      greNumero: item.gre ? `${item.gre.serie.codigo}-${item.gre.numero}` : null,
      conciliacionId: item.conciliacionId,
      incidenciaId: item.incidenciaId,
      leida: item.leida,
      activa: item.activa,
      createdAt: item.createdAt.toISOString(),
    };
  }
}
