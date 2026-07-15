import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { KARDEX_CONSTANTS } from '../constants';

export class ListKardexQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'uuid-producto', description: 'Filtrar por producto' })
  @IsOptional()
  @IsUUID('4')
  producto?: string;

  @ApiPropertyOptional({
    enum: KARDEX_CONSTANTS.MOVEMENT_TYPES,
    example: 'ENTRADA',
    description: 'Filtrar por tipo de movimiento',
  })
  @IsOptional()
  @IsEnum(KARDEX_CONSTANTS.MOVEMENT_TYPES)
  tipo?: (typeof KARDEX_CONSTANTS.MOVEMENT_TYPES)[number];

  @ApiPropertyOptional({ example: '2026-07-01', description: 'Fecha desde (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiPropertyOptional({ example: '2026-07-31', description: 'Fecha hasta (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
