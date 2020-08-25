import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AppLoggerModule } from './logger/logger.module';

import { configModuleOptions } from './config/module-options';
import { AllExceptionsFilter } from './filter/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number | undefined>('database.port'),
        database: configService.get<string>('database.name'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: false,
        debug: configService.get<string>('env') === 'development',
      }),
    }),
    AppLoggerModule,
  ],
  exports: [AppLoggerModule, ConfigModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class SharedModule {}
