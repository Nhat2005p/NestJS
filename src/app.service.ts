import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AppService {
  constructor(private readonly i18n: I18nService) {}

  async getHello(lang: string = 'en') {
    const hello = await this.i18n.t('app.hello', { lang });
    const welcome = await this.i18n.t('app.welcome', { lang });
    const description = await this.i18n.t('app.description', { lang });

    return {
      message: hello,
      welcome,
      description,
      currentLanguage: lang,
      timestamp: new Date().toISOString(),
    };
  }

  getOverviewInfo() {
    return {
      name: 'NestJS Tutorial Application - Sun* Training Guideline',
      version: '1.0.0',
      course: 'NodeJS Course - Sun Asterisk',
      docsUrl: 'https://docs.nestjs.com/',
      swaggerUrl: '/api/docs',
      roadmap: {
        pull1: 'Init project + Hello World API + i18n + Swagger [COMPLETED]',
        pull2: 'Manual DB Migration + Auth (Register, Login, Redis Blacklist Logout, Current User) [UPCOMING]',
      },
    };
  }
}
