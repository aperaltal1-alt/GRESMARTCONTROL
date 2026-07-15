import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma';

@Injectable()
export class HealthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  getStatus() {
    return {
      status: 'ok',
      service: 'gre-smart-control-api',
      version: '0.1.0',
      environment: this.config.get<string>('nodeEnv', 'development'),
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase() {
    const start = Date.now();
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      database: 'connected',
      latencyMs: Date.now() - start,
    };
  }
}
