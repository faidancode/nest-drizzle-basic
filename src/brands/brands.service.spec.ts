import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { BrandsRepository } from './brands.repository';
import { NotFoundException } from '@nestjs/common';

describe('BrandsService', () => {
  let service: BrandsService;
  let repo: BrandsRepository;

  // Membuat mock object untuk repository
  const mockBrandsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        {
          provide: BrandsRepository,
          useValue: mockBrandsRepository, // Gunakan mock alih-alih repo asli
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    repo = module.get<BrandsRepository>(BrandsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of brands', async () => {
      const expectedResult = [
        { id: '1', name: 'Tech', slug: 'tech', isActive: true },
      ];
      mockBrandsRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(repo.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      const category = { id: '1', name: 'Tech', slug: 'tech' };
      mockBrandsRepository.findById.mockResolvedValue(category);

      const result = await service.findOne('1');

      expect(result).toEqual(category);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockBrandsRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create category with generated slug', async () => {
      const dto = {
        name: 'Tech News',
        description: 'Technology category',
      };

      const createdBrand = {
        id: '1',
        name: 'Tech News',
        slug: 'tech-news',
        description: 'Technology category',
      };

      mockBrandsRepository.create.mockResolvedValue(createdBrand);

      const result = await service.create(dto as any);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Tech News',
          slug: 'tech-news',
        }),
      );

      expect(result).toEqual(createdBrand);
    });

    it('should use slug from dto if provided', async () => {
      const dto = {
        name: 'Tech',
        slug: 'Custom Slug',
      };

      const createdBrand = {
        id: '1',
        name: 'Tech',
        slug: 'custom-slug',
      };

      mockBrandsRepository.create.mockResolvedValue(createdBrand);

      const result = await service.create(dto as any);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'custom-slug',
        }),
      );

      expect(result).toEqual(createdBrand);
    });
  });

  describe('update', () => {
    it('should update category and regenerate slug from name', async () => {
      const existingBrand = { id: '1', name: 'Old Name' };

      const dto = {
        name: 'New Name',
      };

      const updatedBrand = {
        id: '1',
        name: 'New Name',
        slug: 'new-name',
      };

      mockBrandsRepository.findById.mockResolvedValue(existingBrand);
      mockBrandsRepository.update.mockResolvedValue(updatedBrand);

      const result = await service.update('1', dto as any);

      expect(repo.findById).toHaveBeenCalledWith('1');
      expect(repo.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          name: 'New Name',
          slug: 'new-name',
        }),
      );

      expect(result).toEqual(updatedBrand);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockBrandsRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('999', { name: 'Test' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete category if exists', async () => {
      const existingBrand = { id: '1', name: 'Tech' };

      mockBrandsRepository.findById.mockResolvedValue(existingBrand);
      mockBrandsRepository.remove.mockResolvedValue(undefined);

      const result = await service.delete('1');

      expect(repo.findById).toHaveBeenCalledWith('1');
      expect(repo.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'Brand deleted successfully',
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockBrandsRepository.findById.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
