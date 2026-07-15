import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const nodeEnv = config.get<string>('nodeEnv', 'development');
        const logLevel = config.get<string>('log.level', 'info');

        return {
          pinoHttp: {
            level: logLevel,
            genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
            customProps: (req) => ({ requestId: (req as { id?: string }).id }),
            transport:
              nodeEnv !== 'production'
                ? { target: 'pino-pretty', options: { colorize: true, singleLine: true } }
                : undefined,
            serializers: {
              req: (req: { method: string; url: string; id?: string }) => ({
                method: req.method,
                url: req.url,
                id: req.id,
              }),
              res: (res: { statusCode: number }) => ({ statusCode: res.statusCode }),
            },
            autoLogging: true,
          },
        };
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
