import { registerAs } from '@nestjs/config';

export default registerAs('app', (): AppConfig => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    host: process.env.SERVER_HOST || 'localhost',
    port: Number(process.env.SERVER_PORT) || 3000,
  };
});

export interface AppConfig {
  nodeEnv: string;
  host: string;
  port: number;
}
