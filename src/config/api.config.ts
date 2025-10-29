import { registerAs } from '@nestjs/config';

export default registerAs('api', () => ({
  prefix: process.env.API_PREFIX || '',
  version: process.env.API_VERSION || '1',
}));

export interface ApiConfig {
  prefix: string;
  version: string;
}
