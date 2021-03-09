import * as bcrypt from 'bcrypt';

import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ROLE } from '../../auth/constants/role.constant';
import { UpdateUserInput } from '../dtos/user-update-input.dto';
import { User } from '../entities/user.entity';
import { UserService } from './user.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';

describe('UserService', () => {
  let service: UserService;

  const mockedRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    getById: jest.fn(),
  };

  const user = {
    id: 6,
    username: 'jhon',
    name: 'Jhon doe',
    roles: [ROLE.USER],
  };

  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedRepository,
        },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('createUser', () => {
    beforeEach(() => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashed-password');

      jest
        .spyOn(mockedRepository, 'save')
        .mockImplementation(async (input) => ({ id: 6, ...input }));
    });

    it('should encrypt password before saving', async () => {
      const userInput = {
        name: user.name,
        username: user.username,
        password: 'plain-password',
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'randomUser@random.com',
      };

      await service.createUser(ctx, userInput);
      expect(bcrypt.hash).toBeCalledWith(userInput.password, 10);
    });

    it('should save user with encrypted password', async () => {
      const userInput = {
        name: user.name,
        username: user.username,
        password: 'plain-password',
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'randomUser@random.com',
      };

      await service.createUser(ctx, userInput);

      expect(mockedRepository.save).toBeCalledWith({
        name: user.name,
        username: user.username,
        password: 'hashed-password',
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'randomUser@random.com',
      });
    });

    it('should return serialized user', async () => {
      jest.spyOn(mockedRepository, 'save').mockImplementation(async (input) => {
        input.id = 6;
        return input;
      });

      const userInput = {
        name: user.name,
        username: user.username,
        password: 'plain-password',
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'randomUser@random.com',
      };

      const result = await service.createUser(ctx, userInput);

      expect(result).toEqual({
        id: user.id,
        name: userInput.name,
        username: userInput.username,
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'randomUser@random.com',
      });
      expect(result).not.toHaveProperty('password');
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('findById', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'findOne')
        .mockImplementation(async () => user);
    });

    it('should find user from DB using given id', async () => {
      await service.findById(ctx, user.id);
      expect(mockedRepository.findOne).toBeCalledWith(user.id);
    });

    it('should return serialized user', async () => {
      const result = await service.findById(ctx, user.id);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        username: user.username,
        roles: [ROLE.USER],
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('getUserById', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'getById')
        .mockImplementation(async () => user);
    });

    it('should find user from DB using given id', async () => {
      await service.getUserById(ctx, user.id);
      expect(mockedRepository.getById).toBeCalledWith(user.id);
    });

    it('should return serialized user', async () => {
      const result = await service.getUserById(ctx, user.id);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        username: user.username,
        roles: [ROLE.USER],
      });
    });

    it('throw not found exception if user is not found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.getUserById(ctx, 100);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('validateUsernamePassword', () => {
    it('should fail when username is invalid', async () => {
      jest
        .spyOn(mockedRepository, 'findOne')
        .mockImplementation(async () => null);

      await expect(
        service.validateUsernamePassword(ctx, 'jhon', 'password'),
      ).rejects.toThrowError();
    });

    it('should fail when password is invalid', async () => {
      jest
        .spyOn(mockedRepository, 'findOne')
        .mockImplementation(async () => user);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.validateUsernamePassword(ctx, 'jhon', 'password'),
      ).rejects.toThrowError();
    });

    it('should return  user  when credentials are valid', async () => {
      jest
        .spyOn(mockedRepository, 'findOne')
        .mockImplementation(async () => user);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.validateUsernamePassword(
        ctx,
        'jhon',
        'password',
      );

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        username: user.username,
        roles: [ROLE.USER],
      });
    });
  });

  describe('getUsers', () => {
    it('gets users as a list', async () => {
      const offset = 0;
      const limit = 0;
      mockedRepository.findAndCount.mockResolvedValue([[user], 1]);
      await service.getUsers(ctx, limit, offset);
      expect(mockedRepository.findAndCount).toHaveBeenCalled();
    });
  });

  describe('findByUsername', () => {
    beforeEach(() => {
      jest
        .spyOn(mockedRepository, 'findOne')
        .mockImplementation(async () => user);
    });

    it('should find user from DB using given username', async () => {
      await service.findByUsername(ctx, user.username);
      expect(mockedRepository.findOne).toBeCalledWith({
        username: user.username,
      });
    });

    it('should return serialized user', async () => {
      const result = await service.findByUsername(ctx, user.username);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        username: user.username,
        roles: [ROLE.USER],
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('updateUser', () => {
    it('should call repository.save with correct input', async () => {
      const userId = 1;
      const input: UpdateUserInput = {
        name: 'Test',
        password: 'updated-password',
      };

      const currentDate = new Date();

      const foundUser: User = {
        id: userId,
        name: 'Default User',
        username: 'default-user',
        password: 'random-password',
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'randomUser@random.com',
        createdAt: currentDate,
        updatedAt: currentDate,
        articles: [],
      };

      mockedRepository.getById.mockResolvedValue(foundUser);

      const expected: User = {
        id: 1,
        name: input.name,
        username: 'default-user',
        password: input.password,
        roles: [ROLE.USER],
        isAccountDisabled: false,
        email: 'randomUser@random.com',
        createdAt: currentDate,
        updatedAt: currentDate,
        articles: [],
      };

      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'updated-password');

      await service.updateUser(ctx, userId, input);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
    });

    it('should throw not found exception if user not found', async () => {
      const userId = 1;
      const input: UpdateUserInput = {
        name: 'Test',
        password: 'updated-password',
      };

      mockedRepository.getById.mockRejectedValue(new NotFoundException());

      try {
        await service.updateUser(ctx, userId, input);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
