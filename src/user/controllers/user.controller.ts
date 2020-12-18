import {
  Controller,
  Req,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  Query,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { UserService } from '../services/user.service';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import {
  BaseApiErrorResponse,
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';
import { UserOutput } from '../dtos/user-output.dto';
import { ROLE } from '../../auth/constants/role.constant';

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

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @ApiOperation({
    summary: 'Get users as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([UserOutput]),
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    type: BaseApiErrorResponse,
  })
  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.USER)
  @UseGuards(JwtAuthGuard)
  async getUsers(
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<UserOutput[]>> {
    const { users, count } = await this.userService.getUsers(
      query.limit,
      query.offset,
    );

    return { data: users, meta: { count } };
  }

  // TODO: ADD RoleGuard
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  async getUser(@Param('id') id: number): Promise<BaseApiResponse<UserOutput>> {
    const user = await this.userService.getUserById(id);
    return { data: user, meta: {} };
  }
}
