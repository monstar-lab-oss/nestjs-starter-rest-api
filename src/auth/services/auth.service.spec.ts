import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  const mockedUserService = { setContext: jest.fn(), log: jest.fn() };
  const mockedJwtService = { setContext: jest.fn(), log: jest.fn() };
  const mockConfigService = {};

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
