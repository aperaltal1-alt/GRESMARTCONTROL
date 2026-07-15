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
  ListIncidentsQueryDto,
  PaginatedIncidentsDto,
  ResolveIncidentResponseDto,
} from '../dto';
import { IncidentsService } from '../services';

@ApiTags('Incidents')
@ApiBearerAuth('access-token')
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({ summary: 'Listar incidencias de conciliación' })
  @ApiStandardResponse(PaginatedIncidentsDto, 'Listado de incidencias')
  listIncidents(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListIncidentsQueryDto,
  ) {
    return this.incidentsService.listIncidents(user.empresaId, query);
  }

  @Patch(':id/resolve')
  @Roles('ADMIN', 'SUPERVISOR')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar incidencia como resuelta' })
  @ApiParam({ name: 'id', description: 'UUID de la incidencia' })
  @ApiStandardResponse(ResolveIncidentResponseDto, 'Incidencia resuelta')
  @ApiResponse({ status: 404, description: 'Incidencia no encontrada' })
  resolveIncident(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.incidentsService.resolveIncident(id, user);
  }
}
