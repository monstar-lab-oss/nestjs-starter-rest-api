import {
  Req,
  Post,
  Body,
  UseGuards,
  Controller,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { User } from '../../user/entities/user.entity';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import {
  AuthTokenOutput,
  TokenUserIdentity,
} from '../dtos/auth-token-output.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'User login API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthTokenOutput,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Req() req: Request,
    @Body() credential: LoginInput,
  ): Promise<AuthTokenOutput> {
    return this.authService.login(req.user as User);
  }

  @Post('register')
  @ApiOperation({
    summary: 'User registration API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: RegisterOutput,
  })
  async registerLocal(@Body() input: RegisterInput): Promise<RegisterOutput> {
    return this.authService.register(input);
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AuthTokenOutput,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @Req() req: Request,
    @Body() credential: RefreshTokenInput,
  ): Promise<AuthTokenOutput> {
    return this.authService.refreshToken(req.user as TokenUserIdentity);
  }
}
