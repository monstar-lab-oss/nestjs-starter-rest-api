import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { createLogger, Logger, transports } from 'winston';
import { RequestContext } from '../request-context/request-context.dto';

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    this.logger = createLogger({
      transports: [new transports.Console()],
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  log(message: any, context?: string): Logger {
    return this.logger.info(message, {
      context: context || this.context,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  error(message: any, trace?: string, context?: string): Logger {
    return this.logger.error(message, {
      trace,
      context: context || this.context,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  warn(message: any, context?: string): Logger {
    return this.logger.warn(message, {
      context: context || this.context,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  debug(message: any, context?: string): Logger {
    return this.logger.debug(message, {
      context: context || this.context,
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  verbose(message: any, context?: string): Logger {
    return this.logger.verbose(message, {
      context: context || this.context,
    });
  }

  // TODO : This is a temporary function, it will be renamed to `log` once we update it across
  // all controllers, services, etc.
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  logWithContext(ctx: RequestContext, message: any): Logger {
    return this.logger.info({
      message,
      ctx,
      contextName: this.context,
    });
  }
}
