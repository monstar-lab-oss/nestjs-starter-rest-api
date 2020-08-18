import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PinoLogger } from 'nestjs-pino';

@Controller()
export class AppController {
  constructor(
    private readonly logger: PinoLogger,
    private readonly appService: AppService,
  ) {
    this.logger.setContext(AppController.name);
  }

  @Get()
  getHello(): string {
    this.logger.info('Hello world from App controller');

    return this.appService.getHello();
  }
}
