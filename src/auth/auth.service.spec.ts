import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  const mockedUserService = { setContext: jest.fn(), log: jest.fn() };
  const mockedJwtService = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
        { provide: JwtService, useValue: mockedJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
