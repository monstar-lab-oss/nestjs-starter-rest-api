import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/module-options';
import { LoggerModule } from './logger/logger.module';
@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), LoggerModule],
  exports: [ConfigModule]
})
export class SharedModule { }
