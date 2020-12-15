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
import { LoginInput } from '../dtos/auth-login-input.dto';
import { RegisterInput } from '../dtos/auth-register-input.dto';
import { RegisterOutput } from '../dtos/auth-register-output.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
  UserRefreshTokenClaims,
} from '../dtos/auth-token-output.dto';
import { RefreshTokenInput } from '../dtos/auth-refresh-token-input.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';

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
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async login(
    @Req() req: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: LoginInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.login(
      req.user as UserAccessTokenClaims,
    );
    return { data: authToken, meta: {} };
  }

  @Post('register')
  @ApiOperation({
    summary: 'User registration API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(RegisterOutput),
  })
  async registerLocal(
    @Body() input: RegisterInput,
  ): Promise<BaseApiResponse<RegisterOutput>> {
    const registeredUser = await this.authService.register(input);
    return { data: registeredUser, meta: {} };
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh access token API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(AuthTokenOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async refreshToken(
    @Req() req: Request,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body() credential: RefreshTokenInput,
  ): Promise<BaseApiResponse<AuthTokenOutput>> {
    const authToken = await this.authService.refreshToken(
      req.user as UserRefreshTokenClaims,
    );
    return { data: authToken, meta: {} };
  }
}
