import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logger } from './common/middlewares/logger.middleware';
import { ApiConfig } from './config/api.config';
import { AppConfig } from './config/app.config';
import { SwaggerConfig } from './config/swagger.config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';

declare const module: any;

// Setup global prefixes, versioning, and middleware
function configureGlobal(app: INestApplication, apiConfig: ApiConfig) {
  app.setGlobalPrefix(apiConfig.prefix);
  app.enableVersioning({
    defaultVersion: apiConfig.version,
    type: VersioningType.URI,
  });
  app.use(logger);
  app.useGlobalInterceptors(
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );
}

// Setup Swagger documentation
function configureSwagger(
  app: INestApplication,
  swaggerConfig: SwaggerConfig,
  appConfig: AppConfig,
) {
  if (appConfig.nodeEnv === 'production') return; // Disable Swagger in production

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
function configureHotReload(module: any, app: INestApplication) {
  if (!module.hot) return;
  module.hot.accept();
  module.hot.dispose(() => app.close());
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiConfig = configService.getOrThrow<ApiConfig>('api');
  const appConfig = configService.getOrThrow<AppConfig>('app');
  const swaggerConfig = configService.getOrThrow<SwaggerConfig>('swagger');

  configureGlobal(app, apiConfig);
  configureSwagger(app, swaggerConfig, appConfig);
  configureHotReload(module, app);

  await app.listen(appConfig.port, appConfig.host);

  const url = await app.getUrl();
  const prefix = apiConfig.prefix ? `/${apiConfig.prefix}` : '';
  console.log(`🚀 Application running on: ${url}${prefix}`);
  if (appConfig.nodeEnv !== 'production') {
    console.log(
      `📘 Swagger UI available at: ${url}${prefix}/${swaggerConfig.prefix}`,
    );
  }
}

bootstrap();
