import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource,Repository } from 'typeorm';

import { Article } from '../entities/article.entity';

@Injectable()
export class ArticleRepository extends Repository<Article> {
  constructor(private dataSource: DataSource) {
    super(Article, dataSource.createEntityManager());
  }
  async getById(id: number): Promise<Article> {
    const article = await this.findOneBy({ id });
    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }
}
