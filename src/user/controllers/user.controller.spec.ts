import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';

import { UserService } from '../services/user.service';

import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { UserOutput } from '../dtos/user-output.dto';
import { ROLE } from '../../auth/constants/role.constant';
import { UpdateUserInput } from '../dtos/user-update-input.dto';

describe('UserController', () => {
  let controller: UserController;
  const mockedUserService = {
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockedUserService }],
    }).compile();

    controller = moduleRef.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get Users as a list', () => {
    it('Calls getUsers function', () => {
      const query: PaginationParamsDto = {
        offset: 0,
        limit: 0,
      };
      mockedUserService.getUsers.mockResolvedValue({ users: [], count: 0 });
      controller.getUsers(query);
      expect(mockedUserService.getUsers).toHaveBeenCalled();
    });
  });

  const expectedOutput: UserOutput = {
    id: 1,
    username: 'default-user',
    name: 'default-name',
    roles: [ROLE.USER],
  };

  describe('Get user by id', () => {
    it('should call service method getUserById with id', async () => {
      const id = 1;
      mockedUserService.getUserById.mockResolvedValue(expectedOutput);

      expect(await controller.getUser(id)).toEqual({
        data: expectedOutput,
        meta: {},
      });
      expect(mockedUserService.getUserById).toHaveBeenCalledWith(id);
    });
  });

  describe('Update user by id', () => {
    it('Update user by id and returns user', async () => {
      const input = new UpdateUserInput();
      mockedUserService.updateUser.mockResolvedValue(expectedOutput);

      expect(await controller.updateUser(1, input)).toEqual({
        data: expectedOutput,
        meta: {},
      });
    });
  });
});
