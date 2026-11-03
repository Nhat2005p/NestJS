import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { LoggerMiddleware } from '../common/middleware/logger.middleware';

/**
 * 4. Modules: Gom nhóm logic chức năng có tổ chức cao
 */
@Module({
  controllers: [ItemsController],
  providers: [
    ItemsService,
    // Custom Provider minh họa 'useValue'
    {
      provide: 'ITEMS_CONFIG',
      useValue: {
        maxItems: 100,
        enableAudit: true,
      },
    },
  ],
  exports: [ItemsService],
})
export class ItemsModule implements NestModule {
  /**
   * 5. Middleware: Đăng ký middleware Logger cho toàn bộ routes của ItemsController
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(ItemsController);
  }
}

