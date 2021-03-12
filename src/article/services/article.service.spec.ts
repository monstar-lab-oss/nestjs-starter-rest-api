import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ROLE } from '../../auth/constants/role.constant';
import { UserOutput } from '../../user/dtos/user-output.dto';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import {
  CreateArticleInput,
  UpdateArticleInput,
} from '../dtos/article-input.dto';
import { ArticleRepository } from '../repositories/article.repository';
import { ArticleAclService } from './article-acl.service';
import { ArticleService } from './article.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';
import { AppLogger } from '../../shared/logger/logger.service';
import { ArticleOutput } from '../dtos/article-output.dto';
import { Article } from '../entities/article.entity';

describe('ArticleService', () => {
  let service: ArticleService;
  let mockedRepository: any;
  let mockedUserService: any;
  const mockedLogger = { setContext: jest.fn(), log: jest.fn() };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: ArticleRepository,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            getById: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        { provide: ArticleAclService, useValue: new ArticleAclService() },
        { provide: AppLogger, useValue: mockedLogger },
      ],
    }).compile();

    service = moduleRef.get<ArticleService>(ArticleService);
    mockedRepository = moduleRef.get(ArticleRepository);
    mockedUserService = moduleRef.get(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const ctx = new RequestContext();

  describe('Create Article', () => {
    it('should get user from user claims user id', () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.USER],
        username: 'testuser',
      };

      service.createArticle(ctx, new CreateArticleInput());
      expect(mockedUserService.getUserById).toHaveBeenCalledWith(ctx, 1);
    });

    it('should call repository save with proper article input and return proper output', async () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.USER],
        username: 'testuser',
      };

      const articleInput: CreateArticleInput = {
        title: 'Test',
        post: 'Hello, world!',
      };

      const author = new UserOutput();
      mockedUserService.getUserById.mockResolvedValue(author);
      const expected = {
        title: 'Test',
        post: 'Hello, world!',
        author,
      };

      const expectedOutput = {
        id: 1,
        title: 'Test',
        post: 'Hello, world!',
        author: new User(),
      };
      mockedRepository.save.mockResolvedValue(expectedOutput);

      const output = await service.createArticle(ctx, articleInput);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
      expect(output).toEqual(expectedOutput);
    });
  });

  describe('getArticles', () => {
    const limit = 10;
    const offset = 0;
    const currentDate = new Date();

    it('should return articles when found', async () => {
      const expectedOutput: ArticleOutput[] = [
        {
          id: 1,
          title: 'Test',
          post: 'Hello, world!',
          author: new User(),
          createdAt: currentDate,
          updatedAt: currentDate,
        },
      ];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.getArticles(ctx, limit, offset)).toEqual({
        articles: expectedOutput,
        count: expectedOutput.length,
      });
    });

    it('should return empty array when articles are not found', async () => {
      const expectedOutput: ArticleOutput[] = [];

      mockedRepository.findAndCount.mockResolvedValue([
        expectedOutput,
        expectedOutput.length,
      ]);

      expect(await service.getArticles(ctx, limit, offset)).toEqual({
        articles: expectedOutput,
        count: expectedOutput.length,
      });
    });
  });

  describe('getArticle', () => {
    it('should return article by id when article is found', async () => {
      const id = 1;
      const currentDate = new Date();

      const expectedOutput: ArticleOutput = {
        id: 1,
        title: 'Test',
        post: 'Hello, world!',
        author: new User(),
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      mockedRepository.getById.mockResolvedValue(expectedOutput);

      expect(await service.getArticleById(ctx, id)).toEqual(expectedOutput);
    });

    it('should fail when article is not found and return the repository error', async () => {
      const id = 1;

      mockedRepository.getById.mockRejectedValue({
        message: 'error',
      });

      try {
        await service.getArticleById(ctx, id);
      } catch (error) {
        expect(error.message).toEqual('error');
      }
    });
  });

  describe('Update Article', () => {
    it('should get article by id', () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.USER],
        username: 'testuser',
      };
      const articleId = 1;
      const input: UpdateArticleInput = {
        title: 'New Title',
        post: 'New Post',
      };

      const author = new User();
      author.id = 1;
      mockedRepository.getById.mockResolvedValue({
        id: 1,
        title: 'Old title',
        post: 'Old post',
        author,
      });

      service.updateArticle(ctx, articleId, input);
      expect(mockedRepository.getById).toHaveBeenCalledWith(articleId);
    });

    it('should save article with updated title and post', async () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.USER],
        username: 'testuser',
      };
      const articleId = 1;
      const input: UpdateArticleInput = {
        title: 'New Title',
        post: 'New Post',
      };
      const author = new User();
      author.id = 1;

      mockedRepository.getById.mockResolvedValue({
        id: 1,
        title: 'Old title',
        post: 'Old post',
        author,
      });

      const expected = {
        id: 1,
        title: 'New Title',
        post: 'New Post',
        author,
      };
      await service.updateArticle(ctx, articleId, input);
      expect(mockedRepository.save).toHaveBeenCalledWith(expected);
    });

    it('should throw unauthorized exception when someone other than resource owner tries to update article', async () => {
      ctx.user = {
        id: 2,
        roles: [ROLE.USER],
        username: 'testuser',
      };
      const articleId = 1;
      const input: UpdateArticleInput = {
        title: 'New Title',
        post: 'New Post',
      };
      const author = new User();
      author.id = 1;

      mockedRepository.getById.mockResolvedValue({
        id: 1,
        title: 'Old title',
        post: 'Old post',
        author,
      });

      try {
        await service.updateArticle(ctx, articleId, input);
      } catch (error) {
        expect(error.constructor).toEqual(UnauthorizedException);
        expect(mockedRepository.save).not.toHaveBeenCalled();
      }
    });
  });

  describe('deleteArticle', () => {
    const articleId = 1;

    it('should call repository.remove with correct parameter', async () => {
      ctx.user = {
        id: 1,
        roles: [ROLE.USER],
        username: 'testuser',
      };

      const author = new User();
      author.id = 1;
      const foundArticle = new Article();
      foundArticle.id = articleId;
      foundArticle.author = author;

      mockedRepository.getById.mockResolvedValue(foundArticle);

      await service.deleteArticle(ctx, articleId);
      expect(mockedRepository.remove).toHaveBeenCalledWith(foundArticle);
    });

    it('should throw not found exception if article not found', async () => {
      mockedRepository.getById.mockRejectedValue(new NotFoundException());
      try {
        await service.deleteArticle(ctx, articleId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw unauthorized exception when someone other than resource owner tries to delete article', async () => {
      ctx.user = {
        id: 2,
        roles: [ROLE.USER],
        username: 'testuser',
      };
      const articleId = 1;

      const author = new User();
      author.id = 1;

      mockedRepository.getById.mockResolvedValue({
        id: 1,
        title: 'Old title',
        post: 'Old post',
        author,
      });

      try {
        await service.deleteArticle(ctx, articleId);
      } catch (error) {
        expect(error.constructor).toEqual(UnauthorizedException);
        expect(mockedRepository.save).not.toHaveBeenCalled();
      }
    });
  });
});
