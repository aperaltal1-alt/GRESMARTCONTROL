import { ApiProperty } from '@nestjs/swagger';

export class RiesgoTributarioDto {
  @ApiProperty({ example: 33.33 })
  porcentaje!: number;

  @ApiProperty({ enum: ['BAJO', 'MEDIO', 'ALTO'] })
  nivel!: string;
}

export class DashboardKpisDto {
  @ApiProperty({ example: 3 })
  totalGre!: number;

  @ApiProperty({ example: 1 })
  greConciliadas!: number;

  @ApiProperty({ example: 1 })
  greConDiferencias!: number;

  @ApiProperty({ example: 10 })
  totalProductos!: number;

  @ApiProperty({ example: 1857 })
  stockTotalDisponible!: number;

  @ApiProperty({ example: 2 })
  productosStockBajo!: number;

  @ApiProperty({ example: 2 })
  incidenciasPendientes!: number;

  @ApiProperty({ example: 5 })
  alertasActivas!: number;

  @ApiProperty({ example: 33.33, description: '(GRE conciliadas / Total GRE) × 100' })
  nivelConciliacion!: number;

  @ApiProperty({ type: RiesgoTributarioDto })
  riesgoTributario!: RiesgoTributarioDto;
}

export class DashboardSummaryDto extends DashboardKpisDto {
  @ApiProperty()
  generatedAt!: string;
}

export class ChartPointDto {
  @ApiProperty({ example: '2026-07-07' })
  fecha!: string;

  @ApiProperty({ example: 2 })
  total!: number;
}

export class LowStockChartItemDto {
  @ApiProperty()
  productoId!: string;

  @ApiProperty()
  codigo!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  stockActual!: number;

  @ApiProperty()
  stockMinimo!: number;
}

export class DashboardChartsDto {
  @ApiProperty({ type: [ChartPointDto] })
  grePorDia!: ChartPointDto[];

  @ApiProperty({ type: [ChartPointDto] })
  movimientosKardexPorDia!: ChartPointDto[];

  @ApiProperty({ type: [ChartPointDto] })
  diferenciasPorDia!: ChartPointDto[];

  @ApiProperty({ type: [LowStockChartItemDto] })
  productosStockBajo!: LowStockChartItemDto[];
}

export class RecentGreItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  numero!: string;

  @ApiProperty()
  serie!: string;

  @ApiProperty()
  fecha!: string;

  @ApiProperty()
  estado!: string;

  @ApiProperty({ nullable: true })
  transportista!: string | null;

  @ApiProperty()
  totalProductos!: number;

  @ApiProperty()
  createdAt!: string;
}

export class RecentIncidentItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  greId!: string;

  @ApiProperty()
  greNumero!: string;

  @ApiProperty()
  greSerie!: string;

  @ApiProperty()
  codigoProducto!: string;

  @ApiProperty()
  nombreProducto!: string;

  @ApiProperty()
  tipo!: string;

  @ApiProperty()
  diferencia!: number;

  @ApiProperty()
  estado!: string;

  @ApiProperty()
  prioridad!: string;

  @ApiProperty()
  createdAt!: string;
}

export class RecentAlertItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tipo!: string;

  @ApiProperty()
  nivel!: string;

  @ApiProperty()
  mensaje!: string;

  @ApiProperty({ nullable: true })
  codigoProducto!: string | null;

  @ApiProperty({ nullable: true })
  greNumero!: string | null;

  @ApiProperty()
  leida!: boolean;

  @ApiProperty()
  createdAt!: string;
}

export class CriticalProductItemDto {
  @ApiProperty()
  productoId!: string;

  @ApiProperty()
  codigo!: string;

  @ApiProperty()
  nombre!: string;

  @ApiProperty()
  stockActual!: number;

  @ApiProperty()
  stockMinimo!: number;

  @ApiProperty({ enum: ['BAJO', 'SIN STOCK'] })
  estado!: string;
}
