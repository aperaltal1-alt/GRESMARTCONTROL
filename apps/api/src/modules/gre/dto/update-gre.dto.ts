import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { GRE_CONSTANTS } from '../constants';
import { GreDetalleDto } from './gre-detalle.dto';

export class UpdateGreDto {
  @ApiPropertyOptional({ example: '00000010' })
  @IsOptional()
  @IsString()
  @MaxLength(GRE_CONSTANTS.MAX_NUMERO_LENGTH)
  numero?: string;

  @ApiPropertyOptional({ example: 'T001' })
  @IsOptional()
  @IsString()
  @MaxLength(GRE_CONSTANTS.MAX_SERIE_LENGTH)
  serie?: string;

  @ApiPropertyOptional({ example: '2026-07-07' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  fecha?: string;

  @ApiPropertyOptional({ example: '20123456789' })
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

  @ApiPropertyOptional({
    enum: GRE_CONSTANTS.ALLOWED_ESTADOS,
    example: 'PENDIENTE',
  })
  @IsOptional()
  @IsEnum(GRE_CONSTANTS.ALLOWED_ESTADOS, {
    message: 'El estado debe ser PENDIENTE, CONCILIADA o CON_DIFERENCIA',
  })
  estado?: (typeof GRE_CONSTANTS.ALLOWED_ESTADOS)[number];

  @ApiPropertyOptional({ example: 'Observación actualizada' })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({
    type: [GreDetalleDto],
    description: 'Si se envía, reemplaza todos los productos del detalle',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GreDetalleDto)
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  productos?: GreDetalleDto[];
}
