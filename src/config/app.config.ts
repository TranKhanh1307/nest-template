import { registerAs } from '@nestjs/config';

export default registerAs('app', (): AppConfig => {
  return {
    host: process.env.SERVER_HOST || 'localhost',
    port: Number(process.env.SERVER_PORT) || 3000,
  };
});

export interface AppConfig {
  host: string;
  port: number;
}
