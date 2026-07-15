import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { ConciliacionEstado } from '@prisma/client';

const ESTADOS: ConciliacionEstado[] = [
  'EN_PROCESO',
  'COMPLETADA',
  'CON_DIFERENCIAS',
  'ERROR',
];

export class ListReconciliationQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'uuid-gre' })
  @IsOptional()
  @IsUUID('4')
  greId?: string;

  @ApiPropertyOptional({ enum: ESTADOS })
  @IsOptional()
  @IsEnum(ESTADOS)
  estado?: ConciliacionEstado;
}
