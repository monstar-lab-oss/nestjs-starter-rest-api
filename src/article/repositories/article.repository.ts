import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Article } from '../entities/article.entity';
export class ArticleRepository extends Repository<Article> {
  async getById(id: number): Promise<Article> {
    const article = await this.findOneBy({ id });
    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }
}
