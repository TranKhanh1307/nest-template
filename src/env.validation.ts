import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'uat', 'staging')
    .default('development'),

  SERVER_HOST: Joi.string().default('localhost'),
  SERVER_PORT: Joi.number().port().default(3000),

  API_PREFIX: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z0-9/_-]+$/)
    .message(
      'API_PREFIX must not contain spaces or unsupported special characters',
    )
    .default('')
    .allow(''),
  API_VERSION: Joi.string().default('1'),

  SWAGGER_PREFIX: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z0-9/_-]+$/)
    .message('SWAGGER_PREFIX must not contain spaces or special characters')
    .default('docs'),
  SWAGGER_VERSION: Joi.string().default('1.0'),

  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().port().default(3306),
  DB_USER: Joi.string().default('root'),
  DB_PASSWORD: Joi.string().allow(''),
  DB_NAME: Joi.string().default('mydb'),

  APP_URL: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .default('http://localhost'),
  SUPPORT_EMAIL: Joi.string().email().default('support@example.com'),

  JWT_SECRET: Joi.string().default('YOUR_SECRET_KEY'),
});
