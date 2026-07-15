import { Injectable } from '@nestjs/common';
import {
  DASHBOARD_CONSTANTS,
  RiesgoTributarioNivel,
} from '../constants';
import { DashboardChartsQueryDto, DashboardRecentQueryDto } from '../dto';
import {
  ChartPoint,
  CriticalProductItem,
  DashboardCharts,
  DashboardKpis,
  DashboardSummary,
  LowStockChartItem,
  RecentAlertItem,
  RecentGreItem,
  RecentIncidentItem,
} from '../interfaces';
import { DashboardRepository } from '../repositories';

@Injectable()
export class DashboardService {
  constructor(private readonly dashboardRepo: DashboardRepository) {}

  async getSummary(empresaId: string): Promise<DashboardSummary> {
    const kpis = await this.getKpis(empresaId);
    return {
      ...kpis,
      generatedAt: new Date().toISOString(),
    };
  }

  async getKpis(empresaId: string): Promise<DashboardKpis> {
    const [
      totalGre,
      greConciliadas,
      greConDiferencias,
      totalProductos,
      stockAggregate,
      incidenciasPendientes,
      alertasActivas,
      products,
    ] = await Promise.all([
      this.dashboardRepo.countGre(empresaId),
      this.dashboardRepo.countGre(empresaId, 'CONCILIADA'),
      this.dashboardRepo.countGre(empresaId, 'CON_DIFERENCIA'),
      this.dashboardRepo.countProductos(empresaId),
      this.dashboardRepo.sumStockTotal(empresaId),
      this.dashboardRepo.countIncidenciasPendientes(empresaId),
      this.dashboardRepo.countAlertasActivas(empresaId),
      this.dashboardRepo.findProductsWithStock(empresaId),
    ]);

    const stockItems = products.map((p) => this.toStockItem(p));
    const productosStockBajo = stockItems.filter((p) => p.estado === 'BAJO').length;
    const nivelConciliacion = this.calcPercentage(greConciliadas, totalGre);
    const riesgoTributario = this.calcRiesgoTributario(greConDiferencias, totalGre);

    return {
      totalGre,
      greConciliadas,
      greConDiferencias,
      totalProductos,
      stockTotalDisponible: Number(stockAggregate._sum.saldoActual ?? 0),
      productosStockBajo,
      incidenciasPendientes,
      alertasActivas,
      nivelConciliacion,
      riesgoTributario,
    };
  }

  async getCharts(empresaId: string, query: DashboardChartsQueryDto): Promise<DashboardCharts> {
    const dias = query.dias ?? DASHBOARD_CONSTANTS.DEFAULT_DAYS;
    const from = this.daysAgo(dias);
    const dateKeys = this.buildDateRange(dias);

    const [gres, movimientos, diferencias, products] = await Promise.all([
      this.dashboardRepo.findGreByDateRange(empresaId, from),
      this.dashboardRepo.findMovimientosByDateRange(empresaId, from),
      this.dashboardRepo.findDiferenciasByDateRange(empresaId, from),
      this.dashboardRepo.findProductsWithStock(empresaId),
    ]);

    const productosStockBajo = products
      .map((p) => this.toStockItem(p))
      .filter((p) => p.estado === 'BAJO')
      .map(
        (p): LowStockChartItem => ({
          productoId: p.productoId,
          codigo: p.codigo,
          nombre: p.nombre,
          stockActual: p.stockActual,
          stockMinimo: p.stockMinimo,
        }),
      );

    return {
      grePorDia: this.groupByDate(
        gres.map((g) => g.fechaEmision),
        dateKeys,
      ),
      movimientosKardexPorDia: this.groupByDate(
        movimientos.map((m) => m.createdAt),
        dateKeys,
      ),
      diferenciasPorDia: this.groupByDate(
        diferencias.map((d) => d.createdAt),
        dateKeys,
      ),
      productosStockBajo,
    };
  }

  async getRecentGre(
    empresaId: string,
    query: DashboardRecentQueryDto,
  ): Promise<RecentGreItem[]> {
    const limit = query.limit ?? DASHBOARD_CONSTANTS.DEFAULT_RECENT_LIMIT;
    const items = await this.dashboardRepo.findRecentGre(empresaId, limit);

    return items.map((gre) => ({
      id: gre.id,
      numero: gre.numero,
      serie: gre.serie.codigo,
      fecha: gre.fechaEmision.toISOString().slice(0, 10),
      estado: gre.estado,
      transportista: gre.transportista,
      totalProductos: gre._count.detalles,
      createdAt: gre.createdAt.toISOString(),
    }));
  }

  async getRecentIncidents(
    empresaId: string,
    query: DashboardRecentQueryDto,
  ): Promise<RecentIncidentItem[]> {
    const limit = query.limit ?? DASHBOARD_CONSTANTS.DEFAULT_RECENT_LIMIT;
    const items = await this.dashboardRepo.findRecentIncidents(empresaId, limit);

    return items.map((inc) => ({
      id: inc.id,
      greId: inc.greId,
      greNumero: inc.gre.numero,
      greSerie: inc.gre.serie.codigo,
      codigoProducto: inc.producto.codigo,
      nombreProducto: inc.producto.nombre,
      tipo: inc.tipo,
      diferencia: Number(inc.diferencia),
      estado: inc.estado,
      prioridad: inc.prioridad,
      createdAt: inc.createdAt.toISOString(),
    }));
  }

  async getRecentAlerts(
    empresaId: string,
    query: DashboardRecentQueryDto,
  ): Promise<RecentAlertItem[]> {
    const limit = query.limit ?? DASHBOARD_CONSTANTS.DEFAULT_RECENT_LIMIT;
    const items = await this.dashboardRepo.findRecentAlerts(empresaId, limit);

    return items.map((alerta) => ({
      id: alerta.id,
      tipo: alerta.tipo,
      nivel: alerta.nivel,
      mensaje: alerta.mensaje,
      codigoProducto: alerta.producto?.codigo ?? null,
      greNumero: alerta.gre ? `${alerta.gre.serie.codigo}-${alerta.gre.numero}` : null,
      leida: alerta.leida,
      createdAt: alerta.createdAt.toISOString(),
    }));
  }

  async getCriticalProducts(empresaId: string): Promise<CriticalProductItem[]> {
    const products = await this.dashboardRepo.findProductsWithStock(empresaId);

    return products
      .map((p) => this.toStockItem(p))
      .filter((p): p is CriticalProductItem & { estado: 'BAJO' | 'SIN STOCK' } =>
        p.estado === 'BAJO' || p.estado === 'SIN STOCK',
      )
      .map(({ productoId, codigo, nombre, stockActual, stockMinimo, estado }) => ({
        productoId,
        codigo,
        nombre,
        stockActual,
        stockMinimo,
        estado,
      }))
      .sort((a, b) => a.stockActual - b.stockActual);
  }

  private toStockItem(producto: {
    id: string;
    codigo: string;
    nombre: string;
    stockMinimo: { toString(): string } | number | string;
    kardex: { saldoActual: { toString(): string } | number | string } | null;
  }) {
    const stockActual = Number(producto.kardex?.saldoActual ?? 0);
    const stockMinimo = Number(producto.stockMinimo);
    const estado: 'BAJO' | 'SIN STOCK' | 'NORMAL' =
      stockActual <= 0 ? 'SIN STOCK' : stockActual <= stockMinimo ? 'BAJO' : 'NORMAL';

    return {
      productoId: producto.id,
      codigo: producto.codigo,
      nombre: producto.nombre,
      stockActual,
      stockMinimo,
      estado,
    };
  }

  private calcPercentage(part: number, total: number): number {
    if (total === 0) return 0;
    return this.round2((part / total) * 100);
  }

  private calcRiesgoTributario(
    greConDiferencias: number,
    totalGre: number,
  ): { porcentaje: number; nivel: RiesgoTributarioNivel } {
    const porcentaje = this.calcPercentage(greConDiferencias, totalGre);

    if (porcentaje <= DASHBOARD_CONSTANTS.RIESGO_BAJO_MAX) {
      return { porcentaje, nivel: 'BAJO' };
    }
    if (porcentaje <= DASHBOARD_CONSTANTS.RIESGO_MEDIO_MAX) {
      return { porcentaje, nivel: 'MEDIO' };
    }
    return { porcentaje, nivel: 'ALTO' };
  }

  private daysAgo(days: number): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (days - 1));
    return date;
  }

  private buildDateRange(days: number): string[] {
    const keys: string[] = [];
    const cursor = this.daysAgo(days);

    for (let i = 0; i < days; i++) {
      const date = new Date(cursor);
      date.setDate(cursor.getDate() + i);
      keys.push(date.toISOString().slice(0, 10));
    }

    return keys;
  }

  private groupByDate(dates: Date[], dateKeys: string[]): ChartPoint[] {
    const counts = new Map<string, number>(dateKeys.map((key) => [key, 0]));

    for (const date of dates) {
      const key = date.toISOString().slice(0, 10);
      if (counts.has(key)) {
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }

    return dateKeys.map((fecha) => ({
      fecha,
      total: counts.get(fecha) ?? 0,
    }));
  }

  private round2(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
