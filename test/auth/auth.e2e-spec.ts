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

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});
