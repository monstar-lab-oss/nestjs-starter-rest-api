import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppLogger } from './shared/logger/logger.service';
import { RequestContext } from './shared/request-context/request-context.dto';

describe('AppController', () => {
  let moduleRef: TestingModule;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, AppLogger],
    })
      .overrideProvider(AppLogger)
      .useValue(mockedLogger)
      .compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const appController = moduleRef.get<AppController>(AppController);
      const ctx = new RequestContext();
      expect(appController.getHello(ctx)).toBe('Hello World!');
    });
  });
});
