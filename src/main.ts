import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Fullstack auth')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  const logger = new Logger();

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT');

  logger.verbose(`Server is running on http://localhost:${port}/api`);

  await app.listen(port);
}
bootstrap();
