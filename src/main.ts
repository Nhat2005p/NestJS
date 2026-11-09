import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Cấu hình Global Prefix cho toàn bộ API
  app.setGlobalPrefix('api/v1');

  // 2. Kích hoạt CORS
  app.enableCors();

  // 3. Đăng ký Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // 4. Đăng ký Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // 5. Đăng ký Global Interceptors (Logging & Transform response)
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // 6. Cấu hình Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('NestJS Tutorial API - Sun* Training Guideline')
    .setDescription(
      'Hệ thống tài liệu RESTful API thực hành chuẩn mực theo giáo trình đào tạo Node.js tại Sun Asterisk.\n\n' +
        '**Các tính năng đã tích hợp:**\n' +
        '- **Pull 1:** Khởi tạo project NestJS, API Hello World, Đa ngôn ngữ (i18n), Swagger OpenAPI UI.\n' +
        '- **Pull 2:** Database migration thủ công, Authentication (Register, Login, Logout với Redis blacklist token, Current User).',
    )
    .setVersion('1.0.0')
    .addTag('Hello World', 'API chào hỏi minh họa đa ngôn ngữ i18n')
    .addTag('Items', 'CRUD minh họa NestJS Architecture')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Nhập JWT token theo định dạng: Bearer <token>',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NestJS Tutorial - Swagger UI',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`=======================================================`);
  logger.log(`🚀 NestJS Application is running at: http://localhost:${port}/api/v1`);
  logger.log(`📄 Swagger OpenAPI Docs:             http://localhost:${port}/api/docs`);
  logger.log(`🌍 Hello World i18n API:             http://localhost:${port}/api/v1/hello?lang=vi`);
  logger.log(`=======================================================`);
}

bootstrap();
