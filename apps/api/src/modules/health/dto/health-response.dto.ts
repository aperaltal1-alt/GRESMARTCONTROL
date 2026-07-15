import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckDto {
  @ApiProperty({ example: 'ok' })
  status!: string;

  @ApiProperty({ example: 'gre-smart-control-api' })
  service!: string;

  @ApiProperty({ example: '0.1.0' })
  version!: string;

  @ApiProperty({ example: 'development' })
  environment!: string;

  @ApiProperty({ example: '2026-07-08T03:00:00.000Z' })
  timestamp!: string;
}

export class DatabaseHealthDto {
  @ApiProperty({ example: 'connected' })
  database!: string;

  @ApiProperty({ example: 12 })
  latencyMs!: number;
}
