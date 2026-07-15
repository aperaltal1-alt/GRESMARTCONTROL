import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { IncidenciaEstado } from '@prisma/client';

const ESTADOS: IncidenciaEstado[] = ['PENDIENTE', 'REVISADA', 'RESUELTA', 'DESCARTADA'];

export class ListIncidentsQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: 'uuid-gre' })
  @IsOptional()
  @IsUUID('4')
  greId?: string;

  @ApiPropertyOptional({ enum: ESTADOS })
  @IsOptional()
  @IsEnum(ESTADOS)
  estado?: IncidenciaEstado;
}
