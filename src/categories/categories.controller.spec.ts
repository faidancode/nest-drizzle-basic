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

    it('should throw an error if category name already exists', async () => {
      const dto = { name: 'Tech', description: 'Duplicate' };

      // Simulasi service melempar error (misal: ConflictException)
      mockCategoriesService.create.mockRejectedValue(
        new Error('Category already exists'),
      );

      await expect(controller.create(dto as any)).rejects.toThrow(
        'Category already exists',
      );
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

    it('should throw an error if category to update is not found', async () => {
      const dto = { name: 'Non-existent' };

      mockCategoriesService.update.mockRejectedValue(
        new Error('Category not found'),
      );

      await expect(controller.update('999', dto as any)).rejects.toThrow(
        'Category not found',
      );
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

    it('should throw an error if category to delete is not found', async () => {
      mockCategoriesService.delete.mockRejectedValue(
        new Error('Category not found'),
      );

      await expect(controller.delete('999')).rejects.toThrow(
        'Category not found',
      );
    });

    it('should throw an error if category is being used by products', async () => {
      mockCategoriesService.delete.mockRejectedValue(
        new Error('Cannot delete category with active products'),
      );

      await expect(controller.delete('1')).rejects.toThrow(
        'Cannot delete category with active products',
      );
    });
  });
});
