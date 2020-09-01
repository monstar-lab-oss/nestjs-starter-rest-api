import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { UserController } from './user.controller';
import { UserService } from './user.service';

import { User } from '../user/entities/user.entity';

import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
