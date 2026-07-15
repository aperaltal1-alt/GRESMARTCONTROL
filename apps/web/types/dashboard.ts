export type RiesgoTributarioNivel = 'BAJO' | 'MEDIO' | 'ALTO';

export interface RiesgoTributario {
  porcentaje: number;
  nivel: RiesgoTributarioNivel;
}

export interface DashboardKpis {
  totalGre: number;
  greConciliadas: number;
  greConDiferencias: number;
  totalProductos: number;
  stockTotalDisponible: number;
  productosStockBajo: number;
  incidenciasPendientes: number;
  alertasActivas: number;
  nivelConciliacion: number;
  riesgoTributario: RiesgoTributario;
}

export interface DashboardSummary extends DashboardKpis {
  generatedAt: string;
}

export interface ChartPoint {
  fecha: string;
  total: number;
}

export interface LowStockChartItem {
  productoId: string;
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
}

export interface DashboardCharts {
  grePorDia: ChartPoint[];
  movimientosKardexPorDia: ChartPoint[];
  diferenciasPorDia: ChartPoint[];
  productosStockBajo: LowStockChartItem[];
}

export interface RecentGreItem {
  id: string;
  numero: string;
  serie: string;
  fecha: string;
  estado: string;
  transportista: string | null;
  totalProductos: number;
  createdAt: string;
}

export interface RecentIncidentItem {
  id: string;
  greId: string;
  greNumero: string;
  greSerie: string;
  codigoProducto: string;
  nombreProducto: string;
  tipo: string;
  diferencia: number;
  estado: string;
  prioridad: string;
  createdAt: string;
}

export interface RecentAlertItem {
  id: string;
  tipo: string;
  nivel: string;
  mensaje: string;
  codigoProducto: string | null;
  greNumero: string | null;
  leida: boolean;
  createdAt: string;
}

export interface CriticalProductItem {
  productoId: string;
  codigo: string;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  estado: 'BAJO' | 'SIN STOCK';
}

export type TrendDirection = 'up' | 'down' | 'neutral';

export interface TrendInfo {
  value: number;
  direction: TrendDirection;
  label: string;
}
