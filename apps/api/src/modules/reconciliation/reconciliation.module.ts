import { Module } from '@nestjs/common';
import {
  AlertsController,
  IncidentsController,
  ReconciliationController,
} from './controllers';
import { ReconciliationRepository } from './repositories';
import { AlertsService, IncidentsService, ReconciliationService } from './services';

@Module({
  controllers: [ReconciliationController, IncidentsController, AlertsController],
  providers: [
    ReconciliationService,
    IncidentsService,
    AlertsService,
    ReconciliationRepository,
  ],
  exports: [ReconciliationService],
})
export class ReconciliationModule {}
