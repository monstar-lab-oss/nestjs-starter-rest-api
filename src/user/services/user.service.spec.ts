import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockedUserRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  const user = {
    id: 6,
    username: 'jhon',
    name: 'Jhon doe',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockedUserRepository,
        },
      ],
    }).compile();

    service = moduleRef.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    beforeEach(() => {
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashed-password');

      jest
        .spyOn(mockedUserRepository, 'save')
        .mockImplementation(async (input) => ({ id: 6, ...input }));
    });

    it('should encrypt password before saving', async () => {
      const userInput = {
        name: user.name,
        username: user.username,
        password: 'plain-password',
      };

      await service.createUser(userInput);
      expect(bcrypt.hash).toBeCalledWith(userInput.password, 10);
    });

    it('should save user with encrypted password', async () => {
      const userInput = {
        name: user.name,
        username: user.username,
        password: 'plain-password',
      };

      await service.createUser(userInput);

      expect(mockedUserRepository.save).toBeCalledWith({
        name: user.name,
        username: user.username,
        password: 'hashed-password',
      });
    });

    it('should return serialized user', async () => {
      jest
        .spyOn(mockedUserRepository, 'save')
        .mockImplementation(async (input) => {
          input.id = 6;
          return input;
        });

      const userInput = {
        name: user.name,
        username: user.username,
        password: 'plain-password',
      };

      const result = await service.createUser(userInput);

      expect(result).toEqual({
        id: user.id,
        name: userInput.name,
        username: userInput.username,
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
        .spyOn(mockedUserRepository, 'findOne')
        .mockImplementation(async () => user);
    });

    it('should find user from DB using given id', async () => {
      await service.findById(user.id);
      expect(mockedUserRepository.findOne).toBeCalledWith(user.id);
    });

    it('should return serialized user', async () => {
      const result = await service.findById(user.id);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        username: user.username,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
  });

  describe('validateUsernamePassword', () => {
    it('should fail when username is invalid', async () => {
      jest
        .spyOn(mockedUserRepository, 'findOne')
        .mockImplementation(async () => null);

      await expect(
        service.validateUsernamePassword('jhon', 'password'),
      ).rejects.toThrowError();
    });

    it('should fail when password is invalid', async () => {
      jest
        .spyOn(mockedUserRepository, 'findOne')
        .mockImplementation(async () => user);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(
        service.validateUsernamePassword('jhon', 'password'),
      ).rejects.toThrowError();
    });

    it('should return  user  when credentials are valid', async () => {
      jest
        .spyOn(mockedUserRepository, 'findOne')
        .mockImplementation(async () => user);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.validateUsernamePassword('jhon', 'password');

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        username: user.username,
      });
    });
  });

  describe('getUsers', () => {
    it('gets users as a list', async () => {
      const offset = 0;
      const limit = 0;
      mockedUserRepository.findAndCount.mockResolvedValue([[user], 1]);
      await service.getUsers(limit, offset);
      expect(mockedUserRepository.findAndCount).toHaveBeenCalled();
    });
  });
});
