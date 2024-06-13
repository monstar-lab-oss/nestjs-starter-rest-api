import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { UserService } from '../../user/services/user.service';
import { ROLE } from '../constants/role.constant';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
} from '../dtos/auth-token-output.dto';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const accessTokenClaims: UserAccessTokenClaims = {
    id: 6,
    username: 'john',
    roles: [ROLE.USER],
  };

  const registerInput = {
    username: 'jhon',
    name: 'Jhon doe',
    password: 'any password',
    roles: [ROLE.USER],
    isAccountDisabled: false,
    email: 'randomUser@random.com',
  };

  const currentDate = new Date().toString();

  const userOutput: UserOutput = {
    name: 'John doe',
    isAccountDisabled: false,
    email: 'randomUser@random.com',
    createdAt: currentDate,
    updatedAt: currentDate,
    ...accessTokenClaims,
  };

  const authToken: AuthTokenOutput = {
    accessToken: 'random_access_token',
    refreshToken: 'random_refresh_token',
  };

  const mockedUserService = {
    findById: jest.fn(),
    createUser: jest.fn(),
    validateUsernamePassword: jest.fn(),
  };

  const mockedJwtService = {
    sign: jest.fn(),
  };

  const mockedConfigService = { get: jest.fn() };

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('validateUser', () => {
    it('should success when username/password valid', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => userOutput);

      expect(await service.validateUser(ctx, 'jhon', 'somepass')).toEqual(
        userOutput,
      );
      expect(mockedUserService.validateUsernamePassword).toBeCalledWith(
        ctx,
        'jhon',
        'somepass',
      );
    });

    it('should fail when username/password invalid', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => {
          throw new UnauthorizedException();
        });

      await expect(
        service.validateUser(ctx, 'jhon', 'somepass'),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should fail when user account is disabled', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => ({ ...userOutput, isAccountDisabled: true }));

      await expect(
        service.validateUser(ctx, 'jhon', 'somepass'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return auth token for valid user', async () => {
      jest.spyOn(service, 'getAuthToken').mockImplementation(() => authToken);

      const result = service.login(ctx);

      expect(service.getAuthToken).toBeCalledWith(ctx, accessTokenClaims);
      expect(result).toEqual(authToken);
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      jest
        .spyOn(mockedUserService, 'createUser')
        .mockImplementation(() => userOutput);

      const result = await service.register(ctx, registerInput);

      expect(mockedUserService.createUser).toBeCalledWith(ctx, registerInput);
      expect(result).toEqual(userOutput);
    });
  });

  describe('refreshToken', () => {
    ctx.user = accessTokenClaims;

    it('should generate auth token', async () => {
      jest
        .spyOn(mockedUserService, 'findById')
        .mockImplementation(async () => userOutput);

      jest.spyOn(service, 'getAuthToken').mockImplementation(() => authToken);

      const result = await service.refreshToken(ctx);

      expect(service.getAuthToken).toBeCalledWith(ctx, userOutput);
      expect(result).toMatchObject(authToken);
    });

    it('should throw exception when user is not valid', async () => {
      jest
        .spyOn(mockedUserService, 'findById')
        .mockImplementation(async () => null);

      await expect(service.refreshToken(ctx)).rejects.toThrowError(
        'Invalid user id',
      );
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('getAuthToken', () => {
    const accessTokenExpiry = 100;
    const refreshTokenExpiry = 200;
    const user = { id: 5, username: 'username', roles: [ROLE.USER] };

    const subject = { sub: user.id };
    const payload = {
      username: user.username,
      sub: user.id,
      roles: [ROLE.USER],
    };

    beforeEach(() => {
      jest.spyOn(mockedConfigService, 'get').mockImplementation((key) => {
        let value = null;
        switch (key) {
          case 'jwt.accessTokenExpiresInSec':
            value = accessTokenExpiry;
            break;
          case 'jwt.refreshTokenExpiresInSec':
            value = refreshTokenExpiry;
            break;
        }
        return value;
      });

      jest
        .spyOn(mockedJwtService, 'sign')
        .mockImplementation(() => 'signed-response');
    });

    it('should generate access token with payload', () => {
      const result = service.getAuthToken(ctx, user);

      expect(mockedJwtService.sign).toBeCalledWith(
        { ...payload, ...subject },
        { expiresIn: accessTokenExpiry },
      );

      expect(result).toMatchObject({
        accessToken: 'signed-response',
      });
    });

    it('should generate refresh token with subject', () => {
      const result = service.getAuthToken(ctx, user);

      expect(mockedJwtService.sign).toBeCalledWith(subject, {
        expiresIn: refreshTokenExpiry,
      });

      expect(result).toMatchObject({
        refreshToken: 'signed-response',
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
