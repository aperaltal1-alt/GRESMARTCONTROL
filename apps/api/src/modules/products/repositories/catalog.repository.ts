import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class CatalogRepository extends BaseRepository {
  findCategoriaByText(empresaId: string, categoria: string) {
    const value = categoria.trim();
    return this.prisma.categoria.findFirst({
      where: {
        empresaId,
        deletedAt: null,
        OR: [
          { codigo: { equals: value, mode: 'insensitive' } },
          { nombre: { equals: value, mode: 'insensitive' } },
          { nombre: { contains: value, mode: 'insensitive' } },
        ],
      },
    });
  }

  createCategoria(empresaId: string, categoria: string) {
    const nombre = categoria.trim();
    const codigo = nombre
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50) || 'GENERAL';

    return this.prisma.categoria.create({
      data: {
        empresaId,
        codigo,
        nombre,
      },
    });
  }

  findUnidadByCodigo(empresaId: string, unidad: string) {
    const codigo = unidad.trim().toUpperCase();
    return this.prisma.unidadMedida.findFirst({
      where: {
        codigo: { equals: codigo, mode: 'insensitive' },
        OR: [{ empresaId: null }, { empresaId }],
        activo: true,
      },
    });
  }

  createUnidad(empresaId: string, unidad: string) {
    const codigo = unidad.trim().toUpperCase().slice(0, 20);
    return this.prisma.unidadMedida.create({
      data: {
        empresaId,
        codigo,
        nombre: codigo,
        simbolo: codigo.toLowerCase(),
      },
    });
  }
}
