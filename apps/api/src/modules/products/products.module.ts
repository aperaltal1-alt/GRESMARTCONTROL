import { Module } from '@nestjs/common';
import { ProductsController } from './controllers';
import { CatalogRepository, ProductsRepository } from './repositories';
import { ProductsService } from './services';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, CatalogRepository],
  exports: [ProductsService],
})
export class ProductsModule {}
