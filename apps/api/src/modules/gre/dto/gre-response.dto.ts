import { ApiProperty } from '@nestjs/swagger';

export class GreDetalleResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ nullable: true })
  productoId!: string | null;

  @ApiProperty({ example: 'ARROZ-001' })
  codigoProducto!: string;

  @ApiProperty({ example: 'Arroz Extra Premium 5kg' })
  nombreProducto!: string;

  @ApiProperty({ example: 100 })
  cantidad!: number;
}

export class GreArchivoResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ['XML', 'PDF'] })
  tipo!: string;

  @ApiProperty({ example: 'GRE-T001-00000001.xml' })
  nombreOriginal!: string;

  @ApiProperty({ example: 'application/xml' })
  mimeType!: string;

  @ApiProperty({ example: 128 })
  tamanoBytes!: number;

  @ApiProperty()
  createdAt!: string;
}

export class GreResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ example: '00000001' })
  numero!: string;

  @ApiProperty({ example: 'T001' })
  serie!: string;

  @ApiProperty({ example: '2026-07-07' })
  fecha!: string;

  @ApiProperty({ example: 'Distribuidora GRE Demo S.A.C.' })
  empresa!: string;

  @ApiProperty({ example: '20123456789' })
  ruc!: string;

  @ApiProperty({ nullable: true })
  transportista!: string | null;

  @ApiProperty({ nullable: true })
  origen!: string | null;

  @ApiProperty({ nullable: true })
  destino!: string | null;

  @ApiProperty({ enum: ['PENDIENTE', 'CONCILIADA', 'CON_DIFERENCIA'] })
  estado!: string;

  @ApiProperty({ nullable: true })
  observaciones!: string | null;

  @ApiProperty({ type: [GreDetalleResponseDto] })
  productos!: GreDetalleResponseDto[];

  @ApiProperty({ type: [GreArchivoResponseDto] })
  archivos!: GreArchivoResponseDto[];

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class GreListItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  numero!: string;

  @ApiProperty()
  serie!: string;

  @ApiProperty()
  fecha!: string;

  @ApiProperty()
  empresa!: string;

  @ApiProperty()
  ruc!: string;

  @ApiProperty({ nullable: true })
  transportista!: string | null;

  @ApiProperty({ nullable: true })
  origen!: string | null;

  @ApiProperty({ nullable: true })
  destino!: string | null;

  @ApiProperty()
  estado!: string;

  @ApiProperty({ nullable: true })
  observaciones!: string | null;

  @ApiProperty({ example: 2 })
  totalProductos!: number;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}

export class PaginatedGreDto {
  @ApiProperty({ type: [GreListItemDto] })
  items!: GreListItemDto[];

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

export class GreUploadResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ enum: ['XML', 'PDF'] })
  tipo!: string;

  @ApiProperty()
  nombreOriginal!: string;

  @ApiProperty()
  mimeType!: string;

  @ApiProperty()
  tamanoBytes!: number;

  @ApiProperty()
  createdAt!: string;
}
