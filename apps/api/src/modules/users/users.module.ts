import { Module } from '@nestjs/common';
import { UsersController } from './controllers';
import { RolesRepository, UsersRepository } from './repositories';
import { UsersService } from './services';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, RolesRepository],
  exports: [UsersService],
})
export class UsersModule {}
