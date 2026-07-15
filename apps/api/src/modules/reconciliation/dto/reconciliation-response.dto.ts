import { ApiProperty } from '@nestjs/swagger';

export class RunReconciliationResponseDto {
  @ApiProperty()
  conciliacionId!: string;

  @ApiProperty()
  greId!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty()
  estado!: string;

  @ApiProperty({ enum: ['CONCILIADA', 'CON_DIFERENCIA'] })
  resultadoGre!: string;

  @ApiProperty()
  totalLineas!: number;

  @ApiProperty()
  lineasOk!: number;

  @ApiProperty()
  lineasConDiferencia!: number;

  @ApiProperty()
  incidenciasCreadas!: number;

  @ApiProperty()
  alertasCreadas!: number;

  @ApiProperty()
  duracionMs!: number;
}

export class ReconciliationLineDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  productoId!: string;

  @ApiProperty()
  codigoProducto!: string;

  @ApiProperty()
  nombreProducto!: string;

  @ApiProperty()
  cantidadGre!: number;

  @ApiProperty()
  cantidadKardex!: number;

  @ApiProperty()
  cantidadInventario!: number;

  @ApiProperty()
  diffGreKardex!: number;

  @ApiProperty()
  diffGreInventario!: number;

  @ApiProperty()
  diffKardexInventario!: number;

  @ApiProperty()
  resultado!: string;

  @ApiProperty()
  diferencia!: number;
}

export class ReconciliationSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  greId!: string;

  @ApiProperty()
  greNumero!: string;

  @ApiProperty()
  greSerie!: string;

  @ApiProperty()
  version!: number;

  @ApiProperty()
  estado!: string;

  @ApiProperty()
  metodo!: string;

  @ApiProperty()
  totalLineas!: number;

  @ApiProperty()
  lineasOk!: number;

  @ApiProperty()
  lineasConDiferencia!: number;

  @ApiProperty()
  resultadoGre!: string;

  @ApiProperty()
  ejecutadoPor!: string;

  @ApiProperty()
  iniciadoAt!: string;

  @ApiProperty({ nullable: true })
  completadoAt!: string | null;

  @ApiProperty({ nullable: true })
  duracionMs!: number | null;
}

export class ReconciliationDetailDto extends ReconciliationSummaryDto {
  @ApiProperty({ nullable: true })
  observacion!: string | null;

  @ApiProperty({ type: [ReconciliationLineDto] })
  lineas!: ReconciliationLineDto[];

  @ApiProperty({ type: [Object] })
  incidencias!: Record<string, unknown>[];

  @ApiProperty({ type: [Object] })
  alertas!: Record<string, unknown>[];
}

export class PaginatedReconciliationsDto {
  @ApiProperty({ type: [ReconciliationSummaryDto] })
  items!: ReconciliationSummaryDto[];

  @ApiProperty()
  meta!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class IncidentSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  greId!: string;

  @ApiProperty()
  greNumero!: string;

  @ApiProperty()
  greSerie!: string;

  @ApiProperty()
  productoId!: string;

  @ApiProperty()
  codigoProducto!: string;

  @ApiProperty()
  nombreProducto!: string;

  @ApiProperty()
  tipo!: string;

  @ApiProperty()
  cantidadGre!: number;

  @ApiProperty()
  cantidadKardex!: number;

  @ApiProperty()
  cantidadInventario!: number;

  @ApiProperty()
  diferencia!: number;

  @ApiProperty()
  estado!: string;

  @ApiProperty()
  prioridad!: string;

  @ApiProperty({ nullable: true })
  observacion!: string | null;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty({ nullable: true })
  resolvedAt!: string | null;
}

export class PaginatedIncidentsDto {
  @ApiProperty({ type: [IncidentSummaryDto] })
  items!: IncidentSummaryDto[];

  @ApiProperty()
  meta!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class AlertSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  tipo!: string;

  @ApiProperty()
  nivel!: string;

  @ApiProperty()
  mensaje!: string;

  @ApiProperty({ nullable: true })
  productoId!: string | null;

  @ApiProperty({ nullable: true })
  codigoProducto!: string | null;

  @ApiProperty({ nullable: true })
  greId!: string | null;

  @ApiProperty({ nullable: true })
  greNumero!: string | null;

  @ApiProperty({ nullable: true })
  conciliacionId!: string | null;

  @ApiProperty({ nullable: true })
  incidenciaId!: string | null;

  @ApiProperty()
  leida!: boolean;

  @ApiProperty()
  activa!: boolean;

  @ApiProperty()
  createdAt!: string;
}

export class PaginatedAlertsDto {
  @ApiProperty({ type: [AlertSummaryDto] })
  items!: AlertSummaryDto[];

  @ApiProperty()
  meta!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ResolveIncidentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  estado!: string;

  @ApiProperty()
  resolvedAt!: string;

  @ApiProperty()
  message!: string;
}

export class MarkAlertReadResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  leida!: boolean;

  @ApiProperty()
  message!: string;
}
