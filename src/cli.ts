import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ROLE } from './auth/constants/role.constant';
import { RequestContext } from './shared/request-context/request-context.dto';
import { CreateUserInput } from './user/dtos/user-create-input.dto';
import { UserService } from './user/services/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configService = app.get(ConfigService);
  const defaultAdminUserPassword = configService.get<string>(
    'defaultAdminUserPassword',
  )!;

  const userService = app.get(UserService);

  const defaultAdmin: CreateUserInput = {
    name: 'Default Admin User',
    username: 'default-admin',
    password: defaultAdminUserPassword,
    roles: [ROLE.ADMIN],
    isAccountDisabled: false,
    email: 'default-admin@example.com',
  };

  const ctx = new RequestContext();

  // Create the default admin user if it doesn't already exist.
  const user = await userService.findByUsername(ctx, defaultAdmin.username);
  if (!user) {
    await userService.createUser(ctx, defaultAdmin);
  }

  await app.close();
}
bootstrap();
