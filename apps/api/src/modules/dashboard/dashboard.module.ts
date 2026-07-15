import { Module } from '@nestjs/common';
import { DashboardController } from './controllers';
import { DashboardRepository } from './repositories';
import { DashboardService } from './services';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
  exports: [DashboardService],
})
export class DashboardModule {}
