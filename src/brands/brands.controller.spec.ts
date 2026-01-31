import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

describe('BrandsController', () => {
  let controller: BrandsController;
  let service: BrandsService;

  const mockBrandsService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Tech' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Tech' }),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide: BrandsService,
          useValue: mockBrandsService,
        },
      ],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
    service = module.get<BrandsService>(BrandsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('list() should return all brands', async () => {
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

      const createdBrand = {
        id: '1',
        name: 'Tech',
        slug: 'tech',
      };

      mockBrandsService.create.mockResolvedValue(createdBrand);

      const result = await controller.create(dto as any);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdBrand);
    });

    it('should throw an error if category name already exists', async () => {
      const dto = { name: 'Tech', description: 'Duplicate' };

      // Simulasi service melempar error (misal: ConflictException)
      mockBrandsService.create.mockRejectedValue(
        new Error('Brand already exists'),
      );

      await expect(controller.create(dto as any)).rejects.toThrow(
        'Brand already exists',
      );
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      const dto = {
        name: 'New Tech',
      };

      const updatedBrand = {
        id: '1',
        name: 'New Tech',
        slug: 'new-tech',
      };

      mockBrandsService.update.mockResolvedValue(updatedBrand);

      const result = await controller.update('1', dto as any);

      expect(service.update).toHaveBeenCalledWith('1', dto);
      expect(result).toEqual(updatedBrand);
    });

    it('should throw an error if category to update is not found', async () => {
      const dto = { name: 'Non-existent' };

      mockBrandsService.update.mockRejectedValue(new Error('Brand not found'));

      await expect(controller.update('999', dto as any)).rejects.toThrow(
        'Brand not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete a category', async () => {
      mockBrandsService.delete.mockResolvedValue({
        message: 'Brand deleted successfully',
      });

      const result = await controller.delete('1');

      expect(service.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'Brand deleted successfully',
      });
    });

    it('should throw an error if category to delete is not found', async () => {
      mockBrandsService.delete.mockRejectedValue(new Error('Brand not found'));

      await expect(controller.delete('999')).rejects.toThrow('Brand not found');
    });

    it('should throw an error if category is being used by products', async () => {
      mockBrandsService.delete.mockRejectedValue(
        new Error('Cannot delete category with active products'),
      );

      await expect(controller.delete('1')).rejects.toThrow(
        'Cannot delete category with active products',
      );
    });
  });
});
