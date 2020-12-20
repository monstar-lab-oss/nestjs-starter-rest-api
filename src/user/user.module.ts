import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { JwtAuthStrategy } from '../auth/strategies/jwt-auth.strategy';
import { UserAclService } from './services/user-acl.service';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService, JwtAuthStrategy, UserAclService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
