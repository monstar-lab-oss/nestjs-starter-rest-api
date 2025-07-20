import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { ArticleOutput } from '../../src/article/dtos/article-output.dto';
import { AuthTokenOutput } from '../../src/auth/dtos/auth-token-output.dto';
import { UserOutput } from '../../src/user/dtos/user-output.dto';
import {
  closeDBAfterTest,
  createDBEntities,
  resetDBBeforeTest,
  seedAdminUser,
} from '../test-utils';

describe('ArticleController (e2e)', () => {
  let app: INestApplication;
  let adminUser: UserOutput;
  let authTokenForAdmin: AuthTokenOutput;

  beforeAll(async () => {
    await resetDBBeforeTest();
    await createDBEntities();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    ({ adminUser, authTokenForAdmin } = await seedAdminUser(app));
  });

  const createArticleInput = {
    title: 'Test Article Title',
    post: 'This is a test article content for e2e testing.',
  };

  const updateArticleInput = {
    title: 'Updated Test Article Title',
    post: 'This is the updated test article content.',
  };

  let createdArticle: ArticleOutput;

  describe('Create article', () => {
    it('successfully creates an article', async () => {
      const response = await request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .send(createArticleInput)
        .expect(HttpStatus.CREATED);

      createdArticle = response.body.data;
      expect(createdArticle.title).toEqual(createArticleInput.title);
      expect(createdArticle.post).toEqual(createArticleInput.post);
      expect(createdArticle.author.id).toEqual(adminUser.id);
      expect(createdArticle.author.name).toEqual(adminUser.name);
      expect(createdArticle.id).toBeDefined();
      expect(createdArticle.createdAt).toBeDefined();
      expect(createdArticle.updatedAt).toBeDefined();
    });

    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .post('/articles')
        .send(createArticleInput)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('validation error when title is missing', async () => {
      const invalidInput = { post: 'Content without title' };
      return request(app.getHttpServer())
        .post('/articles')
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .send(invalidInput)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Get article', () => {
    it('successfully gets an article by id', async () => {
      return request(app.getHttpServer())
        .get(`/articles/${createdArticle.id}`)
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data.id).toEqual(createdArticle.id);
          expect(res.body.data.title).toEqual(createdArticle.title);
          expect(res.body.data.post).toEqual(createdArticle.post);
        });
    });

    it('throws NOT_FOUND when article doesnt exist', () => {
      return request(app.getHttpServer())
        .get('/articles/99999')
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .get(`/articles/${createdArticle.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Get all articles', () => {
    it('successfully gets all articles', async () => {
      return request(app.getHttpServer())
        .get('/articles')
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.data.length).toBeGreaterThan(0);
          expect(res.body.meta.count).toBeGreaterThan(0);
        });
    });
  });

  describe('Update article', () => {
    it('successfully updates an article', async () => {
      return request(app.getHttpServer())
        .patch(`/articles/${createdArticle.id}`)
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .send(updateArticleInput)
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body.data.id).toEqual(createdArticle.id);
          expect(res.body.data.title).toEqual(updateArticleInput.title);
          expect(res.body.data.post).toEqual(updateArticleInput.post);
          expect(res.body.data.updatedAt).not.toEqual(createdArticle.updatedAt);
        });
    });

    it('throws NOT_FOUND when article doesnt exist', () => {
      return request(app.getHttpServer())
        .patch('/articles/99999')
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .send(updateArticleInput)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .patch(`/articles/${createdArticle.id}`)
        .send(updateArticleInput)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Delete article', () => {
    it('successfully deletes an article', async () => {
      return request(app.getHttpServer())
        .delete(`/articles/${createdArticle.id}`)
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .expect(HttpStatus.NO_CONTENT);
    });

    it('throws NOT_FOUND when trying to delete non-existent article', () => {
      return request(app.getHttpServer())
        .delete('/articles/99999')
        .set('Authorization', 'Bearer ' + authTokenForAdmin.accessToken)
        .expect(HttpStatus.NOT_FOUND);
    });

    it('Unauthorized error when BearerToken is not provided', async () => {
      return request(app.getHttpServer())
        .delete('/articles/12345')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  afterAll(async () => {
    await app.close();
    await closeDBAfterTest();
  });
});