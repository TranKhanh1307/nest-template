import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  host: process.env.SERVER_HOST || 'localhost',
  port: process.env.SERVER_PORT || 3000,
}));
