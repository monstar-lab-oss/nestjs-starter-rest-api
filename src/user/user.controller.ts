import {
  Controller,
  Req,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { UserService } from './user.service';
import { GetMeOutput } from './dto/me.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard())
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  getMyProfile(@Req() req: Request): Promise<GetMeOutput> {
    return this.userService.findById(req.user['id']);
  }
}
