import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockI18nService = {
    t: jest.fn((key: string, options?: any) => {
      const translations: Record<string, string> = {
        'app.hello':
          options?.lang === 'vi' ? 'Xin chào thế giới!' : 'Hello World!',
        'app.welcome':
          options?.lang === 'vi'
            ? 'Chào mừng bạn đến với khóa học NestJS Tutorial!'
            : 'Welcome to NestJS Tutorial!',
        'app.description':
          options?.lang === 'vi'
            ? 'Đa ngôn ngữ i18n'
            : 'i18n description',
      };
      return Promise.resolve(translations[key] || key);
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return overview info', () => {
      const result = appController.getOverview();
      expect(result).toBeDefined();
      expect(result.roadmap).toBeDefined();
    });
  });

  describe('hello API with i18n', () => {
    it('should return English greeting by default', async () => {
      const result = await appController.getHello('en');
      expect(result.message).toBe('Hello World!');
      expect(result.currentLanguage).toBe('en');
    });

    it('should return Vietnamese greeting when lang=vi', async () => {
      const result = await appController.getHello('vi', 'vi');
      expect(result.message).toBe('Xin chào thế giới!');
      expect(result.currentLanguage).toBe('vi');
    });
  });
});
