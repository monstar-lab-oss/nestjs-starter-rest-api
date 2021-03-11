import { Test, TestingModule } from '@nestjs/testing';

import { ArticleController } from './article.controller';

import { ArticleService } from '../services/article.service';
import { AppLogger } from '../../shared/logger/logger.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import {
  CreateArticleInput,
  UpdateArticleInput,
} from '../dtos/article-input.dto';
import { ArticleOutput } from '../dtos/article-output.dto';
import { User } from '../../user/entities/user.entity';
import { PaginationParamsDto } from '../../shared/dtos/pagination-params.dto';

describe('ArticleController', () => {
  let controller: ArticleController;
  const mockedArticleService = {
    getArticles: jest.fn(),
    getArticleById: jest.fn(),
    updateArticle: jest.fn(),
    createArticle: jest.fn(),
    deleteArticle: jest.fn(),
  };
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        { provide: ArticleService, useValue: mockedArticleService },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    controller = moduleRef.get<ArticleController>(ArticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create article', () => {
    let input: CreateArticleInput;

    beforeEach(() => {
      input = {
        title: 'Test',
        post: 'Hello, world!',
      };
    });

    it('should call articleService.createArticle with correct input', () => {
      controller.createArticle(ctx, input);
      expect(mockedArticleService.createArticle).toHaveBeenCalledWith(
        ctx,
        input,
      );
    });

    it('should return data which includes info from articleService.createArticle', async () => {
      const currentDate = new Date();
      const expectedOutput: ArticleOutput = {
        id: 1,
        title: 'Test',
        post: 'Hello, world!',
        author: new User(),
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedArticleService.createArticle.mockResolvedValue(expectedOutput);

      expect(await controller.createArticle(ctx, input)).toEqual({
        data: expectedOutput,
        meta: {},
      });
    });

    it('should throw error when articleService.createArticle throws an error', async () => {
      mockedArticleService.createArticle.mockRejectedValue({
        message: 'rejected',
      });

      try {
        await controller.createArticle(ctx, input);
      } catch (error) {
        expect(error.message).toEqual('rejected');
      }
    });
  });

  describe('Get articles', () => {
    it('should call service method getArticles', () => {
      mockedArticleService.getArticles.mockResolvedValue({
        articles: [],
        meta: null,
      });
      const queryParams: PaginationParamsDto = {
        limit: 100,
        offset: 0,
      };

      controller.getArticles(ctx, queryParams);
      expect(mockedArticleService.getArticles).toHaveBeenCalledWith(
        ctx,
        queryParams.limit,
        queryParams.offset,
      );
    });
  });

  describe('Get article by id', () => {
    it('should call service method getArticleById with id', () => {
      const id = 1;

      controller.getArticle(ctx, id);
      expect(mockedArticleService.getArticleById).toHaveBeenCalledWith(ctx, id);
    });
  });

  describe('Update article', () => {
    it('should call articleService.updateArticle with correct parameters', () => {
      const articleId = 1;
      const input: UpdateArticleInput = {
        title: 'Test',
        post: 'Hello, world!',
      };
      controller.updateArticle(ctx, articleId, input);
      expect(mockedArticleService.updateArticle).toHaveBeenCalledWith(
        ctx,
        articleId,
        input,
      );
    });
  });

  describe('Delete article', () => {
    it('should call articleService.deleteArticle with correct id', () => {
      const articleId = 1;
      controller.deleteArticle(ctx, articleId);
      expect(mockedArticleService.deleteArticle).toHaveBeenCalledWith(
        ctx,
        articleId,
      );
    });
  });
});
