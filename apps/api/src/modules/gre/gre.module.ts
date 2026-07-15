import { Module } from '@nestjs/common';
import { GreController } from './controllers';
import { GreCatalogRepository, GreRepository } from './repositories';
import { GreService, GreStorageService } from './services';

@Module({
  controllers: [GreController],
  providers: [GreService, GreStorageService, GreRepository, GreCatalogRepository],
  exports: [GreService],
})
export class GreModule {}
