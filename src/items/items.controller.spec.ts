import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [ItemsService],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', () => {
      const items = controller.findAll();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a single item by id', () => {
      const item = controller.findOne(1);
      expect(item).toBeDefined();
      expect(item.id).toBe(1);
    });
  });

  describe('create', () => {
    it('should create and return new item with username', () => {
      const newItem = controller.create(
        { title: 'Test NestJS Item', price: 99 },
        'test_admin',
      );
      expect(newItem.id).toBeDefined();
      expect(newItem.title).toBe('Test NestJS Item');
      expect(newItem.createdBy).toBe('test_admin');
    });
  });
});

