import { Injectable } from '@nestjs/common';
import { Prisma, TipoMovimientoKardex } from '@prisma/client';
import { BaseRepository } from '../../../database/base.repository';

const movementInclude = {
  producto: { select: { id: true, codigo: true, nombre: true } },
} as const;

@Injectable()
export class KardexRepository extends BaseRepository {
  findProductWithKardex(productoId: string, empresaId: string) {
    return this.prisma.producto.findFirst({
      where: { id: productoId, empresaId, deletedAt: null, activo: true },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        kardex: true,
      },
    });
  }

  findManyMovements(
    empresaId: string,
    options: {
      skip: number;
      take: number;
      producto?: string;
      tipo?: TipoMovimientoKardex;
      fechaDesde?: string;
      fechaHasta?: string;
    },
  ) {
    return this.prisma.movimientoKardex.findMany({
      where: this.buildMovementWhere(empresaId, options),
      skip: options.skip,
      take: options.take,
      orderBy: [{ createdAt: 'desc' }],
      include: movementInclude,
    });
  }

  countMovements(
    empresaId: string,
    options: {
      producto?: string;
      tipo?: TipoMovimientoKardex;
      fechaDesde?: string;
      fechaHasta?: string;
    },
  ) {
    return this.prisma.movimientoKardex.count({
      where: this.buildMovementWhere(empresaId, options),
    });
  }

  createMovement(data: {
    kardexId: string;
    productoId: string;
    empresaId: string;
    tipo: TipoMovimientoKardex;
    cantidad: Prisma.Decimal;
    saldoAnterior: Prisma.Decimal;
    saldoNuevo: Prisma.Decimal;
    observacion?: string;
    usuarioId: string;
    fecha: Date;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const movimiento = await tx.movimientoKardex.create({
        data: {
          kardexId: data.kardexId,
          productoId: data.productoId,
          empresaId: data.empresaId,
          tipo: data.tipo,
          cantidad: data.cantidad,
          saldoAnterior: data.saldoAnterior,
          saldoNuevo: data.saldoNuevo,
          referenciaTipo: 'MANUAL',
          observacion: data.observacion?.trim(),
          usuarioId: data.usuarioId,
          createdAt: data.fecha,
        },
        include: movementInclude,
      });

      await tx.kardex.update({
        where: { id: data.kardexId },
        data: {
          saldoActual: data.saldoNuevo,
          ultimoMovimientoAt: data.fecha,
        },
      });

      return movimiento;
    });
  }

  findInventoryProducts(empresaId: string) {
    return this.prisma.producto.findMany({
      where: { empresaId, deletedAt: null, activo: true },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        stockMinimo: true,
        kardex: { select: { saldoActual: true } },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  countInventoryProducts(empresaId: string) {
    return this.prisma.producto.count({
      where: { empresaId, deletedAt: null, activo: true },
    });
  }

  findInventoryProductsPaginated(empresaId: string, skip: number, take: number) {
    return this.prisma.producto.findMany({
      where: { empresaId, deletedAt: null, activo: true },
      select: {
        id: true,
        codigo: true,
        nombre: true,
        stockMinimo: true,
        kardex: { select: { saldoActual: true } },
      },
      skip,
      take,
      orderBy: { nombre: 'asc' },
    });
  }

  private buildMovementWhere(
    empresaId: string,
    options: {
      producto?: string;
      tipo?: TipoMovimientoKardex;
      fechaDesde?: string;
      fechaHasta?: string;
    },
  ): Prisma.MovimientoKardexWhereInput {
    const createdAtFilter: Prisma.DateTimeFilter | undefined =
      options.fechaDesde || options.fechaHasta
        ? {
            ...(options.fechaDesde ? { gte: new Date(`${options.fechaDesde}T00:00:00.000Z`) } : {}),
            ...(options.fechaHasta ? { lte: new Date(`${options.fechaHasta}T23:59:59.999Z`) } : {}),
          }
        : undefined;

    return {
      empresaId,
      ...(options.producto ? { productoId: options.producto } : {}),
      ...(options.tipo ? { tipo: options.tipo } : {}),
      ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
    };
  }
}
