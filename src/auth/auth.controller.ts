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

import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { LoginOutput, LoginInput } from './dto/login.dto';
import { RegisterInput, RegisterOutput } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

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
}
