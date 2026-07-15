import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { GRE_CONSTANTS } from '../constants';

export class ListGreQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: '00000001', description: 'Filtrar por número' })
  @IsOptional()
  @IsString()
  @MaxLength(GRE_CONSTANTS.MAX_NUMERO_LENGTH)
  numero?: string;

  @ApiPropertyOptional({ example: 'T001', description: 'Filtrar por serie' })
  @IsOptional()
  @IsString()
  @MaxLength(GRE_CONSTANTS.MAX_SERIE_LENGTH)
  serie?: string;

  @ApiPropertyOptional({
    enum: GRE_CONSTANTS.ALLOWED_ESTADOS,
    example: 'PENDIENTE',
    description: 'Filtrar por estado',
  })
  @IsOptional()
  @IsEnum(GRE_CONSTANTS.ALLOWED_ESTADOS)
  estado?: (typeof GRE_CONSTANTS.ALLOWED_ESTADOS)[number];

  @ApiPropertyOptional({ example: '2026-07-01', description: 'Fecha desde (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiPropertyOptional({ example: '2026-07-31', description: 'Fecha hasta (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

  @ApiPropertyOptional({
    example: '20123456789',
    description: 'Filtrar por RUC emisor',
  })
  @IsOptional()
  @IsString()
  empresa?: string;
}
