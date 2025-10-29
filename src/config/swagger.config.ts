import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  prefix: process.env.SWAGGER_PREFIX || '',
  version: process.env.SWAGGER_VERSION || '1.0',
}));

export interface SwaggerConfig {
  prefix: string;
  version: string;
}
