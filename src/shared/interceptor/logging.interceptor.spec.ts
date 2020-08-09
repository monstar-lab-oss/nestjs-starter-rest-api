import { LoggingInterceptor } from './logging.interceptor';
import { AppLogger } from '../logger/logger.service';

describe('LoggingInterceptor', () => {
  it('should be defined', () => {
    expect(new LoggingInterceptor(new AppLogger())).toBeDefined();
  });
});
