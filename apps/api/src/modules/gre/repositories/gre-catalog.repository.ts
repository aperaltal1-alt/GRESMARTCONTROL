import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../database/base.repository';
import { GRE_CONSTANTS } from '../constants';

@Injectable()
export class GreCatalogRepository extends BaseRepository {
  findEmpresaById(id: string) {
    return this.prisma.empresa.findFirst({
      where: { id, deletedAt: null },
      select: {
        id: true,
        ruc: true,
        razonSocial: true,
        nombreComercial: true,
      },
    });
  }

  findProductoById(productoId: string, empresaId: string) {
    return this.prisma.producto.findFirst({
      where: { id: productoId, empresaId, deletedAt: null, activo: true },
      select: { id: true, codigo: true, nombre: true },
    });
  }

  findOrCreateTipoDocumentoGre(empresaId: string) {
    return this.prisma.tipoDocumento.upsert({
      where: {
        codigo_empresaId: {
          codigo: GRE_CONSTANTS.TIPO_DOCUMENTO_CODIGO,
          empresaId,
        },
      },
      update: {},
      create: {
        empresaId,
        codigo: GRE_CONSTANTS.TIPO_DOCUMENTO_CODIGO,
        nombre: 'Guía de Remisión Electrónica',
        codigoSunat: '09',
      },
    });
  }

  findSerieByCodigo(empresaId: string, codigo: string) {
    return this.prisma.serie.findFirst({
      where: {
        empresaId,
        codigo: { equals: codigo.trim(), mode: 'insensitive' },
        activo: true,
      },
    });
  }

  findOrCreateSerie(empresaId: string, tipoDocumentoId: string, codigo: string) {
    const normalized = codigo.trim().toUpperCase();

    return this.prisma.serie.upsert({
      where: {
        codigo_empresaId: { codigo: normalized, empresaId },
      },
      update: {},
      create: {
        empresaId,
        tipoDocumentoId,
        codigo: normalized,
      },
    });
  }

  findEstadoDocumento(empresaId: string, tipoDocumentoId: string, codigo: string) {
    return this.prisma.estadoDocumento.findFirst({
      where: {
        empresaId,
        tipoDocumentoId,
        codigo,
        activo: true,
      },
    });
  }
}
