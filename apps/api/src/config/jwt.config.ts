export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-this-to-a-secure-random-string-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'change-this-refresh-secret-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
  },
});
