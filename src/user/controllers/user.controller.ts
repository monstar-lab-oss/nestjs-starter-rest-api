import {
  Controller,
  Req,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { Request } from 'express';

import { UserService } from '../services/user.service';
import { GetMeOutput } from '../dtos/me.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  getMyProfile(@Req() req: Request): Promise<GetMeOutput> {
    return this.userService.findById(req.user['id']);
  }
}
