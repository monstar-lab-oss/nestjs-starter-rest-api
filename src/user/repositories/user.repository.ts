import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from '../entities/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getById(id: number): Promise<User> {
    const room = await this.findOne(id);
    if (!room) {
      throw new NotFoundException();
    }

    return room;
  }
}
