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
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { UserService } from '../services/user.service';
import { UserOutput } from '../dtos/user-output.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @ApiOperation({
    summary: 'Get user me API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  async getMyProfile(
    @Req() req: Request,
  ): Promise<BaseApiResponse<UserOutput>> {
    const user = await this.userService.findById(req.user['id']);
    return { data: user, meta: {} };
  }
}
