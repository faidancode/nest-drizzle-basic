import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Tech' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Tech' }),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('list() should return all categories', async () => {
    const result = await controller.list();
    expect(result).toEqual([{ id: '1', name: 'Tech' }]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('detail() should return a specific category', async () => {
    const result = await controller.detail('1');
    expect(result).toEqual({ id: '1', name: 'Tech' });
    expect(service.findOne).toHaveBeenCalledWith('1');
  });

  describe('create', () => {
    it('should create a category', async () => {
      const dto = {
        name: 'Tech',
        description: 'Technology',
      };

      const createdCategory = {
        id: '1',
        name: 'Tech',
        slug: 'tech',
      };

      mockCategoriesService.create.mockResolvedValue(createdCategory);

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdCategory);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto = {
        name: 'New Tech',
      };

      const updatedCategory = {
        id: '1',
        name: 'New Tech',
        slug: 'new-tech',
      };

      mockCategoriesService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update('1', dto as any);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(updatedCategory);
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      mockCategoriesService.delete.mockResolvedValue({
        message: 'Category deleted successfully',
      });

      const result = await controller.delete('1');

      expect(service.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'Category deleted successfully',
      });
    });
  });
});
