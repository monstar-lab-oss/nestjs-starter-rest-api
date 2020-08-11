import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppLogger } from '../logger/logger.service';
import { ConfigService } from '@nestjs/config';

describe('AllExceptionsFilter', () => {
  it('should be defined', () => {
    expect(
      new AllExceptionsFilter(new AppLogger(), new ConfigService()),
    ).toBeDefined();
  });
});
