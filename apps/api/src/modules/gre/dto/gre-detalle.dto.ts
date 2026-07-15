import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class GreDetalleDto {
  @ApiProperty({ example: 'uuid-producto', description: 'ID del producto registrado' })
  @IsUUID('4', { message: 'El productoId debe ser un UUID válido' })
  productoId!: string;

  @ApiProperty({ example: 10, minimum: 0.0001, description: 'Cantidad mayor a cero' })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'La cantidad debe ser numérica' })
  @Min(0.0001, { message: 'La cantidad debe ser mayor que cero' })
  cantidad!: number;
}
