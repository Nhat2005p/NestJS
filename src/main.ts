import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Cấu hình Global Prefix
  app.setGlobalPrefix('api/v1');

  // Đăng ký Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Đăng ký Global Interceptors (Logging & Transform Response)
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 NestJS Server is running at: http://localhost:${port}/api/v1`);
  logger.log(`📚 Overview Demo Endpoints:`);
  logger.log(`   - GET  http://localhost:${port}/api/v1/items`);
  logger.log(`   - POST http://localhost:${port}/api/v1/items (Cần header 'x-auth-token: secret-token' và role admin)`);
}

bootstrap();
