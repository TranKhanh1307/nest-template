// import metadata from './metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { logger } from './common/middlewares/logger.middleware';
import { ApiConfig } from './config/api.config';
import { AppConfig } from './config/app.config';
import { SwaggerConfig } from './config/swagger.config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import compression from 'compression';

declare const module: any;

// Setup global prefixes, versioning, and middleware
function configureGlobal(app: INestApplication, apiConfig: ApiConfig) {
  app.setGlobalPrefix(apiConfig.prefix);
  app.enableVersioning({
    defaultVersion: apiConfig.version,
    type: VersioningType.URI,
  });
  app.use(logger, compression());
  app.useGlobalInterceptors(
    new TransformInterceptor(app.get(Reflector)),
    new TimeoutInterceptor(),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,  //Should disable error messages in production
      transform: true,
    }),
  );
}

// Setup Swagger documentation
async function configureSwagger(
  app: INestApplication,
  swaggerConfig: SwaggerConfig,
  appConfig: AppConfig,
) {
  if (appConfig.nodeEnv === 'production') return; // Disable Swagger in production

  const config = new DocumentBuilder()
    .addGlobalResponse(
      {
        description: 'Successful responses',
        status: '2XX',
        example: {
          data: {},
          code: 200,
          message: 'Successful',
        },
      },
      {
        type: 'object',
        description: 'Server error responses',
        status: '5XX',
        example: {
          status: 500,
          message: 'Internal Server Error',
          path: '/',
          timestamp: 'yyyy-MM-dd HH:mm:ss',
        },
      },
      {
        description: 'Client error responses',
        status: '4XX',
        example: {
          status: 400,
          message: 'Bad Request',
          path: '/',
          timestamp: 'yyyy-MM-dd HH:mm:ss',
        },
      },
    )
    .addBearerAuth()
    .setTitle('Nest Template Example')
    .setDescription('The Nest Template API description')
    .setVersion(swaggerConfig.version)
    .build();

  // await SwaggerModule.loadPluginMetadata(metadata);
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
  configureHotReload(module, app);
  await configureSwagger(app, swaggerConfig, appConfig);

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
