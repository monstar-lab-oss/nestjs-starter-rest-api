import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

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
import { AppLogger } from '../../shared/logger/logger.service';
import { ReqContext } from '../../shared/request-context/req-context.decorator';
import { RequestContext } from '../../shared/request-context/request-context.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(ArticleController.name);
  }

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
  async createArticle(
    @ReqContext() ctx: RequestContext,
    @Body() input: CreateArticleInput,
  ): Promise<BaseApiResponse<ArticleOutput>> {
    const article = await this.articleService.createArticle(ctx, input);
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
  async updateArticle(
    @ReqContext() ctx: RequestContext,
    @Param('id') articleId: number,
    @Body() input: UpdateArticleInput,
  ): Promise<BaseApiResponse<ArticleOutput>> {
    const article = await this.articleService.updateArticle(
      ctx,
      articleId,
      input,
    );
    return { data: article, meta: {} };
  }
}
