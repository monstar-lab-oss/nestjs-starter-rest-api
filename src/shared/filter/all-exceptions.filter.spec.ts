import { Test, TestingModule } from '@nestjs/testing';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ConfigService } from '@nestjs/config';

describe('AllExceptionsFilter', () => {
  const mockedLogger = { setContext: jest.fn() };

  it('should be defined', () => {
    expect(
      new AllExceptionsFilter(new ConfigService(), mockedLogger as any),
    ).toBeDefined();
  });
});
