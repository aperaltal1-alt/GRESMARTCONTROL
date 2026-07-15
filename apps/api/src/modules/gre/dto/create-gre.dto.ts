import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { GRE_CONSTANTS } from '../constants';
import { GreDetalleDto } from './gre-detalle.dto';

export class CreateGreDto {
  @ApiProperty({ example: '00000010', description: 'Número correlativo de la GRE' })
  @IsString({ message: 'El número debe ser texto' })
  @IsNotEmpty({ message: 'El número es obligatorio' })
  @MaxLength(GRE_CONSTANTS.MAX_NUMERO_LENGTH)
  numero!: string;

  @ApiProperty({ example: 'T001', description: 'Serie del documento' })
  @IsString({ message: 'La serie debe ser texto' })
  @IsNotEmpty({ message: 'La serie es obligatoria' })
  @MaxLength(GRE_CONSTANTS.MAX_SERIE_LENGTH)
  serie!: string;

  @ApiProperty({ example: '2026-07-07', description: 'Fecha de emisión (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  fecha!: string;

  @ApiPropertyOptional({
    example: '20123456789',
    description: 'RUC emisor. Si no se envía, se usa el RUC de la empresa del JWT',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{11}$/, { message: 'El RUC debe tener 11 dígitos' })
  ruc?: string;

  @ApiPropertyOptional({ example: 'Transportes Rápidos S.A.C.' })
  @IsOptional()
  @IsString()
  @MaxLength(GRE_CONSTANTS.MAX_TRANSPORTISTA_LENGTH)
  transportista?: string;

  @ApiPropertyOptional({ example: 'Av. Industrial 1234, Lima' })
  @IsOptional()
  @IsString()
  @MaxLength(GRE_CONSTANTS.MAX_UBICACION_LENGTH)
  origen?: string;

  @ApiPropertyOptional({ example: 'Calle Comercio 321, Arequipa' })
  @IsOptional()
  @IsString()
  @MaxLength(GRE_CONSTANTS.MAX_UBICACION_LENGTH)
  destino?: string;

  @ApiPropertyOptional({ example: 'Entrega programada para la mañana' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiProperty({
    type: [GreDetalleDto],
    description: 'Al menos un producto es obligatorio',
    example: [{ productoId: 'uuid-producto', cantidad: 25 }],
  })
  @ValidateNested({ each: true })
  @Type(() => GreDetalleDto)
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  productos!: GreDetalleDto[];
}
