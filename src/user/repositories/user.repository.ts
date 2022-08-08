import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

export class UserRepository extends Repository<User> {
  async getById(id: number): Promise<User> {
    const user = await this.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
