import { AllExceptionsFilter } from './all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';

describe('AllExceptionsFilter', () => {
  it('should be defined', () => {
    expect(
      new AllExceptionsFilter(new ConfigService(), new PinoLogger({})),
    ).toBeDefined();
  });
});
