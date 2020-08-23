import { Injectable } from '@nestjs/common';
import { AppLogger } from './shared/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AppService.name);
  }

  getHello(): string {
    this.logger.log('Hello world from App service');

    return 'Hello World!';
  }
}
