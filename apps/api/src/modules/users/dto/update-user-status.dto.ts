import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ example: false, description: 'true = activo, false = inactivo' })
  @IsBoolean({ message: 'El campo activo debe ser booleano' })
  activo!: boolean;
}
