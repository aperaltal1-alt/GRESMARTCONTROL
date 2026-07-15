const isProduction = process.env.NODE_ENV === 'production';

export default () => ({
  swagger: {
    title: process.env.SWAGGER_TITLE ?? 'GRE Smart Control API',
    description:
      process.env.SWAGGER_DESCRIPTION ??
      'API REST para conciliación inteligente de GRE, Kardex e Inventario',
    version: process.env.SWAGGER_VERSION ?? '1.0',
    path: process.env.SWAGGER_PATH ?? 'docs',
    enabled:
      process.env.SWAGGER_ENABLED === 'true' ||
      (!isProduction && process.env.SWAGGER_ENABLED !== 'false'),
  },
});