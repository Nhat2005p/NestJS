import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from '@nestjs/swagger';
import { ItemsService, Item } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, User } from '../common/decorators/custom.decorators';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách items (hỗ trợ tìm kiếm)' })
  @ApiQuery({ name: 'search', required: false, description: 'Từ khóa tìm kiếm tiêu đề' })
  @ApiResponse({ status: 200, description: 'Danh sách items' })
  findAll(@Query('search') search?: string): Item[] {
    const list = this.itemsService.findAll();
    if (search) {
      return list.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return list;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một item theo ID (Validate số nguyên dương)' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết item' })
  @ApiResponse({ status: 400, description: 'ID không phải là số nguyên dương (> 0)' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy item' })
  findOne(@Param('id', ParsePositiveIntPipe) id: number): Item {
    return this.itemsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiHeader({ name: 'x-auth-token', description: 'Token xác thực giả lập: secret-token' })
  @ApiHeader({ name: 'x-user-role', description: 'Quyền: admin hoặc trainee (mặc định: admin)' })
  @ApiOperation({ summary: 'Tạo mới một item (Yêu cầu quyền Admin)' })
  @ApiResponse({ status: 201, description: 'Tạo mới thành công' })
  @ApiResponse({ status: 401, description: 'Thiếu header x-auth-token' })
  @ApiResponse({ status: 403, description: 'Không đủ quyền Admin' })
  create(
    @Body() createItemDto: CreateItemDto,
    @User('username') username: string,
  ): Item {
    return this.itemsService.create(createItemDto, username);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật toàn diện item' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Item {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa item theo ID' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.itemsService.remove(id);
  }
}
