import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../database/base.repository';

export const greDetailInclude = {
  producto: { select: { id: true, codigo: true, nombre: true } },
} as const;

export const greFullInclude = {
  serie: { select: { codigo: true } },
  empresa: { select: { ruc: true, razonSocial: true, nombreComercial: true } },
  detalles: {
    orderBy: { orden: 'asc' as const },
    include: greDetailInclude,
  },
  archivos: {
    select: {
      id: true,
      tipo: true,
      nombreOriginal: true,
      mimeType: true,
      tamanoBytes: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' as const },
  },
} as const;

export const greListInclude = {
  serie: { select: { codigo: true } },
  empresa: { select: { ruc: true, razonSocial: true, nombreComercial: true } },
  _count: { select: { detalles: true } },
} as const;

@Injectable()
export class GreRepository extends BaseRepository {
  findManyByEmpresa(
    empresaId: string,
    options: {
      skip: number;
      take: number;
      numero?: string;
      serie?: string;
      estado?: string;
      fechaDesde?: string;
      fechaHasta?: string;
      empresa?: string;
    },
  ) {
    return this.prisma.gre.findMany({
      where: this.buildWhere(empresaId, options),
      skip: options.skip,
      take: options.take,
      orderBy: [{ fechaEmision: 'desc' }, { numero: 'desc' }],
      include: greListInclude,
    });
  }

  countByEmpresa(
    empresaId: string,
    options: {
      numero?: string;
      serie?: string;
      estado?: string;
      fechaDesde?: string;
      fechaHasta?: string;
      empresa?: string;
    },
  ) {
    return this.prisma.gre.count({
      where: this.buildWhere(empresaId, options),
    });
  }

  findByIdAndEmpresa(id: string, empresaId: string) {
    return this.prisma.gre.findFirst({
      where: { id, empresaId, deletedAt: null },
      include: greFullInclude,
    });
  }

  findBySerieAndNumero(serieId: string, numero: string, empresaId: string) {
    return this.prisma.gre.findFirst({
      where: {
        serieId,
        numero: numero.trim(),
        empresaId,
        deletedAt: null,
      },
    });
  }

  createWithDetalles(data: {
    empresaId: string;
    tipoDocumentoId: string;
    serieId: string;
    numero: string;
    fechaEmision: Date;
    rucEmisor: string;
    transportista?: string;
    origen?: string;
    destino?: string;
    estadoDocumentoId?: string;
    observacion?: string;
    createdById: string;
    detalles: Array<{
      productoId: string;
      codigoProducto: string;
      descripcion: string;
      cantidad: Prisma.Decimal;
      orden: number;
    }>;
  }) {
    return this.prisma.gre.create({
      data: {
        empresaId: data.empresaId,
        tipoDocumentoId: data.tipoDocumentoId,
        serieId: data.serieId,
        numero: data.numero.trim(),
        fechaEmision: data.fechaEmision,
        rucEmisor: data.rucEmisor,
        transportista: data.transportista?.trim(),
        origen: data.origen?.trim(),
        destino: data.destino?.trim(),
        estado: 'PENDIENTE',
        estadoDocumentoId: data.estadoDocumentoId,
        observacion: data.observacion?.trim(),
        createdById: data.createdById,
        detalles: {
          create: data.detalles,
        },
      },
      include: greFullInclude,
    });
  }

  updateGre(
    id: string,
    data: Partial<{
      serieId: string;
      numero: string;
      fechaEmision: Date;
      rucEmisor: string;
      transportista: string | null;
      origen: string | null;
      destino: string | null;
      estado: Prisma.GreUpdateInput['estado'];
      estadoDocumentoId: string | null;
      observacion: string | null;
    }>,
  ) {
    return this.prisma.gre.update({
      where: { id },
      data: {
        ...(data.serieId !== undefined ? { serieId: data.serieId } : {}),
        ...(data.numero !== undefined ? { numero: data.numero.trim() } : {}),
        ...(data.fechaEmision !== undefined ? { fechaEmision: data.fechaEmision } : {}),
        ...(data.rucEmisor !== undefined ? { rucEmisor: data.rucEmisor } : {}),
        ...(data.transportista !== undefined ? { transportista: data.transportista } : {}),
        ...(data.origen !== undefined ? { origen: data.origen } : {}),
        ...(data.destino !== undefined ? { destino: data.destino } : {}),
        ...(data.estado !== undefined ? { estado: data.estado } : {}),
        ...(data.estadoDocumentoId !== undefined
          ? { estadoDocumentoId: data.estadoDocumentoId }
          : {}),
        ...(data.observacion !== undefined ? { observacion: data.observacion } : {}),
      },
      include: greFullInclude,
    });
  }

  replaceDetalles(
    greId: string,
    detalles: Array<{
      productoId: string;
      codigoProducto: string;
      descripcion: string;
      cantidad: Prisma.Decimal;
      orden: number;
    }>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.detalleGre.deleteMany({ where: { greId } });
      await tx.detalleGre.createMany({
        data: detalles.map((d) => ({ greId, ...d })),
      });

      return tx.gre.findUniqueOrThrow({
        where: { id: greId },
        include: greFullInclude,
      });
    });
  }

  softDelete(id: string) {
    return this.prisma.gre.update({
      where: { id },
      data: {
        activo: false,
        deletedAt: new Date(),
      },
    });
  }

  createArchivo(data: {
    greId: string;
    tipo: 'XML' | 'PDF';
    nombreOriginal: string;
    nombreAlmacenado: string;
    ruta: string;
    mimeType: string;
    tamanoBytes: bigint;
    hashSha256: string;
    usuarioId: string;
  }) {
    return this.prisma.archivoGre.create({
      data: {
        greId: data.greId,
        tipo: data.tipo,
        nombreOriginal: data.nombreOriginal,
        nombreAlmacenado: data.nombreAlmacenado,
        ruta: data.ruta,
        mimeType: data.mimeType,
        tamanoBytes: data.tamanoBytes,
        hashSha256: data.hashSha256,
        procesado: false,
        usuarioId: data.usuarioId,
      },
      select: {
        id: true,
        tipo: true,
        nombreOriginal: true,
        mimeType: true,
        tamanoBytes: true,
        createdAt: true,
      },
    });
  }

  private buildWhere(
    empresaId: string,
    options: {
      numero?: string;
      serie?: string;
      estado?: string;
      fechaDesde?: string;
      fechaHasta?: string;
      empresa?: string;
    },
  ): Prisma.GreWhereInput {
    const fechaFilter: Prisma.DateTimeFilter | undefined =
      options.fechaDesde || options.fechaHasta
        ? {
            ...(options.fechaDesde ? { gte: new Date(options.fechaDesde) } : {}),
            ...(options.fechaHasta ? { lte: new Date(options.fechaHasta) } : {}),
          }
        : undefined;

    return {
      empresaId,
      deletedAt: null,
      ...(options.numero
        ? { numero: { contains: options.numero.trim(), mode: 'insensitive' } }
        : {}),
      ...(options.serie
        ? {
            serie: {
              codigo: { equals: options.serie.trim(), mode: 'insensitive' },
            },
          }
        : {}),
      ...(options.estado ? { estado: options.estado as Prisma.EnumGreEstadoFilter['equals'] } : {}),
      ...(fechaFilter ? { fechaEmision: fechaFilter } : {}),
      ...(options.empresa
        ? {
            rucEmisor: { contains: options.empresa.trim(), mode: 'insensitive' },
          }
        : {}),
    };
  }
}
