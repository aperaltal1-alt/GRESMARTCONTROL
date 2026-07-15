import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  apellido?: string | null;

  @ApiProperty()
  rol!: string;

  @ApiProperty()
  empresaId!: string;

  @ApiProperty()
  empresaNombre!: string;
}

export class AuthTokensDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ example: 'Bearer' })
  tokenType!: string;

  @ApiProperty({ example: 900, description: 'Segundos hasta expiración del access token' })
  expiresIn!: number;
}

export class LoginResponseDto {
  @ApiProperty({ type: AuthTokensDto })
  tokens!: AuthTokensDto;

  @ApiProperty({ type: AuthUserDto })
  user!: AuthUserDto;
}

export class ProfileResponseDto extends AuthUserDto {
  @ApiProperty()
  ultimoLoginAt!: string | null;

  @ApiProperty()
  permisos!: string[];
}
