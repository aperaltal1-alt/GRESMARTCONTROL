import { Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
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
  ListReconciliationQueryDto,
  PaginatedReconciliationsDto,
  ReconciliationDetailDto,
  RunReconciliationResponseDto,
} from '../dto';
import { ReconciliationService } from '../services';

@ApiTags('Reconciliation')
@ApiBearerAuth('access-token')
@Controller('reconciliation')
export class ReconciliationController {
  constructor(private readonly reconciliationService: ReconciliationService) {}

  @Get()
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({ summary: 'Listar conciliaciones' })
  @ApiStandardResponse(PaginatedReconciliationsDto, 'Listado de conciliaciones')
  listReconciliations(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListReconciliationQueryDto,
  ) {
    return this.reconciliationService.listReconciliations(user.empresaId, query);
  }

  @Get(':id')
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({ summary: 'Detalle de conciliación' })
  @ApiParam({ name: 'id', description: 'UUID de la conciliación' })
  @ApiStandardResponse(ReconciliationDetailDto, 'Detalle completo de conciliación')
  @ApiResponse({ status: 404, description: 'Conciliación no encontrada' })
  getReconciliationById(
    @Param('id', ParseUuidPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reconciliationService.getReconciliationById(id, user.empresaId);
  }

  @Post(':greId/run')
  @Roles('ADMIN', 'SUPERVISOR')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Ejecutar conciliación',
    description:
      'Compara GRE vs Kardex vs Inventario por producto. Crea historial, incidencias y alertas en una transacción.',
  })
  @ApiParam({ name: 'greId', description: 'UUID de la GRE a conciliar' })
  @ApiStandardResponse(RunReconciliationResponseDto, 'Conciliación ejecutada')
  @ApiResponse({ status: 404, description: 'GRE no encontrada' })
  @ApiResponse({ status: 400, description: 'GRE sin productos' })
  runReconciliation(
    @Param('greId', ParseUuidPipe) greId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.reconciliationService.runReconciliation(greId, user);
  }
}
