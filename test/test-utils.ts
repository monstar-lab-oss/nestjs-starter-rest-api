import { createConnection, getConnection } from 'typeorm';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { CreateUserInput } from '../src/user/dtos/user-create-input.dto';
import { ROLE } from '../src/auth/constants/role.constant';
import { LoginInput } from 'src/auth/dtos/auth-login-input.dto';
import { AuthTokenOutput } from 'src/auth/dtos/auth-token-output.dto';

const TEST_DB_CONNECTION_NAME = 'e2e_test_connection';
export const TEST_DB_NAME = 'e2e_test_db';

export const resetDBBeforeTest = async (): Promise<void> => {
  // This overwrites the DB_NAME used in the SharedModule's TypeORM init.
  // All the tests will run against the e2e db due to this overwrite.
  process.env.DB_NAME = TEST_DB_NAME;

  console.log(`Dropping ${TEST_DB_NAME} database and recreating it`);
  const connection = await createConnection({
    name: TEST_DB_CONNECTION_NAME,
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'example',
  });

  await connection.query(`drop database if exists ${TEST_DB_NAME}`);
  await connection.query(`create database ${TEST_DB_NAME}`);

  await connection.close();
};

export const createDBEntities = async (): Promise<void> => {
  console.log(`Creating entities in ${TEST_DB_NAME} database`);
  await createConnection({
    name: TEST_DB_CONNECTION_NAME,
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'example',
    database: TEST_DB_NAME,
    entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
    synchronize: true,
  });
};

export const createAdminUser = async (
  app: INestApplication,
): Promise<AuthTokenOutput> => {
  const defaultAdmin: CreateUserInput = {
    name: 'Default Admin User',
    username: 'default-admin',
    password: 'default-admin-password',
    roles: [ROLE.ADMIN],
    isAccountDisabled: false,
    email: 'default-admin@example.com',
  };

  // Creating Admin User
  await request(app.getHttpServer())
    .post('/auth/register')
    .send(defaultAdmin)
    .expect(HttpStatus.CREATED);

  const loginInput: LoginInput = {
    username: 'default-admin',
    password: 'default-admin-password',
  };

  // Logging in Admin User to get AuthToken
  const loginResponse = await request(app.getHttpServer())
    .post('/auth/login')
    .send(loginInput)
    .expect(HttpStatus.OK);

  const authToken: AuthTokenOutput = loginResponse.body.data;

  return authToken;
};

export const closeDBAfterTest = async (): Promise<void> => {
  console.log(`Closing connection to ${TEST_DB_NAME} database`);
  const connection = await getConnection(TEST_DB_CONNECTION_NAME);

  await connection.close();
};
