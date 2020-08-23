import { AppLogger } from './logger.service';

describe('AppLogger', () => {
  const mockedLogger = {};

  it('should be defined', () => {
    expect(new AppLogger(mockedLogger as any)).toBeDefined();
  });
});
