import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('PrintCore API')
    .setDescription('API для сайта типографии PrintCore')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Авторизация и аутентификация')
    .addTag('users', 'Управление пользователями')
    .addTag('services', 'Услуги типографии')
    .addTag('orders', 'Заказы')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
  🚀 Server is running on: http://localhost:${port}
  📚 Swagger docs: http://localhost:${port}/api/docs
  `);
}
bootstrap();
