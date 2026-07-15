import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiStandardResponse } from '../../../common/decorators/api-standard-response.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import {
  CreateKardexMovementDto,
  KardexMovementResponseDto,
  ListKardexQueryDto,
  PaginatedKardexMovementsDto,
} from '../dto';
import { KardexService } from '../services';

@ApiTags('Kardex')
@ApiBearerAuth('access-token')
@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Get()
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({
    summary: 'Historial de movimientos Kardex',
    description: 'Listado paginado con filtros por producto, tipo y rango de fechas.',
  })
  @ApiStandardResponse(PaginatedKardexMovementsDto, 'Historial de movimientos')
  listMovements(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListKardexQueryDto,
  ) {
    return this.kardexService.listMovements(user.empresaId, query);
  }

  @Post()
  @Roles('ADMIN', 'SUPERVISOR')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar movimiento Kardex',
    description:
      'Registra ENTRADA, SALIDA o AJUSTE. Actualiza automáticamente el stock actual del producto.',
  })
  @ApiStandardResponse(KardexMovementResponseDto, 'Movimiento registrado')
  @ApiResponse({ status: 404, description: 'Producto o kardex no encontrado' })
  @ApiResponse({ status: 409, description: 'Stock insuficiente para salida' })
  registerMovement(
    @Body() dto: CreateKardexMovementDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.kardexService.registerMovement(dto, user);
  }
}
