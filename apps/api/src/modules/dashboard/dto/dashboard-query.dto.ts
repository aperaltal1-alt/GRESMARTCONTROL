import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DASHBOARD_CONSTANTS } from '../constants';

export class DashboardChartsQueryDto {
  @ApiPropertyOptional({
    default: DASHBOARD_CONSTANTS.DEFAULT_DAYS,
    minimum: 7,
    maximum: DASHBOARD_CONSTANTS.MAX_DAYS,
    description: 'Días hacia atrás para series temporales',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(7)
  @Max(DASHBOARD_CONSTANTS.MAX_DAYS)
  dias?: number = DASHBOARD_CONSTANTS.DEFAULT_DAYS;
}

export class DashboardRecentQueryDto {
  @ApiPropertyOptional({
    default: DASHBOARD_CONSTANTS.DEFAULT_RECENT_LIMIT,
    minimum: 1,
    maximum: DASHBOARD_CONSTANTS.MAX_RECENT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(DASHBOARD_CONSTANTS.MAX_RECENT_LIMIT)
  limit?: number = DASHBOARD_CONSTANTS.DEFAULT_RECENT_LIMIT;
}
