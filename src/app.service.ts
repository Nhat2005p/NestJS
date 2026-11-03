import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getOverviewInfo() {
    return {
      name: 'NestJS Overview Demo Application',
      version: '1.0.0',
      course: 'NodeJS Course - Sun Asterisk',
      docsUrl: 'https://docs.nestjs.com/',
      topics: [
        'First steps',
        'Controllers',
        'Providers',
        'Modules',
        'Middleware',
        'Exception filters',
        'Pipes',
        'Guards',
        'Interceptors',
        'Custom decorators',
      ],
      demoRoutes: {
        items: '/api/v1/items',
      },
    };
  }
}
