import { Controller, Get, HttpCode, HttpStatus, Param, Patch, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiStandardResponse } from '../../../common/decorators/api-standard-response.decorator';
import { ParseUuidPipe } from '../../../common/pipes/parse-uuid.pipe';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import {
  ListAlertsQueryDto,
  MarkAlertReadResponseDto,
  PaginatedAlertsDto,
} from '../dto';
import { AlertsService } from '../services';

@ApiTags('Alerts')
@ApiBearerAuth('access-token')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({ summary: 'Listar alertas activas' })
  @ApiStandardResponse(PaginatedAlertsDto, 'Listado de alertas')
  listAlerts(@CurrentUser() user: AuthenticatedUser, @Query() query: ListAlertsQueryDto) {
    return this.alertsService.listAlerts(user.empresaId, query);
  }

  @Patch(':id/read')
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar alerta como leída' })
  @ApiParam({ name: 'id', description: 'UUID de la alerta' })
  @ApiStandardResponse(MarkAlertReadResponseDto, 'Alerta marcada como leída')
  @ApiResponse({ status: 404, description: 'Alerta no encontrada' })
  markAlertRead(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.alertsService.markAlertRead(id, user);
  }
}
