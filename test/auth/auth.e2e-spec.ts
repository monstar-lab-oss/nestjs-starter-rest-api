import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../../src/app.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';

import {
  closeDBAfterTest,
  createDBEntities,
  resetDBBeforeTest,
} from './../test-utils';
import { RegisterInput } from 'src/auth/dtos/auth-register-input.dto';
import { RegisterOutput } from 'src/auth/dtos/auth-register-output.dto';
import { LoginInput } from 'src/auth/dtos/auth-login-input.dto';
import { RefreshTokenInput } from 'src/auth/dtos/auth-refresh-token-input.dto';
import { LoginOutput } from 'src/auth/dtos/auth-login-output.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    await resetDBBeforeTest();
    await createDBEntities();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('register a new user', () => {
    const registerInput: RegisterInput = {
      name: 'e2etester',
      username: 'e2etester@random.com',
      password: '12345678',
    };
    const registerOutput: RegisterOutput = {
      id: 1,
      name: 'e2etester',
      username: 'e2etester@random.com',
    };

    it('succesfully register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerInput)
        .expect(HttpStatus.CREATED)
        .expect(registerOutput);
    });

    it('register fails without Input DTO', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('register fails when incorrect username format', () => {
      registerInput.username = 12345 as any;
      return request(app.getHttpServer())
        .post('/auth/register')
        .expect(HttpStatus.BAD_REQUEST)
        .send(registerInput)
        .expect((res) => {
          const resp = res.body;
          expect(resp.error.message.message).toContain(
            'username must be a string',
          );
        });
    });
  });

  describe('login the registered user', () => {
    const loginInput: LoginInput = {
      username: 'e2etester@random.com',
      password: '12345678',
    };

    it('should succesfully login the user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const token = res.body;
          expect(token).toHaveProperty('access_token');
          expect(token).toHaveProperty('refresh_token');
        });
    });

    it('should failed to login with wrong credential', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...loginInput, password: 'wrong-passs' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('login the registered user', () => {
    const loginInput: LoginInput = {
      username: 'e2etester@random.com',
      password: '12345678',
    };

    it('should succesfully login the user', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(HttpStatus.OK)
        .expect((res) => {
          const token = res.body;
          expect(token).toHaveProperty('access_token');
          expect(token).toHaveProperty('refresh_token');
        });
    });

    it('should failed to login with wrong credential', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...loginInput, password: 'wrong-passs' })
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('refreshing jwt token', () => {
    const loginInput: LoginInput = {
      username: 'e2etester@random.com',
      password: '12345678',
    };

    it('should succesfully get new auth token using refresh token', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .then((res) => {
          const token: LoginOutput = res.body;
          const refreshTokenInput: RefreshTokenInput = {
            refresh_token: token.refresh_token,
          };

          return request(app.getHttpServer())
            .post('/auth/refresh-token')
            .send(refreshTokenInput)
            .expect(HttpStatus.OK)
            .expect((res) => {
              const token = res.body;
              expect(token).toHaveProperty('access_token');
              expect(token).toHaveProperty('refresh_token');
            });
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
