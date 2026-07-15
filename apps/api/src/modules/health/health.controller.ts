import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators';
import { ApiStandardResponse } from '../../common/decorators/api-standard-response.decorator';
import { DatabaseHealthDto, HealthCheckDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Estado general del servidor' })
  @ApiStandardResponse(HealthCheckDto, 'Servidor operativo')
  getHealth() {
    return this.healthService.getStatus();
  }

  @Public()
  @Get('db')
  @ApiOperation({ summary: 'Estado de la conexión a PostgreSQL' })
  @ApiStandardResponse(DatabaseHealthDto, 'Base de datos conectada')
  async getDatabaseHealth() {
    return this.healthService.checkDatabase();
  }
}
