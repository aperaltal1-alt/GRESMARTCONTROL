import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  transpilePackages: ['@gre-smart/shared'],
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  ...(isProduction && {
    compiler: {
      removeConsole: { exclude: ['error', 'warn'] },
    },
  }),
};

export default nextConfig;
