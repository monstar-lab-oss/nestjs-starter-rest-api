import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { ROLE } from '../../src/auth/constants/role.constant';
import { LoginInput } from '../../src/auth/dtos/auth-login-input.dto';
import { RefreshTokenInput } from '../../src/auth/dtos/auth-refresh-token-input.dto';
import { RegisterInput } from '../../src/auth/dtos/auth-register-input.dto';
import { AuthTokenOutput } from '../../src/auth/dtos/auth-token-output.dto';
import { AppModule } from './../../src/app.module';
import {
  closeDBAfterTest,
  createDBEntities,
  resetDBBeforeTest,
  seedAdminUser,
} from './../test-utils';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authTokenForAdmin: AuthTokenOutput;

  beforeAll(async () => {
    await resetDBBeforeTest();
    await createDBEntities();

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    const adminUserTokens = await seedAdminUser(app);
    authTokenForAdmin = adminUserTokens.authTokenForAdmin;
  });

  describe('Admin User Auth Tokens', () => {
    it('should have Auth Tokens for admin', () => {
      expect(authTokenForAdmin).toHaveProperty('accessToken');
      expect(authTokenForAdmin).toHaveProperty('refreshToken');
    });
  });

  describe('Register a new user', () => {
    const registerInput: RegisterInput = {
      name: 'e2etester',
      username: 'e2etester',
      password: '12345678',
      roles: [ROLE.USER],
      isAccountDisabled: false,
      email: 'e2etester@random.com',
    };

    const registerOutput = {
      id: 2,
      name: 'e2etester',
      username: 'e2etester',
      roles: [ROLE.USER],
      isAccountDisabled: false,
      email: 'e2etester@random.com',
    };

    it('should successfully register a new user', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerInput)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const resp = res.body;
          expect(resp.data).toEqual(expect.objectContaining(registerOutput));
        });
    });

    it('should fail to register without Input DTO', async () => {
      await request(app.getHttpServer())
        .post('/auth/register')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail to register with incorrect username format', async () => {
      const invalidRegisterInput = { ...registerInput, username: 12345 as any };
      await request(app.getHttpServer())
        .post('/auth/register')
        .send(invalidRegisterInput)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Login the registered user', () => {
    const loginInput: LoginInput = {
      username: 'e2etester',
      password: '12345678',
    };

    it('should successfully login the user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const token = res.body.data;
          expect(token).toHaveProperty('accessToken');
          expect(token).toHaveProperty('refreshToken');
        });
    });

    it('should fail to login with wrong credentials', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...loginInput, password: 'wrong-pass' })
        .expect(HttpStatus.UNAUTHORIZED);
    });

    // TODO: Should fail when isAccountDisabled is set to true.
  });

  describe('Refreshing JWT token', () => {
    const loginInput: LoginInput = {
      username: 'e2etester',
      password: '12345678',
    };

    it('should successfully get new auth token using refresh token', async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput);

      const token: AuthTokenOutput = loginResponse.body.data;
      const refreshTokenInput: RefreshTokenInput = {
        refreshToken: token.refreshToken,
      };

      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send(refreshTokenInput)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const data = res.body.data;
          expect(data).toHaveProperty('accessToken');
          expect(data).toHaveProperty('refreshToken');
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
