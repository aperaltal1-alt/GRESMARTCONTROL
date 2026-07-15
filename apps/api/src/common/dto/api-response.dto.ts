import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApiResponseDto<T = unknown> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Operación exitosa' })
  message!: string;

  @ApiPropertyOptional()
  data!: T | null;

  @ApiProperty({ example: '2026-07-08T03:00:00.000Z' })
  timestamp!: string;
}
