import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MVP_USER_ROLES, MvpUserRole } from '../constants';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  apellido?: string | null;

  @ApiProperty({ enum: MVP_USER_ROLES })
  rol!: MvpUserRole;

  @ApiProperty()
  rolNombre!: string;

  @ApiProperty()
  activo!: boolean;

  @ApiPropertyOptional()
  ultimoLoginAt?: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class RoleOptionDto {
  @ApiProperty({ enum: MVP_USER_ROLES })
  codigo!: MvpUserRole;

  @ApiProperty()
  nombre!: string;

  @ApiPropertyOptional()
  descripcion?: string | null;
}

export class PaginatedUsersDto {
  @ApiProperty({ type: [UserResponseDto] })
  items!: UserResponseDto[];

  @ApiProperty({
    example: { page: 1, limit: 20, total: 3, totalPages: 1 },
  })
  meta!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
