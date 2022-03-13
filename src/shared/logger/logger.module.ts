import { Module } from '@nestjs/common';

import { AppLogger } from './logger.service';

@Module({
  imports: [],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppLoggerModule {}
