import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLogger } from './shared/logger/logger.service';

describe('AppController', () => {
  let app: TestingModule;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, AppLogger],
    })
      .overrideProvider(AppLogger)
      .useValue(mockedLogger)
      .compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
