import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { AppModule } from './app.module';
import { configService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['verbose'],
  });

  // Render Setup
  const staticFoldersPath = configService.getStaticFoldersPath();

  app.useStaticAssets(join(__dirname, staticFoldersPath, 'public'));
  app.setBaseViewsDir(join(__dirname, staticFoldersPath, 'views'));
  app.setViewEngine('hbs');

  app.setGlobalPrefix('backend-nest');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Documentation (NestJS)')
    .setDescription('Documentação da API feita em NestJS')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('backend-nest/swagger', app, document);
  app.enableCors();
  await app.listen(configService.getPort());
}
bootstrap();
