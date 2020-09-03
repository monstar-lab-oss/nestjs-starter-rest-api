import configuration from './configuration';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as Joi from '@hapi/joi';

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: envFilePath(),
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    APP_PORT: Joi.number().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().optional(),
    DB_NAME: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),
    JWT_PUBLIC_KEY: Joi.string().required(),
    JWT_PRIVATE_KEY: Joi.string().required(),
    JWT_EXPIRES_IN_SECONDS: Joi.number().required(),
  }),
};

function envFilePath() {
  const nodeEnv = process.env.NODE_ENV || 'development';

  switch (nodeEnv) {
    case 'development':
      return `.env.${nodeEnv}`;
    case 'test':
      return `test/secrets/.env.${nodeEnv}`;
    case 'production':
      return `.env.${nodeEnv}`;

    default:
      throw new Error(`Could not find matching NODE_ENV value for: ${nodeEnv}`);
  }
}
