import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.setup';
import { validateProductionConfig } from './config/validate-production';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigService);
  const logger = app.get(Logger);
  app.useLogger(logger);

  validateProductionConfig(config);

  const port = config.get<number>('port', 3001);
  const apiPrefix = config.get<string>('apiPrefix', 'api');
  const corsOrigin = config.get<string>('corsOrigin', 'http://localhost:3000');
  const nodeEnv = config.get<string>('nodeEnv', 'development');
  const appUrl = config.get<string>('appUrl', '');
  const isProduction = nodeEnv === 'production';

  if (!Number.isFinite(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${port}`);
  }

  if (isProduction) {
    app.set('trust proxy', 1);
  }

  app.setGlobalPrefix(apiPrefix);

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: isProduction ? undefined : false,
    }),
  );
  app.use(cookieParser());
  app.use(compression());

  const allowedOrigins = corsOrigin
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : false,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      stopAtFirstError: false,
    }),
  );

  if (config.get<boolean>('swagger.enabled', false)) {
    setupSwagger(app);
  }

  app.enableShutdownHooks();

  await app.listen(port, '0.0.0.0');

  const serverBase = appUrl || `http://localhost:${port}`;
  logger.log(`GRE Smart Control API — ${nodeEnv}`, 'Bootstrap');
  logger.log(`Server:    ${serverBase}/${apiPrefix}`, 'Bootstrap');
  if (config.get<boolean>('swagger.enabled', false)) {
    logger.log(`Swagger:   ${serverBase}/${apiPrefix}/docs`, 'Bootstrap');
  }
  logger.log(`Health:    ${serverBase}/${apiPrefix}/health`, 'Bootstrap');
}

bootstrap().catch((error: unknown) => {
  console.error('Failed to start GRE Smart Control API:', error);
  process.exit(1);
});
