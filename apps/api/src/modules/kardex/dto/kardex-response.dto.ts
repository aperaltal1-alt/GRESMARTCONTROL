import { ApiProperty } from '@nestjs/swagger';

export class KardexMovementResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  productoId!: string;

  @ApiProperty({ example: 'ARROZ-001' })
  codigoProducto!: string;

  @ApiProperty({ example: 'Arroz Extra Premium 5kg' })
  nombreProducto!: string;

  @ApiProperty({ example: '2026-07-07' })
  fecha!: string;

  @ApiProperty({ enum: ['ENTRADA', 'SALIDA', 'AJUSTE'] })
  tipo!: string;

  @ApiProperty({ example: 10 })
  cantidad!: number;

  @ApiProperty({ example: 100 })
  saldoAnterior!: number;

  @ApiProperty({ example: 110 })
  saldoNuevo!: number;

  @ApiProperty({ nullable: true })
  observacion!: string | null;

  @ApiProperty()
  createdAt!: string;
}

export class PaginatedKardexMovementsDto {
  @ApiProperty({ type: [KardexMovementResponseDto] })
  items!: KardexMovementResponseDto[];

  @ApiProperty({
    example: { page: 1, limit: 20, total: 5, totalPages: 1 },
  })
  meta!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class InventoryItemDto {
  @ApiProperty()
  productoId!: string;

  @ApiProperty({ example: 'ARROZ-001' })
  codigo!: string;

  @ApiProperty({ example: 'Arroz Extra Premium 5kg' })
  nombre!: string;

  @ApiProperty({ example: 150 })
  stockActual!: number;

  @ApiProperty({ example: 20 })
  stockMinimo!: number;

  @ApiProperty({ enum: ['NORMAL', 'BAJO', 'SIN STOCK'] })
  estado!: string;
}

export class PaginatedInventoryDto {
  @ApiProperty({ type: [InventoryItemDto] })
  items!: InventoryItemDto[];

  @ApiProperty({
    example: { page: 1, limit: 20, total: 8, totalPages: 1 },
  })
  meta!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
