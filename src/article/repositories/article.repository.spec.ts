import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { User } from '../../user/entities/user.entity';

import { Article } from '../entities/article.entity';
import { ArticleRepository } from './article.repository';

describe('ArticleRepository', () => {
  let repository: ArticleRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [ArticleRepository],
    }).compile();

    repository = moduleRef.get<ArticleRepository>(ArticleRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('Get article by id', () => {
    it('should call findOne with correct id', () => {
      const id = 1;

      jest.spyOn(repository, 'findOne').mockResolvedValue(new Article());
      repository.getById(id);
      expect(repository.findOne).toHaveBeenCalledWith(id);
    });

    it('should return article if found', async () => {
      const expectedOutput: any = {
        id: 1,
        title: 'Default Article',
        post: 'Hello, world!',
        author: new User(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(expectedOutput);

      expect(await repository.getById(1)).toEqual(expectedOutput);
    });

    it('should throw NotFoundError when article not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);
      try {
        await repository.getById(1);
      } catch (error) {
        expect(error.constructor).toBe(NotFoundException);
      }
    });
  });
});
