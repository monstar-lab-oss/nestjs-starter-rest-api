import { Injectable } from '@nestjs/common';

import { AppLogger } from './shared/logger/logger.service';
import { RequestContext } from './shared/request-context/request-context.dto';

@Injectable()
export class AppService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(AppService.name);
  }

  getHello(ctx: RequestContext): string {
    this.logger.log(ctx, 'Hello world from App service');

    return 'Hello World!';
  }
}
