import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 'uuid-producto' })
  id!: string;

  @ApiProperty({ example: 'HARINA-001' })
  codigo!: string;

  @ApiProperty({ example: 'Harina de Trigo 1kg' })
  nombre!: string;

  @ApiProperty({ example: 'Abarrotes' })
  categoria!: string;

  @ApiProperty({ example: 'UND' })
  unidad!: string;

  @ApiProperty({ example: 100 })
  stockActual!: number;

  @ApiProperty({ example: 20 })
  stockMinimo!: number;

  @ApiProperty({ example: true })
  activo!: boolean;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PaginatedProductsDto {
  @ApiProperty({ type: [ProductResponseDto] })
  items!: ProductResponseDto[];

  @ApiProperty({
    example: { page: 1, limit: 20, total: 10, totalPages: 1 },
  })
  meta!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
