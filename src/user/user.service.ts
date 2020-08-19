import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { hash } from 'bcrypt';

import { User } from './entities/user.entity';
import { AddUserInput } from './dto/add-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async add(input: AddUserInput): Promise<void> {
    const user = new User();
    user.email = input.email;
    user.name = input.name;
    user.password = await hash(input.password, 10);

    await this.userRepository.insert(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ email });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }
}
