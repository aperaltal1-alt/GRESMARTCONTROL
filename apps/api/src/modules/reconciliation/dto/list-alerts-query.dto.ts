import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ListAlertsQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    default: true,
    description: 'Filtrar solo alertas activas (default: true)',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  activa?: boolean = true;
}
