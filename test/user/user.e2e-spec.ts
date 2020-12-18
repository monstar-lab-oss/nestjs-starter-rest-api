import { Test } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../../src/app.module';

import {
  resetDBBeforeTest,
  createDBEntities,
  closeDBAfterTest,
} from '../test-utils';
import { RegisterInput } from '../../src/auth/dtos/auth-register-input.dto';
import { UserOutput } from '../../src/user/dtos/user-output.dto';
import { LoginInput } from '../../src/auth/dtos/auth-login-input.dto';
import { ROLE } from '../../src/auth/constants/role.constant';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    await resetDBBeforeTest();
    await createDBEntities();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Create a User
    const registerInput: RegisterInput = {
      name: 'e2etester',
      username: 'e2etester',
      password: '12345678',
      roles: [ROLE.USER],
    };

    const loginInput: LoginInput = {
      username: 'e2etester',
      password: '12345678',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerInput)
      .expect(HttpStatus.CREATED);

    const tokenResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginInput)
      .expect(HttpStatus.OK);

    accessToken = tokenResponse.body.data.accessToken;
  });

  describe('Get user me', () => {
    it('gets user me', async () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK);
    });

    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('Unauthorized error when BearerToken is wrong', async () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer ' + 'abcd')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  const userOutput: UserOutput = {
    id: 1,
    name: 'e2etester',
    username: 'e2etester',
    roles: [ROLE.USER],
  };

  describe('get all users', () => {
    const expectedOutput = [userOutput];

    it('returns all users', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect({ data: expectedOutput, meta: { count: 1 } });
    });
  });

  describe('get a user by Id', () => {
    const expectedOutput = userOutput;

    it('should get a user by Id', async () => {
      return request(app.getHttpServer())
        .get('/users/1')
        .expect(HttpStatus.OK)
        .expect({ data: expectedOutput, meta: {} });
    });

    it('throws NOT_FOUND when user doesnt exist', () => {
      return request(app.getHttpServer())
        .get('/users/99')
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  const updateUserInput = {
    name: 'New e2etestername',
    password: '12345678aA12',
  };

  const expectedOutput: UserOutput = {
    id: 1,
    name: 'New e2etestername',
    username: 'e2etester',
    roles: [ROLE.USER],
  };

  describe('update a user', () => {
    it('successfully updates a user', async () => {
      return request(app.getHttpServer())
        .patch('/users/1')
        .send(updateUserInput)
        .expect(HttpStatus.OK)
        .expect({ data: expectedOutput, meta: {} });
    });

    it('throws NOT_FOUND when user doesnt exist', () => {
      return request(app.getHttpServer())
        .patch('/users/99')
        .expect(HttpStatus.NOT_FOUND);
    });

    it('update fails when incorrect password type', () => {
      updateUserInput.password = 12345 as any;
      return request(app.getHttpServer())
        .patch('/users/1')
        .expect(HttpStatus.BAD_REQUEST)
        .send(updateUserInput)
        .expect((res) => {
          const resp = res.body;

          expect(resp.error.details.message).toContain(
            'password must be a string',
          );
        });
    });
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
