import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Увеличиваем лимит размера тела запроса для загрузки изображений в base64
  // По умолчанию лимит 100KB, увеличиваем до 10MB для корзины с изображениями
  app.use(json({ limit: '10mb' }));

  // Логирование всех входящих запросов
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/cart')) {
      const bodyStr = req.body ? JSON.stringify(req.body) : '';
      console.log(`[Request] ${req.method} ${req.path}`, {
        headers: {
          authorization: req.headers.authorization ? 'Bearer ***' : 'none',
          'content-type': req.headers['content-type'],
        },
        bodySize: bodyStr.length,
        bodyPreview: bodyStr.substring(0, 500),
        fullBody: req.method === 'POST' ? req.body : undefined // Полное тело только для POST
      });
    }
    next();
  });

  // CORS - разрешаем запросы с фронтенда
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:3000',
    'http://localhost:3001',
    'https://printcore.by',
    'https://www.printcore.by',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Разрешаем запросы без origin (например, Postman, мобильные приложения)
      if (!origin) {
        return callback(null, true);
      }
      
      // Разрешаем если origin в списке разрешенных
      if (allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin))) {
        return callback(null, true);
      }
      
      // Разрешаем все в development режиме для удобства разработки
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // В production отклоняем неразрешенные origins
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const errorMessages = errors.map(err => ({
          property: err.property,
          constraints: err.constraints,
          value: err.value,
          target: err.target
        }));
        console.error('[ValidationPipe] Ошибка валидации:', JSON.stringify(errorMessages, null, 2));
        console.error('[ValidationPipe] Полные ошибки валидации:', errors);
        return new BadRequestException({
          message: 'Ошибка валидации данных',
          errors: errorMessages
        });
      },
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

  // Глобальный обработчик ошибок для логирования
  app.use((err: any, req: any, res: any, next: any) => {
    if (req.path?.startsWith('/api/cart')) {
      console.error('[Global Error Handler] Ошибка в cart endpoint:', {
        method: req.method,
        path: req.path,
        error: err.message,
        stack: err.stack,
        status: err.status || 500,
        response: err.response
      });
    }
    next(err);
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`
  🚀 Server is running on: http://localhost:${port}
  📚 Swagger docs: http://localhost:${port}/api/docs
  `);
}
bootstrap();
