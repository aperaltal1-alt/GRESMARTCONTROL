const isProduction = process.env.NODE_ENV === 'production';

export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  appUrl: process.env.APP_URL ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? (isProduction ? '' : 'http://localhost:3000'),  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL ?? '60000', 10),
    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
  },
  upload: {
    dir: process.env.UPLOAD_DIR ?? './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '10485760', 10),
  },
  log: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
});
