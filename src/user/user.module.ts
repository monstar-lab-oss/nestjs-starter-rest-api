import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { UserRepository } from './user.repository';

import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
