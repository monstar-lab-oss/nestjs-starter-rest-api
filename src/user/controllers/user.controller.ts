import {
  Controller,
  Req,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
} from '@nestjs/common';

import { Request } from 'express';

import { UserService } from '../services/user.service';
import { UserOutput } from '../dtos/user-output.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @ApiOperation({ summary: 'Get user me API' })
  @ApiResponse({ status: HttpStatus.OK, type: UserOutput })
  getMyProfile(@Req() req: Request): Promise<UserOutput> {
    return this.userService.findById(req.user['id']);
  }
}
