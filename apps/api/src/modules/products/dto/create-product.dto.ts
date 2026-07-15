import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PRODUCT_CONSTANTS } from '../constants';

export class CreateProductDto {
  @ApiProperty({ example: 'HARINA-001', description: 'Código único del producto' })
  @IsString({ message: 'El código debe ser texto' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @MaxLength(PRODUCT_CONSTANTS.MAX_CODIGO_LENGTH)
  codigo!: string;

  @ApiProperty({ example: 'Harina de Trigo 1kg' })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(PRODUCT_CONSTANTS.MAX_NOMBRE_LENGTH)
  nombre!: string;

  @ApiProperty({ example: 'Abarrotes', description: 'Categoría en texto simple' })
  @IsString({ message: 'La categoría debe ser texto' })
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoria!: string;

  @ApiProperty({ example: 'UND', description: 'Unidad de medida (UND, KG, LT, etc.)' })
  @IsString({ message: 'La unidad debe ser texto' })
  @IsNotEmpty({ message: 'La unidad es obligatoria' })
  unidad!: string;

  @ApiProperty({ example: 100, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'El stock actual debe ser numérico' })
  @Min(0, { message: 'El stock actual no puede ser negativo' })
  stockActual!: number;

  @ApiProperty({ example: 20, minimum: 0 })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'El stock mínimo debe ser numérico' })
  @Min(0, { message: 'El stock mínimo no puede ser negativo' })
  stockMinimo!: number;
}
