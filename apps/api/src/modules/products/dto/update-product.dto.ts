import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PRODUCT_CONSTANTS } from '../constants';

export class UpdateProductDto {
  @ApiPropertyOptional({ example: 'HARINA-001' })
  @IsOptional()
  @IsString()
  @MaxLength(PRODUCT_CONSTANTS.MAX_CODIGO_LENGTH)
  codigo?: string;

  @ApiPropertyOptional({ example: 'Harina de Trigo Premium 1kg' })
  @IsOptional()
  @IsString()
  @MaxLength(PRODUCT_CONSTANTS.MAX_NOMBRE_LENGTH)
  nombre?: string;

  @ApiPropertyOptional({ example: 'Abarrotes' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({ example: 'KG' })
  @IsOptional()
  @IsString()
  unidad?: string;

  @ApiPropertyOptional({ example: 150, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0, { message: 'El stock actual no puede ser negativo' })
  stockActual?: number;

  @ApiPropertyOptional({ example: 25, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0, { message: 'El stock mínimo no puede ser negativo' })
  stockMinimo?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
