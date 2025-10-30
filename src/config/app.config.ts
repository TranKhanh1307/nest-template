import { registerAs } from '@nestjs/config';

export default registerAs('app', (): AppConfig => {
  const host = process.env.SERVER_HOST || 'localhost';
  const port = Number(process.env.SERVER_PORT) || 3000;

  if (isNaN(port)) {
    throw new Error('SERVER_PORT must be a valid number');
  }

  if (port < 1024 || port > 49151) {
    throw new Error('SERVER_PORT must be between 1024 and 49151');
  }

  return { host, port };
});

export interface AppConfig {
  host: string;
  port: number;
}
