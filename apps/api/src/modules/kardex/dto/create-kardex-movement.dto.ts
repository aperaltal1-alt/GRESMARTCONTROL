import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { KARDEX_CONSTANTS } from '../constants';

export class CreateKardexMovementDto {
  @ApiProperty({ example: 'uuid-producto', description: 'ID del producto' })
  @IsUUID('4', { message: 'El productoId debe ser un UUID válido' })
  productoId!: string;

  @ApiProperty({ example: '2026-07-07', description: 'Fecha del movimiento (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  fecha!: string;

  @ApiProperty({
    enum: KARDEX_CONSTANTS.MOVEMENT_TYPES,
    example: 'ENTRADA',
    description: 'ENTRADA suma, SALIDA resta, AJUSTE establece stock resultante',
  })
  @IsEnum(KARDEX_CONSTANTS.MOVEMENT_TYPES, {
    message: 'El tipo debe ser ENTRADA, SALIDA o AJUSTE',
  })
  tipo!: (typeof KARDEX_CONSTANTS.MOVEMENT_TYPES)[number];

  @ApiProperty({
    example: 10,
    minimum: 0.0001,
    description: 'Cantidad del movimiento. En AJUSTE representa el stock resultante.',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'La cantidad debe ser numérica' })
  @Min(0.0001, { message: 'La cantidad debe ser mayor que cero' })
  cantidad!: number;

  @ApiPropertyOptional({ example: 'Recepción manual de mercadería' })
  @IsOptional()
  @IsString()
  observacion?: string;
}
