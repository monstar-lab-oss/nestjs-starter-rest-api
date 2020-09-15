import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { hash } from 'bcrypt';

import { UserRepository } from './user.repository';

import { User } from './entities/user.entity';
import { AddUserInput, AddUserOutput } from './dto/add-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  async add(input: AddUserInput): Promise<AddUserOutput> {
    const user = new User();
    user.email = input.email;
    user.name = input.name;
    user.password = await hash(input.password, 10);

    const insertedUser = await this.userRepository.save(user);

    const output = new AddUserOutput();
    output.id = insertedUser.id;
    output.email = insertedUser.email;
    output.name = insertedUser.name;
    return output;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
}
