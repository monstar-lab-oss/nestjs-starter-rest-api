import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';

import { UserService } from '../services/user.service';

import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

describe('UserController', () => {
  let controller: UserController;
  const mockedUserService = { getUsers: jest.fn() };

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
});
