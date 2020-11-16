import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { validateOrReject } from 'class-validator';
import { RegisterInput } from '../dtos/register.dto';
import { LoginInput } from '../dtos/login.dto';

describe('AuthController', () => {
  let moduleRef: TestingModule;
  let authController: AuthController;
  const mockedAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockedAuthService }],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('registerLocal', () => {
    it('should register new user', async () => {
      const registerInputDto = new RegisterInput();
      registerInputDto.name = 'John Doe';
      registerInputDto.email = 'john@example.com';
      registerInputDto.password = '123123';
      await validateOrReject(registerInputDto);

      jest
        .spyOn(mockedAuthService, 'register')
        .mockImplementation(async () => null);

      expect(await authController.registerLocal(registerInputDto)).toBe(null);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      const loginInputDto = new LoginInput();
      loginInputDto.email = 'john@example.com';
      loginInputDto.password = '123123';
      await validateOrReject(loginInputDto);

      const reqObject: any = {};

      jest
        .spyOn(mockedAuthService, 'login')
        .mockImplementation(async () => null);

      expect(await authController.login(reqObject, loginInputDto)).toBe(null);
    });
  });
});
