import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { UserService } from './user/user.service';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import apiConfig from './config/api.config';
import swaggerConfig from './config/swagger.config';
import awsConfig from './config/aws.config';
import { validationSchema } from './env.validation';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env'],
      load: [appConfig, databaseConfig, apiConfig, swaggerConfig, awsConfig],
      isGlobal: true,
      cache: true,
      expandVariables: true,
      skipProcessEnv: true, //Load env variables from config files instead of directly from process.env
      validationSchema: validationSchema,
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    AuthService,
    UserService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
