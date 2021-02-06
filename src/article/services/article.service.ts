import { plainToClass } from 'class-transformer';
import { UserAccessTokenClaims } from 'src/auth/dtos/auth-token-output.dto';

import { Injectable } from '@nestjs/common';

import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import {
  CreateArticleInput,
  UpdateArticleInput,
} from '../dtos/article-input.dto';
import { ArticleOutput } from '../dtos/article-output.dto';
import { Article } from '../entities/article.entity';
import { ArticleRepository } from '../repositories/article.repository';

@Injectable()
export class ArticleService {
  constructor(
    private repository: ArticleRepository,
    private userService: UserService,
  ) {}

  async createArticle(
    userClaims: UserAccessTokenClaims,
    input: CreateArticleInput,
  ): Promise<ArticleOutput> {
    const article = plainToClass(Article, input);

    const user = await this.userService.getUserById(userClaims.id);

    article.author = plainToClass(User, user);
    const savedArticle = await this.repository.save(article);

    return plainToClass(ArticleOutput, savedArticle, {
      excludeExtraneousValues: true,
    });
  }

  async updateArticle(
    userClaims: UserAccessTokenClaims,
    articleId: number,
    input: UpdateArticleInput,
  ): Promise<ArticleOutput> {
    const article = await this.repository.getById(articleId);

    const updatedArticle: Article = {
      ...article,
      ...plainToClass(Article, input),
    };

    const savedArticle = await this.repository.save(updatedArticle);

    return plainToClass(ArticleOutput, savedArticle, {
      excludeExtraneousValues: true,
    });
  }
}
