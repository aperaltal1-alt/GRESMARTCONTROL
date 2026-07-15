import { ConfigService } from '@nestjs/config';

const PLACEHOLDER_SECRETS = [
  'change-this-to-a-secure-random-string-in-production',
  'change-this-refresh-secret-in-production',
];

export function validateProductionConfig(config: ConfigService): void {
  const nodeEnv = config.get<string>('nodeEnv');
  if (nodeEnv !== 'production') return;

  const required: Array<{ key: string; value: string | undefined }> = [
    { key: 'DATABASE_URL', value: config.get<string>('database.url') },
    { key: 'DIRECT_DATABASE_URL', value: config.get<string>('database.directUrl') },
    { key: 'JWT_SECRET', value: config.get<string>('jwt.secret') },
    { key: 'JWT_REFRESH_SECRET', value: config.get<string>('jwt.refreshSecret') },
    { key: 'CORS_ORIGIN', value: config.get<string>('corsOrigin') },
    { key: 'APP_URL', value: config.get<string>('appUrl') },
  ];

  const missing = required.filter(({ value }) => !value).map(({ key }) => key);
  if (missing.length > 0) {
    throw new Error(`Missing required production env vars: ${missing.join(', ')}`);
  }

  const jwtSecret = config.get<string>('jwt.secret')!;
  const jwtRefreshSecret = config.get<string>('jwt.refreshSecret')!;

  if (PLACEHOLDER_SECRETS.includes(jwtSecret) || PLACEHOLDER_SECRETS.includes(jwtRefreshSecret)) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be changed in production');
  }

  const corsOrigin = config.get<string>('corsOrigin')!;
  if (corsOrigin.includes('localhost') || corsOrigin.includes('127.0.0.1')) {
    throw new Error('CORS_ORIGIN must not use localhost in production');
  }

  const appUrl = config.get<string>('appUrl')!;
  if (!appUrl.startsWith('https://')) {
    throw new Error('APP_URL must use HTTPS in production');
  }
}
