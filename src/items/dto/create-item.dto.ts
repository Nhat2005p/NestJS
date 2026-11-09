import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({
    example: 'Khóa học NestJS Pro',
    description: 'Tiêu đề của item',
  })
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiPropertyOptional({
    example: 'Khóa học chuyên sâu backend NestJS',
    description: 'Mô tả chi tiết',
  })
  @IsString()
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: 199,
    description: 'Giá của item (> 0)',
  })
  @IsNumber()
  @Min(1)
  readonly price: number;
}
