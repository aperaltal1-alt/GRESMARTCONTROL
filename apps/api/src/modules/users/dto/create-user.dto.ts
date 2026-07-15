import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { MVP_USER_ROLES, MvpUserRole } from '../constants';

export class CreateUserDto {
  @ApiProperty({ example: 'nuevo@gre-demo.pe' })
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @ApiProperty({ example: 'Demo2024!' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @ApiProperty({ example: 'María' })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @ApiPropertyOptional({ example: 'López' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  apellido?: string;

  @ApiProperty({ enum: MVP_USER_ROLES, example: 'SUPERVISOR' })
  @IsEnum(MVP_USER_ROLES, {
    message: `El rol debe ser uno de: ${MVP_USER_ROLES.join(', ')}`,
  })
  rol!: MvpUserRole;
}
