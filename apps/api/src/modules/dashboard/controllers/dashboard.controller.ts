import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiStandardResponse } from '../../../common/decorators/api-standard-response.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import {
  CriticalProductItemDto,
  DashboardChartsDto,
  DashboardChartsQueryDto,
  DashboardKpisDto,
  DashboardRecentQueryDto,
  DashboardSummaryDto,
  RecentAlertItemDto,
  RecentGreItemDto,
  RecentIncidentItemDto,
} from '../dto';
import { DashboardService } from '../services';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@Controller('dashboard')
@Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Resumen ejecutivo del dashboard',
    description: 'KPIs principales y timestamp de generación.',
  })
  @ApiStandardResponse(DashboardSummaryDto, 'Resumen ejecutivo')
  getSummary(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getSummary(user.empresaId);
  }

  @Get('kpis')
  @ApiOperation({ summary: 'Indicadores KPI del negocio' })
  @ApiStandardResponse(DashboardKpisDto, 'KPIs del dashboard')
  getKpis(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getKpis(user.empresaId);
  }

  @Get('charts')
  @ApiOperation({
    summary: 'Datos para gráficos',
    description: 'Series temporales y productos con stock bajo en formato JSON.',
  })
  @ApiStandardResponse(DashboardChartsDto, 'Datos de gráficos')
  getCharts(@CurrentUser() user: AuthenticatedUser, @Query() query: DashboardChartsQueryDto) {
    return this.dashboardService.getCharts(user.empresaId, query);
  }

  @Get('recent-gre')
  @ApiOperation({ summary: 'Últimas GRE registradas' })
  @ApiStandardResponse(RecentGreItemDto, 'Últimas GRE registradas')
  getRecentGre(@CurrentUser() user: AuthenticatedUser, @Query() query: DashboardRecentQueryDto) {
    return this.dashboardService.getRecentGre(user.empresaId, query);
  }

  @Get('recent-incidents')
  @ApiOperation({ summary: 'Últimas incidencias' })
  @ApiStandardResponse(RecentIncidentItemDto, 'Últimas incidencias')
  getRecentIncidents(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: DashboardRecentQueryDto,
  ) {
    return this.dashboardService.getRecentIncidents(user.empresaId, query);
  }

  @Get('recent-alerts')
  @ApiOperation({ summary: 'Últimas alertas activas' })
  @ApiStandardResponse(RecentAlertItemDto, 'Últimas alertas activas')
  getRecentAlerts(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: DashboardRecentQueryDto,
  ) {
    return this.dashboardService.getRecentAlerts(user.empresaId, query);
  }

  @Get('critical-products')
  @ApiOperation({
    summary: 'Productos críticos',
    description: 'Productos con stock bajo o sin stock.',
  })
  @ApiStandardResponse(CriticalProductItemDto, 'Productos críticos')
  getCriticalProducts(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getCriticalProducts(user.empresaId);
  }
}
