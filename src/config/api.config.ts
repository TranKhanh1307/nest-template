import { registerAs } from '@nestjs/config';

export default registerAs(
  'api',
  (): ApiConfig => ({
    prefix: process.env.API_PREFIX || '',
    version: process.env.API_VERSION || '1',
    jwtSecret: process.env.JWT_SECRET || 'YOUR_SECRET_KEY',
  }),
);

export interface ApiConfig {
  prefix: string;
  version: string;
  jwtSecret: string;
}
