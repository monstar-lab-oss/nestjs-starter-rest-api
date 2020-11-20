import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dtos/user-create-input.dto';
import { UserOutput } from '../dtos/user-output.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(input: CreateUserInput): Promise<UserOutput> {
    const user = new User();
    user.username = input.username;
    user.name = input.name;
    user.password = await hash(input.password, 10);

    const savedUser = await this.userRepository.save(user);

    return plainToClass(UserOutput, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async validateUsernamePassword(
    username: string,
    pass: string,
  ): Promise<UserOutput> {
    const user = await this.userRepository.findOne({ username });
    if (!user) throw new UnauthorizedException();

    const match = await compare(pass, user.password);
    if (!match) throw new UnauthorizedException();

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number): Promise<UserOutput> {
    const user = await this.userRepository.findOne(id);

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }
}
