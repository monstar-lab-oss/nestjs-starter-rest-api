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

describe('ArticleController', () => {
  let controller: ArticleController;
  const mockedArticleService = {
    getArticles: jest.fn(),
    getArticleById: jest.fn(),
    updateArticle: jest.fn(),
    createArticle: jest.fn(),
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
});
