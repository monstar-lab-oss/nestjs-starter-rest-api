import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserService } from '../../user/services/user.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { LoginOutput } from '../dtos/auth-login-output.dto';
import { UserOutput } from 'src/user/dtos/user-output.dto';
import { AuthToken } from '../dtos/token.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockedUserIdentity = { id: 6 };
  const mockedUserInput = {
    username: 'jhon',
    name: 'Jhon doe',
    password: 'any password',
  };

  const mockedUser = {
    username: 'jhon',
    name: 'Jhon doe',
    ...mockedUserIdentity,
  };

  const mockedAuthToken = {
    access_token: 'mock_access_token',
    refresh_token: 'mock_access_token',
  };

  const mockedUserService = {
    setContext: jest.fn(),
    log: jest.fn(),
    findById: jest.fn(),
    createUser: jest.fn(),
    validateUsernamePassword: jest.fn(),
  };
  const mockedJwtService = {
    setContext: jest.fn(),
    log: jest.fn(),
    sign: jest.fn(),
  };
  const mockConfigService = { get: jest.fn() };

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

  describe('validateUser', () => {
    it('should success when username/ password valid', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => <UserOutput>mockedUser);

      expect(await service.validateUser('jhon', 'somepass')).toEqual(
        mockedUser,
      );
      expect(mockedUserService.validateUsernamePassword).toBeCalledWith(
        'jhon',
        'somepass',
      );
    });

    it('should fail when username/ password invalid', async () => {
      jest
        .spyOn(mockedUserService, 'validateUsernamePassword')
        .mockImplementation(() => {
          throw new UnauthorizedException();
        });

      await expect(
        service.validateUser('jhon', 'somepass'),
      ).rejects.toThrowError();
    });
  });

  describe('login', () => {
    it('should return auth token for valid user', async () => {
      jest
        .spyOn(service, 'getAuthToken')
        .mockImplementation(() => <LoginOutput>mockedAuthToken);

      const authToken = await service.login(<User>mockedUser);

      expect(service.getAuthToken).toBeCalledWith(mockedUser);
      expect(authToken).toEqual(mockedAuthToken);
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      jest
        .spyOn(mockedUserService, 'createUser')
        .mockImplementation(() => mockedUser);

      const user = await service.register(mockedUserInput);

      expect(mockedUserService.createUser).toBeCalledWith(mockedUserInput);
      expect(user).toEqual(mockedUser);
    });
  });

  describe('refreshToken', () => {
    it('should generate auth token', async () => {
      jest
        .spyOn(mockedUserService, 'findById')
        .mockImplementation(async () => <UserOutput>mockedUser);

      jest
        .spyOn(service, 'getAuthToken')
        .mockImplementation(() => <AuthToken>mockedAuthToken);

      const authToken = await service.refreshToken(mockedUserIdentity);

      expect(service.getAuthToken).toBeCalledWith(mockedUser);
      expect(authToken).toMatchObject(mockedAuthToken);
    });

    it('should throw exception when user is not valid', async () => {
      jest
        .spyOn(mockedUserService, 'findById')
        .mockImplementation(async () => null);

      await expect(
        service.refreshToken(mockedUserIdentity),
      ).rejects.toThrowError('Invalid user id');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('getAuthToken', () => {
    const mockedAccessTokenExpiry = 100;
    const mockedRefreshTokenExpiry = 200;
    const mockedUser = { id: 5, username: 'username' };

    const subject = { sub: mockedUser.id };
    const payload = { username: mockedUser.username, sub: mockedUser.id };

    beforeEach(() => {
      jest.spyOn(mockConfigService, 'get').mockImplementation((key) => {
        let value = null;
        switch (key) {
          case 'jwt.accessTokenExpiresInSec':
            value = mockedAccessTokenExpiry;
            break;
          case 'jwt.refreshTokenExpiresInSec':
            value = mockedRefreshTokenExpiry;
            break;
        }
        return value;
      });

      jest
        .spyOn(mockedJwtService, 'sign')
        .mockImplementation(() => 'mocked-signed-response');
    });

    it('should generate access token with payload', () => {
      const authToken = service.getAuthToken(mockedUser);

      expect(mockedJwtService.sign).toBeCalledWith(
        { ...payload, ...subject },
        { expiresIn: mockedAccessTokenExpiry },
      );

      expect(authToken).toMatchObject({
        access_token: 'mocked-signed-response',
      });
    });

    it('should generate refresh toekn with subject', () => {
      const authToken = service.getAuthToken(mockedUser);

      expect(mockedJwtService.sign).toBeCalledWith(subject, {
        expiresIn: mockedRefreshTokenExpiry,
      });

      expect(authToken).toMatchObject({
        refresh_token: 'mocked-signed-response',
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });
});
