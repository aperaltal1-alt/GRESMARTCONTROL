import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

/** DTO preparado para registro futuro (Enterprise) — sin endpoint en MVP. */
export class RegisterDto {
  @ApiProperty({ example: 'nuevo@gre-demo.pe' })
  @IsEmail({}, { message: 'El email no es válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email!: string;

  @ApiProperty({ example: 'Demo2024!' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password!: string;

  @ApiProperty({ example: 'Juan' })
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre!: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto' })
  apellido?: string;

  @ApiProperty({ example: 'uuid-empresa' })
  @IsUUID('4', { message: 'El ID de empresa no es válido' })
  empresaId!: string;
}
