import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './core/auth/auth.controller';
import { AuthModule } from './core/auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import apiConfig from './config/api.config';
import swaggerConfig from './config/swagger.config';
import awsConfig from './config/aws.config';
import { validationSchema } from './env.validation';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { AlsModule } from './core/als/als.module';
import { AlsMiddleware } from './common/middlewares/als.middleware';
import { WinstonModule } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import winston from 'winston';
import { Console } from 'winston/lib/winston/transports';

@Module({
  imports: [
    AuthModule,
    UserModule,
    AlsModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [appConfig, databaseConfig, apiConfig, swaggerConfig, awsConfig],
      isGlobal: true,
      cache: true,
      expandVariables: true,
      skipProcessEnv: true, //Load env variables from config files instead of directly from process.env
      validationSchema: validationSchema,
    }),
    WinstonModule.forRoot({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return stack
            ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
            : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        }),
        winston.format.colorize({ all: true }),
        // winston.format.json(),
        // winston.format.prettyPrint({ colorize: true }),
      ),
      transports: [
        new DailyRotateFile({
          level: 'debug',
          dirname: 'logs',
          filename: 'application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '1d',
        }),
        new Console(),
      ],
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware).forRoutes('*path');
  }
}
