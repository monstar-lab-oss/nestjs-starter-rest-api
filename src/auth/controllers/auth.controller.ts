import {
  Req,
  Post,
  Body,
  UseGuards,
  Controller,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';
import { User } from '../../user/entities/user.entity';
import { LoginInput } from '../dtos/auth-login-input.dto';
import { LoginOutput } from '../dtos/auth-login-output.dto';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { RefreshTokenOutput } from '../dtos/auth-refresh-token-output.dto';
import { TokenUserIdentity } from '../dtos/token.dto';
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
    type: LoginOutput,
  })
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Req() req: Request,
    @Body() credential: LoginInput,
  ): Promise<LoginOutput> {
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
    type: RefreshTokenOutput,
  })
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @Req() req: Request,
    @Body() credential: RefreshTokenInput,
  ): Promise<RefreshTokenOutput> {
    return this.authService.refreshToken(req.user as TokenUserIdentity);
  }
}
