import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { RequestIdMiddleware } from './shared/middleware/request-id/request-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(RequestIdMiddleware);

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('Nestjs API starter')
    .setDescription('Nestjs API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  await app.listen(port);

}
bootstrap();
