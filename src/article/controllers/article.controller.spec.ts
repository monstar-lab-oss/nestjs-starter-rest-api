import { Test, TestingModule } from '@nestjs/testing';

import { ArticleController } from './article.controller';

import { ArticleService } from '../services/article.service';

describe('ArticleController', () => {
  let controller: ArticleController;
  const mockedArticleService = {
    getArticles: jest.fn(),
    getArticleById: jest.fn(),
    updateArticle: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [{ provide: ArticleService, useValue: mockedArticleService }],
    }).compile();

    controller = moduleRef.get<ArticleController>(ArticleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
