import { Module } from '@nestjs/common';
import { InventoryController, KardexController } from './controllers';
import { KardexRepository } from './repositories';
import { InventoryService, KardexService } from './services';

@Module({
  controllers: [KardexController, InventoryController],
  providers: [KardexService, InventoryService, KardexRepository],
  exports: [KardexService, InventoryService],
})
export class KardexModule {}
