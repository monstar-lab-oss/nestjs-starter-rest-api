import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';

import { UserService } from '../user/user.service';

import { User } from 'src/user/entities/user.entity';
import { RegisterInput } from './dto/register.dto';
import { LoginOutput } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(username);
    if (!user) return null;

    const match = await compare(pass, user.password);
    if (!match) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  login(user: User): LoginOutput {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(input: RegisterInput): Promise<void> {
    await this.userService.add(input);
  }
}
