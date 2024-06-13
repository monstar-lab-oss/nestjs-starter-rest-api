import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

import { ROLE } from '../../auth/constants/role.constant';
import { User } from '../entities/user.entity';
import { UserRepository } from './user.repository';

describe('UserRepository', () => {
  let repository: UserRepository;

  let dataSource: {
    createEntityManager: jest.Mock;
  };

  beforeEach(async () => {
    dataSource = {
      createEntityManager: jest.fn(),
    };

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: DataSource,
          useValue: dataSource,
        },
      ],
    }).compile();

    repository = moduleRef.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get user by id', () => {
    const currentDate = new Date();
    it('should call findOne with correct id', () => {
      const id = 1;

      const expectedOutput: User = {
        id,
        name: 'Default User',
        username: 'default-user',
        password: 'random-password',
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'default-user@random.com',
        createdAt: currentDate,
        updatedAt: currentDate,
        articles: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedOutput);
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
    });

    it('should return user if found', async () => {
      const expectedOutput: User = {
        id: 1,
        name: 'Default User',
        username: 'default-user',
        password: 'random-password',
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'default-user@random.com',
        createdAt: currentDate,
        updatedAt: currentDate,
        articles: [],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedOutput);

      expect(await repository.getById(1)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when user not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      try {
        await repository.getById(1);
      } catch (error: any) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
