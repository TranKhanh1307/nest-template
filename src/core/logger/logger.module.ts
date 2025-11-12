import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Console } from 'winston/lib/winston/transports';
import { format, transport } from 'winston';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.getOrThrow<string>('app.nodeEnv') === 'production';
        const formats = [format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })];
        const transports: transport[] = [];

        if (isProduction) {
          formats.push(format.json());
          transports.push(
            new DailyRotateFile({
              dirname: 'logs',
              filename: 'application-%DATE%.log',
              datePattern: 'YYYY-MM-DD',
              zippedArchive: true,
              maxSize: '20m',
              maxFiles: '14d',
            }),
          );
        } else {
          formats.push(
            format.printf(({ timestamp, level, message, stack }) => {
              return stack
                ? `[${timestamp}] ${level.toUpperCase()}: ${message}\n${stack}`
                : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
            }),
            format.colorize({ all: true }),
          );
          transports.push(new Console());
        }

        return {
          level: configService.getOrThrow<string>('app.logLevel'),
          format: format.combine(...formats),
          transports: transports,
        };
      },
    }),
  ],
})
export class LoggerModule {}
