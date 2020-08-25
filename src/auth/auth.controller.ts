import {
  Controller,
  Req,
  Post,
  UseGuards,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Request } from 'express';

import { AuthService } from './auth.service';
import { RegisterInput } from './dto/register.dto';
import { LoginOutput } from './dto/login.dto';
import { User } from 'src/user/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request): Promise<LoginOutput> {
    return this.authService.login(req.user as User);
  }

  @Post('register')
  async registerLocal(@Body() input: RegisterInput): Promise<void> {
    return this.authService.register(input);
  }
}
