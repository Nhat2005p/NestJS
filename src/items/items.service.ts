import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

export interface Item {
  id: number;
  title: string;
  description?: string;
  price: number;
  createdBy?: string;
  createdAt: string;
}

/**
 * 3. Providers: Chứa business logic, được quản lý bởi IoC Container của NestJS
 */
@Injectable()
export class ItemsService {
  private items: Item[] = [
    {
      id: 1,
      title: 'Học NestJS Overview',
      description: 'Nắm vững 10 kiến thức trọng tâm từ trang docs.nestjs.com',
      price: 100,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Thực hành Controller & Provider',
      description: 'Tạo RESTful endpoints và tiêm phụ thuộc DI trong NestJS',
      price: 150,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'Áp dụng Guard & Interceptor',
      description: 'Bảo mật route và biến đổi dữ liệu phản hồi RxJS',
      price: 200,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
    },
  ];

  private nextId = 4;

  findAll(): Item[] {
    return this.items;
  }

  findOne(id: number): Item {
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new NotFoundException(`Không tìm thấy item có ID = ${id}`);
    }
    return item;
  }

  create(createDto: CreateItemDto, creatorName: string = 'system'): Item {
    const newItem: Item = {
      id: this.nextId++,
      title: createDto.title,
      description: createDto.description,
      price: createDto.price,
      createdBy: creatorName,
      createdAt: new Date().toISOString(),
    };
    this.items.push(newItem);
    return newItem;
  }

  update(id: number, updateDto: UpdateItemDto): Item {
    const item = this.findOne(id);
    Object.assign(item, updateDto);
    return item;
  }

  remove(id: number): { deleted: boolean; id: number } {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new NotFoundException(`Không tìm thấy item có ID = ${id} để xóa`);
    }
    this.items.splice(index, 1);
    return { deleted: true, id };
  }
}

