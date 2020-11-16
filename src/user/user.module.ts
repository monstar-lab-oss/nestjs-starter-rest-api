import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SharedModule } from '../shared/shared.module';

import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

import { UserRepository } from './repositories/user.repository';

import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [UserService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
