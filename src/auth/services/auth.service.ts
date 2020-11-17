import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../../user/services/user.service';
import { User } from '../../user/entities/user.entity';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import { LoginOutput } from '../dtos/auth-login-output.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    // The userService will throw Unauthorized in case of invalid username/password.
    const user = await this.userService.validateUsernamePassword(
      username,
      pass,
    );

    return user;
  }

  login(user: User): LoginOutput {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(input: RegisterInput): Promise<RegisterOutput> {
    return this.userService.createUser(input);
  }
}
