import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateItemDto {
  @ApiPropertyOptional({
    example: 'Khóa học NestJS Master',
    description: 'Tiêu đề cập nhật',
  })
  @IsString()
  @IsOptional()
  readonly title?: string;

  @ApiPropertyOptional({
    example: 'Mô tả đã được cập nhật',
    description: 'Mô tả chi tiết',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiPropertyOptional({
    example: 249,
    description: 'Giá mới',
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly price?: number;
}
