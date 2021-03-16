import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { AppLogger } from './shared/logger/logger.service';
import { RequestContext } from './shared/request-context/request-context.dto';

describe('AppService', () => {
  let service: AppService;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService, { provide: AppLogger, useValue: mockedLogger }],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('getHello', () => {
    it('should return Hello World', () => {
      expect(service.getHello(ctx)).toEqual('Hello World!');
    });
  });
});
