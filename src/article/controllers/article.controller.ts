import { Request } from 'express';

import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserAccessTokenClaims } from '../../auth/dtos/auth-token-output.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  BaseApiResponse,
  SwaggerBaseApiResponse,
} from '../../shared/dtos/base-api-response.dto';
import {
  CreateArticleInput,
  UpdateArticleInput,
} from '../dtos/article-input.dto';
import { ArticleOutput } from '../dtos/article-output.dto';
import { ArticleService } from '../services/article.service';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @ApiOperation({
    summary: 'Create article API',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SwaggerBaseApiResponse(ArticleOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createRoom(
    @Body() input: CreateArticleInput,
    @Req() req: Request,
  ): Promise<BaseApiResponse<ArticleOutput>> {
    const article = await this.articleService.createArticle(
      req.user as UserAccessTokenClaims,
      input,
    );
    return { data: article, meta: {} };
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update article API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ArticleOutput),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateRoom(
    @Param('id') articleId: number,
    @Body() input: UpdateArticleInput,
    @Req() req: Request,
  ): Promise<BaseApiResponse<ArticleOutput>> {
    const article = await this.articleService.updateArticle(
      req.user as UserAccessTokenClaims,
      articleId,
      input,
    );
    return { data: article, meta: {} };
  }
}
