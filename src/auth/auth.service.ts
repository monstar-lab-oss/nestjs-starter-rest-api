import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterInput, RegisterOutput } from './dto/register.dto';
import { LoginOutput } from './dto/login.dto';
import { RefreshTokenInput } from './dto/refresh-token.dto';

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
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign({ sub: user.id }),
    };
  }

  async register(input: RegisterInput): Promise<RegisterOutput> {
    return this.userService.add(input);
  }

  async refreshToken(input: RefreshTokenInput): Promise<LoginOutput> {
    const { refreshToken } = input;
    const tokenObj = await this.jwtService.decode(refreshToken);

    // ToDo: token type check
    // ToDo: User activation status check
    const userId = tokenObj.sub;
    const user = await this.userService.findById(userId);
    const payload = { email: user.email, sub: user.id };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign({ sub: user.id }),
    };
  }
}
