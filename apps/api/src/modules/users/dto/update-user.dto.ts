import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { MVP_USER_ROLES, MvpUserRole } from '../constants';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'maria.lopez@gre-demo.pe' })
  @IsOptional()
  @IsEmail({}, { message: 'El email no es válido' })
  email?: string;

  @ApiPropertyOptional({ example: 'María' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  nombre?: string;

  @ApiPropertyOptional({ example: 'López' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  apellido?: string;

  @ApiPropertyOptional({ enum: MVP_USER_ROLES, example: 'SUPERVISOR' })
  @IsOptional()
  @IsEnum(MVP_USER_ROLES, {
    message: `El rol debe ser uno de: ${MVP_USER_ROLES.join(', ')}`,
  })
  rol?: MvpUserRole;

  @ApiPropertyOptional({ example: 'NuevaDemo2024!' })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password?: string;
}
