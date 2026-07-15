const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    if (isProduction) {
      throw new Error(`${name} is required in production`);
    }
    return '';
  }
  return value;
}

function getApiUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (url) return url;
  if (isDevelopment) return 'http://localhost:3001/api';
  throw new Error('NEXT_PUBLIC_API_URL is required');
}

function getAppUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (url) return url;
  if (isDevelopment) return 'http://localhost:3000';
  throw new Error('NEXT_PUBLIC_APP_URL is required in production');
}

export const env = {
  apiUrl: getApiUrl(),
  appUrl: getAppUrl(),
  appName: requireEnv('NEXT_PUBLIC_APP_NAME', process.env.NEXT_PUBLIC_APP_NAME) || 'GRE Smart Control',
  isProduction,
} as const;
