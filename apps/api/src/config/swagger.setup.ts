import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = app.get(ConfigService);
  const title = config.get<string>('swagger.title', 'GRE Smart Control API');
  const description = config.get<string>(
    'swagger.description',
    'API REST para conciliación inteligente de GRE, Kardex e Inventario',
  );
  const version = config.get<string>('swagger.version', '1.0');
  const path = config.get<string>('swagger.path', 'docs');
  const apiPrefix = config.get<string>('apiPrefix', 'api');
  const swaggerPath = `${apiPrefix}/${path}`;

  const documentBuilder = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Access token JWT (15 min). Formato: Bearer {token}',
        in: 'header',
      },
      'access-token',
    )
    .addCookieAuth('gre_refresh_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'gre_refresh_token',
      description: 'Refresh token HttpOnly (7 días). Alternativa al body en /auth/refresh y /auth/logout',
    }, 'refresh-token')
    .addTag('Auth', 'Autenticación y autorización JWT — Fase 4.2')
    .addTag('Users', 'Gestión básica de usuarios — MVP')
    .addTag('Products', 'Gestión de productos — MVP')
    .addTag('GRE', 'Gestión de guías de remisión — MVP')
    .addTag('Kardex', 'Movimientos y stock — MVP')
    .addTag('Inventory', 'Consulta de inventario — MVP')
    .addTag('Reconciliation', 'Conciliación GRE vs Kardex vs Inventario — MVP')
    .addTag('Incidents', 'Incidencias de conciliación — MVP')
    .addTag('Alerts', 'Alertas del sistema — MVP')
    .addTag('Dashboard', 'Dashboard ejecutivo — MVP')
    .addTag('Health', 'Estado del servidor y base de datos')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup(swaggerPath, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
    customSiteTitle: `${title} — Swagger`,
  });
}
