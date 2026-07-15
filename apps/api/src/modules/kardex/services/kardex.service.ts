import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TipoMovimientoKardex } from '@prisma/client';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { InventoryState, KARDEX_CONSTANTS } from '../constants';
import { CreateKardexMovementDto, ListKardexQueryDto } from '../dto';
import {
  InventoryItem,
  KardexMovementItem,
  PaginatedInventory,
  PaginatedKardexMovements,
} from '../interfaces';
import { KardexRepository } from '../repositories';

type MovementRecord = Awaited<ReturnType<KardexRepository['findManyMovements']>>[number];

@Injectable()
export class KardexService {
  constructor(private readonly kardexRepo: KardexRepository) {}

  async listMovements(
    empresaId: string,
    query: ListKardexQueryDto,
  ): Promise<PaginatedKardexMovements> {
    const page = query.page ?? KARDEX_CONSTANTS.DEFAULT_PAGE;
    const limit = query.limit ?? KARDEX_CONSTANTS.DEFAULT_LIMIT;
    const skip = (page - 1) * limit;

    const filters = {
      producto: query.producto,
      tipo: query.tipo as TipoMovimientoKardex | undefined,
      fechaDesde: query.fechaDesde,
      fechaHasta: query.fechaHasta,
    };

    const [items, total] = await Promise.all([
      this.kardexRepo.findManyMovements(empresaId, { skip, take: limit, ...filters }),
      this.kardexRepo.countMovements(empresaId, filters),
    ]);

    return {
      items: items.map((item) => this.toMovementResponse(item)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async registerMovement(
    dto: CreateKardexMovementDto,
    user: AuthenticatedUser,
  ): Promise<KardexMovementItem> {
    const producto = await this.kardexRepo.findProductWithKardex(dto.productoId, user.empresaId);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    if (!producto.kardex) {
      throw new NotFoundException('Kardex no encontrado para el producto');
    }

    const cantidad = new Prisma.Decimal(dto.cantidad);
    const saldoAnterior = producto.kardex.saldoActual;
    const { saldoNuevo, cantidadRegistrada } = this.calculateBalances(
      dto.tipo,
      saldoAnterior,
      cantidad,
    );

    const movimiento = await this.kardexRepo.createMovement({
      kardexId: producto.kardex.id,
      productoId: producto.id,
      empresaId: user.empresaId,
      tipo: dto.tipo,
      cantidad: cantidadRegistrada,
      saldoAnterior,
      saldoNuevo,
      observacion: dto.observacion,
      usuarioId: user.id,
      fecha: new Date(`${dto.fecha}T12:00:00.000Z`),
    });

    return this.toMovementResponse(movimiento);
  }

  private calculateBalances(
    tipo: CreateKardexMovementDto['tipo'],
    saldoAnterior: Prisma.Decimal,
    cantidad: Prisma.Decimal,
  ) {
    switch (tipo) {
      case 'ENTRADA': {
        const saldoNuevo = saldoAnterior.add(cantidad);
        return { saldoNuevo, cantidadRegistrada: cantidad };
      }
      case 'SALIDA': {
        const saldoNuevo = saldoAnterior.sub(cantidad);
        if (saldoNuevo.lessThan(0)) {
          throw new ConflictException('Stock insuficiente para registrar la salida');
        }
        return { saldoNuevo, cantidadRegistrada: cantidad };
      }
      case 'AJUSTE': {
        if (cantidad.lessThan(0)) {
          throw new BadRequestException('El stock resultante no puede ser negativo');
        }
        const delta = cantidad.sub(saldoAnterior).abs();
        return { saldoNuevo: cantidad, cantidadRegistrada: delta };
      }
      default:
        throw new BadRequestException('Tipo de movimiento no válido');
    }
  }

  private toMovementResponse(movimiento: MovementRecord): KardexMovementItem {
    return {
      id: movimiento.id,
      productoId: movimiento.productoId,
      codigoProducto: movimiento.producto.codigo,
      nombreProducto: movimiento.producto.nombre,
      fecha: movimiento.createdAt.toISOString().slice(0, 10),
      tipo: movimiento.tipo,
      cantidad: Number(movimiento.cantidad),
      saldoAnterior: Number(movimiento.saldoAnterior),
      saldoNuevo: Number(movimiento.saldoNuevo),
      observacion: movimiento.observacion,
      createdAt: movimiento.createdAt.toISOString(),
    };
  }

  computeInventoryState(stockActual: number, stockMinimo: number): InventoryState {
    if (stockActual <= 0) return 'SIN STOCK';
    if (stockActual <= stockMinimo) return 'BAJO';
    return 'NORMAL';
  }
}
