import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
import { AppService } from './app.service';

@ApiTags('Hello World')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin tổng quan ứng dụng' })
  @ApiResponse({
    status: 200,
    description: 'Thông tin phiên bản, roadmap và cấu hình dự án',
  })
  getOverview() {
    return this.appService.getOverviewInfo();
  }

  @Get('hello')
  @ApiOperation({
    summary: 'API Hello World hỗ trợ đa ngôn ngữ (i18n)',
    description:
      'Trả về thông điệp chào mừng theo ngôn ngữ chỉ định qua query param ?lang=vi hoặc header Accept-Language',
  })
  @ApiQuery({
    name: 'lang',
    required: false,
    enum: ['en', 'vi', 'ja'],
    description: 'Mã ngôn ngữ (mặc định: en, hỗ trợ: en, vi, ja)',
    example: 'vi',
  })
  @ApiResponse({
    status: 200,
    description: 'Lời chào được bản địa hóa thành công',
    schema: {
      example: {
        success: true,
        statusCode: 200,
        timestamp: '2026-11-09T07:58:00.000Z',
        data: {
          message: 'Xin chào thế giới!',
          welcome: 'Chào mừng bạn đến với khóa học NestJS Tutorial!',
          description:
            'Tính năng đa ngôn ngữ (i18n) và Swagger đã được thiết lập thành công.',
          currentLanguage: 'vi',
          timestamp: '2026-11-09T07:58:00.000Z',
        },
      },
    },
  })
  async getHello(
    @I18nLang() lang: string,
    @Query('lang') queryLang?: string,
  ) {
    const selectedLang = queryLang || lang || 'en';
    return await this.appService.getHello(selectedLang);
  }
}
