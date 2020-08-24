import { Module } from '@nestjs/common';
import { AppLogger } from './logger.service';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [LoggerModule.forRoot()],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppLoggerModule {}
