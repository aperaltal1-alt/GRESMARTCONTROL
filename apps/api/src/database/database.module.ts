import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma';

@Module({
  imports: [PrismaModule],
  exports: [PrismaModule],
})
export class DatabaseModule {}
