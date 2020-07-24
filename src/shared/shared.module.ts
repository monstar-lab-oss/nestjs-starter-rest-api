import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/module-options';
import { LoggerModule } from './logger/logger.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), LoggerModule],
  exports: [ConfigModule, LoggerModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }
  ]
})
export class SharedModule { }
