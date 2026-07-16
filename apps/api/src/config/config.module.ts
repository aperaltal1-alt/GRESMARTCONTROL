import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import swaggerConfig from './swagger.config';

const apiRoot = join(__dirname, '..', '..');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: [join(process.cwd(), '.env'), join(apiRoot, '.env')],
      load: [appConfig, databaseConfig, jwtConfig, swaggerConfig],
    }),
  ],
})
export class AppConfigModule {}
