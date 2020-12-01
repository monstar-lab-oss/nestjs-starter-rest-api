import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { UserRepository } from '../repositories/user.repository';

import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dtos/user-create-input.dto';
import { UserOutput } from '../dtos/user-output.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private repository: UserRepository) {}

  async createUser(input: CreateUserInput): Promise<UserOutput> {
    const user = plainToClass(User, input);

    user.password = await hash(input.password, 10);

    await this.repository.save(user);

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async validateUsernamePassword(
    username: string,
    pass: string,
  ): Promise<UserOutput> {
    const user = await this.repository.findOne({ username });
    if (!user) throw new UnauthorizedException();

    const match = await compare(pass, user.password);
    if (!match) throw new UnauthorizedException();

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }

  async findById(id: number): Promise<UserOutput> {
    const user = await this.repository.findOne(id);

    return plainToClass(UserOutput, user, {
      excludeExtraneousValues: true,
    });
  }
}
