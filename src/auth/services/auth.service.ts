import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';

import { UserService } from '../../user/services/user.service';
import { ROLE } from '../constants/role.constant';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
  UserRefreshTokenClaims,
} from '../dtos/auth-token-output.dto';
import { UserOutput } from '../../user/dtos/user-output.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserAccessTokenClaims> {
    // The userService will throw Unauthorized in case of invalid username/password.
    const user = await this.userService.validateUsernamePassword(
      username,
      pass,
    );

    // Prevent disabled users from logging in.
    if (user.isAccountDisabled) {
      throw new UnauthorizedException('This user account has been disabled');
    }

    return user;
  }

  login(accessTokenClaims: UserAccessTokenClaims): AuthTokenOutput {
    return this.getAuthToken(accessTokenClaims);
  }

  async register(input: RegisterInput): Promise<RegisterOutput> {
    // TODO : Setting default role as USER here. Will add option to change this later via ADMIN users.
    input.roles = [ROLE.USER];
    input.isAccountDisabled = false;

    const registeredUser = await this.userService.createUser(input);
    return plainToClass(RegisterOutput, registeredUser, {
      excludeExtraneousValues: true,
    });
  }

  async refreshToken(
    refreshTokenClaims: UserRefreshTokenClaims,
  ): Promise<AuthTokenOutput> {
    const user = await this.userService.findById(refreshTokenClaims.id);
    if (!user) {
      throw new UnauthorizedException('Invalid user id');
    }

    return this.getAuthToken(user);
  }

  getAuthToken(user: UserAccessTokenClaims | UserOutput): AuthTokenOutput {
    const subject = { sub: user.id };
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
    };
    return plainToClass(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }
}
