import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * 7. Pipes: Chuyển đổi và xác thực tham số đầu vào
 * Kiểm tra xem ID có phải là số nguyên dương (> 0) hay không
 */
@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val) || val <= 0) {
      throw new BadRequestException(
        `Tham số '${metadata.data || 'id'}' phải là một số nguyên dương (> 0). Giá trị nhận được: '${value}'`,
      );
    }
    return val;
  }
}

