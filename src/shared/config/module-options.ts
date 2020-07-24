import configuration from './configuration';
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import * as Joi from '@hapi/joi'

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  validationSchema: Joi.object({
    APP_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .default('development'),
    APP_PORT: Joi.number().required(),
  }),
}