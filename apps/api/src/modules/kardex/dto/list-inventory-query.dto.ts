import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { KARDEX_CONSTANTS } from '../constants';

export class ListInventoryQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: KARDEX_CONSTANTS.INVENTORY_STATES,
    example: 'BAJO',
    description: 'Filtrar por estado de stock',
  })
  @IsOptional()
  @IsEnum(KARDEX_CONSTANTS.INVENTORY_STATES)
  estado?: (typeof KARDEX_CONSTANTS.INVENTORY_STATES)[number];
}
