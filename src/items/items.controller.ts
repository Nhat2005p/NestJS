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
import { ItemsService, Item } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ParsePositiveIntPipe } from '../common/pipes/parse-positive-int.pipe';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles, User } from '../common/decorators/custom.decorators';

/**
 * 2. Controllers: Tiếp nhận và xử lý các HTTP requests
 */
@Controller('items')
export class ItemsController {
  // Dependency Injection: Tiêm ItemsService thông qua constructor
  constructor(private readonly itemsService: ItemsService) {}

  /**
   * GET /api/v1/items: Lấy danh sách item
   */
  @Get()
  findAll(@Query('search') search?: string): Item[] {
    const list = this.itemsService.findAll();
    if (search) {
      return list.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase()),
      );
    }
    return list;
  }

  /**
   * GET /api/v1/items/:id: Lấy chi tiết item
   * Sử dụng Custom Pipe 'ParsePositiveIntPipe' để validate ID
   */
  @Get(':id')
  findOne(@Param('id', ParsePositiveIntPipe) id: number): Item {
    return this.itemsService.findOne(id);
  }

  /**
   * POST /api/v1/items: Tạo mới item
   * Sử dụng Guard 'RolesGuard', Decorator '@Roles' và Custom Decorator '@User'
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('admin')
  create(
    @Body() createItemDto: CreateItemDto,
    @User('username') username: string,
  ): Item {
    return this.itemsService.create(createItemDto, username);
  }

  /**
   * PUT /api/v1/items/:id: Cập nhật item
   */
  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  update(
    @Param('id', ParsePositiveIntPipe) id: number,
    @Body() updateItemDto: UpdateItemDto,
  ): Item {
    return this.itemsService.update(id, updateItemDto);
  }

  /**
   * DELETE /api/v1/items/:id: Xóa item
   */
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  remove(@Param('id', ParsePositiveIntPipe) id: number) {
    return this.itemsService.remove(id);
  }
}

