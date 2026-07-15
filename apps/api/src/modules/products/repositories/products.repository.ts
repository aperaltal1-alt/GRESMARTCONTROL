import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../database/base.repository';

const productInclude = {
  categoria: { select: { codigo: true, nombre: true } },
  unidadMedida: { select: { codigo: true, nombre: true } },
  kardex: { select: { saldoActual: true } },
} as const;

@Injectable()
export class ProductsRepository extends BaseRepository {
  findManyByEmpresa(
    empresaId: string,
    options: {
      skip: number;
      take: number;
      search?: string;
      activo?: boolean;
      categoria?: string;
    },
  ) {
    const where = this.buildWhere(empresaId, options);

    return this.prisma.producto.findMany({
      where,
      skip: options.skip,
      take: options.take,
      orderBy: [{ activo: 'desc' }, { nombre: 'asc' }],
      include: productInclude,
    });
  }

  countByEmpresa(
    empresaId: string,
    options: { search?: string; activo?: boolean; categoria?: string },
  ) {
    return this.prisma.producto.count({
      where: this.buildWhere(empresaId, options),
    });
  }

  findByIdAndEmpresa(id: string, empresaId: string) {
    return this.prisma.producto.findFirst({
      where: { id, empresaId, deletedAt: null },
      include: productInclude,
    });
  }

  findByCodigoAndEmpresa(codigo: string, empresaId: string) {
    return this.prisma.producto.findFirst({
      where: {
        codigo: { equals: codigo.trim(), mode: 'insensitive' },
        empresaId,
        deletedAt: null,
      },
    });
  }

  createWithKardex(data: {
    empresaId: string;
    categoriaId: string;
    unidadMedidaId: string;
    codigo: string;
    nombre: string;
    stockMinimo: Prisma.Decimal;
    stockActual: Prisma.Decimal;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const producto = await tx.producto.create({
        data: {
          empresaId: data.empresaId,
          categoriaId: data.categoriaId,
          unidadMedidaId: data.unidadMedidaId,
          codigo: data.codigo.trim().toUpperCase(),
          nombre: data.nombre.trim(),
          stockMinimo: data.stockMinimo,
          activo: true,
        },
        include: productInclude,
      });

      await tx.kardex.create({
        data: {
          empresaId: data.empresaId,
          productoId: producto.id,
          saldoActual: data.stockActual,
        },
      });

      return tx.producto.findUniqueOrThrow({
        where: { id: producto.id },
        include: productInclude,
      });
    });
  }

  updateProduct(
    id: string,
    data: Partial<{
      categoriaId: string;
      unidadMedidaId: string;
      codigo: string;
      nombre: string;
      stockMinimo: Prisma.Decimal;
      activo: boolean;
    }>,
    stockActual?: Prisma.Decimal,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const producto = await tx.producto.update({
        where: { id },
        data: {
          ...(data.categoriaId !== undefined ? { categoriaId: data.categoriaId } : {}),
          ...(data.unidadMedidaId !== undefined ? { unidadMedidaId: data.unidadMedidaId } : {}),
          ...(data.codigo !== undefined
            ? { codigo: data.codigo.trim().toUpperCase() }
            : {}),
          ...(data.nombre !== undefined ? { nombre: data.nombre.trim() } : {}),
          ...(data.stockMinimo !== undefined ? { stockMinimo: data.stockMinimo } : {}),
          ...(data.activo !== undefined ? { activo: data.activo } : {}),
        },
        include: productInclude,
      });

      if (stockActual !== undefined) {
        await tx.kardex.updateMany({
          where: { productoId: id },
          data: { saldoActual: stockActual },
        });

        return tx.producto.findUniqueOrThrow({
          where: { id },
          include: productInclude,
        });
      }

      return producto;
    });
  }

  softDelete(id: string) {
    return this.prisma.producto.update({
      where: { id },
      data: {
        activo: false,
        deletedAt: new Date(),
      },
      include: productInclude,
    });
  }

  private buildWhere(
    empresaId: string,
    options: { search?: string; activo?: boolean; categoria?: string },
  ): Prisma.ProductoWhereInput {
    return {
      empresaId,
      deletedAt: null,
      ...(options.activo !== undefined ? { activo: options.activo } : {}),
      ...(options.categoria
        ? {
            categoria: {
              OR: [
                { codigo: { equals: options.categoria, mode: 'insensitive' } },
                { nombre: { contains: options.categoria, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
      ...(options.search
        ? {
            OR: [
              { codigo: { contains: options.search, mode: 'insensitive' } },
              { nombre: { contains: options.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }
}
