import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import apiConfig, { ApiConfig } from 'src/config/api.config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ConfigModule.forFeature(apiConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ApiConfig, true>) => {
        return {
          secret: configService.get('jwtSecret', { infer: true }),
          signOptions: { expiresIn: '180s' },
        };
      },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
