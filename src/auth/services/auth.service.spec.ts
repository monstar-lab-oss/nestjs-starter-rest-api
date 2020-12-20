import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';

import { UserOutput } from '../../user/dtos/user-output.dto';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
  UserRefreshTokenClaims,
} from '../dtos/auth-token-output.dto';
import { ROLE } from '../constants/role.constant';

describe('AuthService', () => {
  let service: AuthService;

  const refreshTokenClaims: UserRefreshTokenClaims = { id: 6 };
  const accessTokenClaims: UserAccessTokenClaims = {
    id: 6,
    username: 'jhon',
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

  const userOutput: UserOutput = {
    username: 'jhon',
    name: 'Jhon doe',
    roles: [ROLE.USER],
    isAccountDisabled: false,
    email: 'randomUser@random.com',
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

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockedUserService },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();

    service = moduleRef.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should success when username/password valid', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => userOutput);

      expect(await service.validateUser('jhon', 'somepass')).toEqual(
        userOutput,
      );
      expect(mockedUserService.validateUsernamePassword).toBeCalledWith(
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
        service.validateUser('jhon', 'somepass'),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should fail when user account is disabled', async () => {
      const userOutput2 = { ...userOutput, isAccountDisabled: true };
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => userOutput2);

      await expect(
        service.validateUser('jhon', 'somepass'),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return auth token for valid user', async () => {
      jest.spyOn(service, 'getAuthToken').mockImplementation(() => authToken);

      const result = await service.login(accessTokenClaims);

      expect(service.getAuthToken).toBeCalledWith(accessTokenClaims);
      expect(result).toEqual(authToken);
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      jest
        .spyOn(mockedUserService, 'createUser')
        .mockImplementation(() => userOutput);

      const result = await service.register(registerInput);

      expect(mockedUserService.createUser).toBeCalledWith(registerInput);
      expect(result).toEqual(userOutput);
    });
  });

  describe('refreshToken', () => {
    it('should generate auth token', async () => {
      jest
        .spyOn(mockedUserService, 'findById')
        .mockImplementation(async () => userOutput);

      jest.spyOn(service, 'getAuthToken').mockImplementation(() => authToken);

      const result = await service.refreshToken(refreshTokenClaims);

      expect(service.getAuthToken).toBeCalledWith(userOutput);
      expect(result).toMatchObject(authToken);
    });

    it('should throw exception when user is not valid', async () => {
      jest
        .spyOn(mockedUserService, 'findById')
        .mockImplementation(async () => null);

      await expect(
        service.refreshToken(refreshTokenClaims),
      ).rejects.toThrowError('Invalid user id');
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
      const result = service.getAuthToken(user);

      expect(mockedJwtService.sign).toBeCalledWith(
        { ...payload, ...subject },
        { expiresIn: accessTokenExpiry },
      );

      expect(result).toMatchObject({
        accessToken: 'signed-response',
      });
    });

    it('should generate refresh token with subject', () => {
      const result = service.getAuthToken(user);

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
