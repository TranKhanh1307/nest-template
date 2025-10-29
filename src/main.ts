import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logger } from './common/middlewares/logger.middleware';
import { ApiConfig } from './config/api.config';
import { AppConfig } from './config/app.config';
import { SwaggerConfig } from './config/swagger.config';

declare const module: any;

// Constants for config keys
const CONFIG_KEYS = {
  API: 'api',
  APP: 'app',
  SWAGGER: 'swagger',
};

// Type-safe config helper
function getConfig<T>(service: ConfigService, key: string): T {
  const value = service.get<T>(key);
  if (!value) throw new Error(`Missing configuration for key: ${key}`);
  return value;
}

// Setup global prefixes, versioning, and middleware
function setupGlobalConfigs(app: INestApplication, apiConfig: ApiConfig) {
  app.setGlobalPrefix(apiConfig.prefix);
  app.enableVersioning({
    defaultVersion: apiConfig.version,
    type: VersioningType.URI,
  });
  app.use(logger);
}

// Setup Swagger documentation
function setupSwaggerDocs(app: INestApplication, swaggerConfig: SwaggerConfig) {
  if (process.env.NODE_ENV === 'production') return; // Disable Swagger in production

  const config = new DocumentBuilder()
    .setTitle('Nest Template Example')
    .setDescription('The Nest Template API description')
    .setVersion(swaggerConfig.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerConfig.prefix, app, document, {
    useGlobalPrefix: true,
  });
}

// Handle Hot Module Replacement
function enableHotReload(module: any, app: INestApplication) {
  if (!module.hot) return;
  module.hot.accept();
  module.hot.dispose(() => app.close());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiConfig = getConfig<ApiConfig>(configService, CONFIG_KEYS.API);
  const appConfig = getConfig<AppConfig>(configService, CONFIG_KEYS.APP);
  const swaggerConfig = getConfig<SwaggerConfig>(
    configService,
    CONFIG_KEYS.SWAGGER,
  );

  setupGlobalConfigs(app, apiConfig);
  setupSwaggerDocs(app, swaggerConfig);
  enableHotReload(module, app);

  await app.listen(appConfig.port, appConfig.host);

  const url = await app.getUrl();
  console.log(`🚀 Application running on: ${url}/${apiConfig.prefix}`);
  console.log(
    `📘 Swagger UI available at: ${url}/${apiConfig.prefix}/${swaggerConfig.prefix}`,
  );
}

bootstrap();
