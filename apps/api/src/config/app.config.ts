const isProduction = process.env.NODE_ENV === 'production';

function parsePort(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? String(fallback), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parsePort(process.env.PORT, 3001),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  appUrl: process.env.APP_URL ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? (isProduction ? '' : 'http://localhost:3000'),
  throttle: {
    ttl: parsePort(process.env.THROTTLE_TTL, 60000),
    limit: parsePort(process.env.THROTTLE_LIMIT, 100),
  },
  upload: {
    dir: process.env.UPLOAD_DIR ?? './uploads',
    maxFileSize: parsePort(process.env.MAX_FILE_SIZE, 10485760),
  },
  log: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
});
