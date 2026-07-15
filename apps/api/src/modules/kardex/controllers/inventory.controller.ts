import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { ApiStandardResponse } from '../../../common/decorators/api-standard-response.decorator';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { ListInventoryQueryDto, PaginatedInventoryDto } from '../dto';
import { InventoryService } from '../services';

@ApiTags('Inventory')
@ApiBearerAuth('access-token')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles('ADMIN', 'SUPERVISOR', 'CONSULTA')
  @ApiOperation({
    summary: 'Consultar inventario',
    description:
      'Devuelve stock actual, stock mínimo y estado (NORMAL, BAJO, SIN STOCK) por producto.',
  })
  @ApiStandardResponse(PaginatedInventoryDto, 'Inventario de productos')
  listInventory(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListInventoryQueryDto,
  ) {
    return this.inventoryService.listInventory(user.empresaId, query);
  }
}
