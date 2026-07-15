import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BaseRepository } from '../../../database/base.repository';

@Injectable()
export class DashboardRepository extends BaseRepository {
  countGre(empresaId: string, estado?: Prisma.EnumGreEstadoFilter['equals']) {
    return this.prisma.gre.count({
      where: {
        empresaId,
        deletedAt: null,
        ...(estado ? { estado } : {}),
      },
    });
  }

  countProductos(empresaId: string) {
    return this.prisma.producto.count({
      where: { empresaId, deletedAt: null, activo: true },
    });
  }

  sumStockTotal(empresaId: string) {
    return this.prisma.kardex.aggregate({
      where: { empresaId },
      _sum: { saldoActual: true },
    });
  }

  countIncidenciasPendientes(empresaId: string) {
    return this.prisma.incidencia.count({
      where: { empresaId, estado: 'PENDIENTE' },
    });
  }

  countAlertasActivas(empresaId: string) {
    return this.prisma.alerta.count({
      where: { empresaId, activa: true },
    });
  }

  findProductsWithStock(empresaId: string) {
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

  findGreByDateRange(empresaId: string, from: Date) {
    return this.prisma.gre.findMany({
      where: {
        empresaId,
        deletedAt: null,
        fechaEmision: { gte: from },
      },
      select: { fechaEmision: true },
    });
  }

  findMovimientosByDateRange(empresaId: string, from: Date) {
    return this.prisma.movimientoKardex.findMany({
      where: {
        empresaId,
        createdAt: { gte: from },
      },
      select: { createdAt: true },
    });
  }

  findDiferenciasByDateRange(empresaId: string, from: Date) {
    return this.prisma.historialConciliacion.findMany({
      where: {
        resultado: 'DIFERENCIA',
        createdAt: { gte: from },
        conciliacion: { empresaId },
      },
      select: { createdAt: true },
    });
  }

  findRecentGre(empresaId: string, limit: number) {
    return this.prisma.gre.findMany({
      where: { empresaId, deletedAt: null },
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        serie: { select: { codigo: true } },
        _count: { select: { detalles: true } },
      },
    });
  }

  findRecentIncidents(empresaId: string, limit: number) {
    return this.prisma.incidencia.findMany({
      where: { empresaId },
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        producto: { select: { codigo: true, nombre: true } },
        gre: { select: { numero: true, serie: { select: { codigo: true } } } },
      },
    });
  }

  findRecentAlerts(empresaId: string, limit: number) {
    return this.prisma.alerta.findMany({
      where: { empresaId, activa: true },
      take: limit,
      orderBy: [{ createdAt: 'desc' }],
      include: {
        producto: { select: { codigo: true } },
        gre: { select: { numero: true, serie: { select: { codigo: true } } } },
      },
    });
  }
}
