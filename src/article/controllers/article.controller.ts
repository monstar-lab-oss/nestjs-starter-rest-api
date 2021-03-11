import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
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
  BaseApiErrorResponse,
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
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

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

  @Get()
  @ApiOperation({
    summary: 'Get articles as a list API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse([ArticleOutput]),
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getArticles(
    @ReqContext() ctx: RequestContext,
    @Query() query: PaginationParamsDto,
  ): Promise<BaseApiResponse<ArticleOutput[]>> {
    this.logger.log(ctx, `${this.getArticles.name} was called`);

    const { articles, count } = await this.articleService.getArticles(
      ctx,
      query.limit,
      query.offset,
    );

    return { data: articles, meta: { count } };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get article by id API',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(ArticleOutput),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async getArticle(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<BaseApiResponse<ArticleOutput>> {
    this.logger.log(ctx, `${this.getArticle.name} was called`);

    const article = await this.articleService.getArticleById(ctx, id);
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

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete article by id API',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @ReqContext() ctx: RequestContext,
    @Param('id') id: number,
  ): Promise<void> {
    this.logger.log(ctx, `${this.deleteArticle.name} was called`);

    return this.articleService.deleteArticle(ctx, id);
  }
}
