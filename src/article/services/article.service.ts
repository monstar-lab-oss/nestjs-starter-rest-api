import { plainToClass } from 'class-transformer';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { Action } from '../../shared/acl/action.constant';
import { Actor } from '../../shared/acl/actor.constant';
import { User } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import {
  CreateArticleInput,
  UpdateArticleInput,
} from '../dtos/article-input.dto';
import { ArticleOutput } from '../dtos/article-output.dto';
import { Article } from '../entities/article.entity';
import { ArticleRepository } from '../repositories/article.repository';
import { ArticleAclService } from './article-acl.service';
import { RequestContext } from '../../shared/request-context/request-context.dto';

@Injectable()
export class ArticleService {
  constructor(
    private repository: ArticleRepository,
    private userService: UserService,
    private aclService: ArticleAclService,
  ) {}

  async createArticle(
    actor: Actor,
    input: CreateArticleInput,
  ): Promise<ArticleOutput> {
    const article = plainToClass(Article, input);

    // TODO: get correct RequestContext from controller and pass it to getUserById
    const ctx = new RequestContext();

    const user = await this.userService.getUserById(ctx, actor.id);

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Create, article);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

    article.author = plainToClass(User, user);
    const savedArticle = await this.repository.save(article);

    return plainToClass(ArticleOutput, savedArticle, {
      excludeExtraneousValues: true,
    });
  }

  async updateArticle(
    actor: Actor,
    articleId: number,
    input: UpdateArticleInput,
  ): Promise<ArticleOutput> {
    const article = await this.repository.getById(articleId);

    const isAllowed = this.aclService
      .forActor(actor)
      .canDoAction(Action.Update, article);
    if (!isAllowed) {
      throw new UnauthorizedException();
    }

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
