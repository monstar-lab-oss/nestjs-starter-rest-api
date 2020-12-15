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
      username: 'e2etester@random.com',
      password: '12345678',
      roles: [ROLE.USER],
    };

    const loginInput: LoginInput = {
      username: 'e2etester@random.com',
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
    username: 'e2etester@random.com',
    roles: [ROLE.USER],
  };

  describe('get all users', () => {
    const usersOutput = [userOutput];

    it('returns all users', async () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(HttpStatus.OK)
        .expect({ data: usersOutput, meta: { count: 1 } });
    });
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
