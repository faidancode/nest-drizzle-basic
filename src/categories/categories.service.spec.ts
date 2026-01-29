import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repo: CategoriesRepository;

  // Membuat mock object untuk repository
  const mockCategoriesRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: mockCategoriesRepository, // Gunakan mock alih-alih repo asli
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repo = module.get<CategoriesRepository>(CategoriesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const expectedResult = [
        { id: '1', name: 'Tech', slug: 'tech', isActive: true },
      ];
      mockCategoriesRepository.findAll.mockResolvedValue(expectedResult);

      const result = await service.findAll();

      expect(result).toEqual(expectedResult);
      expect(repo.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a category if found', async () => {
      const category = { id: '1', name: 'Tech', slug: 'tech' };
      mockCategoriesRepository.findById.mockResolvedValue(category);

      const result = await service.findOne('1');

      expect(result).toEqual(category);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoriesRepository.findById.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create category with generated slug', async () => {
      const dto = {
        name: 'Tech News',
        description: 'Technology category',
      };

      const createdCategory = {
        id: '1',
        name: 'Tech News',
        slug: 'tech-news',
        description: 'Technology category',
      };

      mockCategoriesRepository.create.mockResolvedValue(createdCategory);

      const result = await service.create(dto as any);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Tech News',
          slug: 'tech-news',
        }),
      );

      expect(result).toEqual(createdCategory);
    });

    it('should use slug from dto if provided', async () => {
      const dto = {
        name: 'Tech',
        slug: 'Custom Slug',
      };

      const createdCategory = {
        id: '1',
        name: 'Tech',
        slug: 'custom-slug',
      };

      mockCategoriesRepository.create.mockResolvedValue(createdCategory);

      const result = await service.create(dto as any);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'custom-slug',
        }),
      );

      expect(result).toEqual(createdCategory);
    });
  });

  describe('update', () => {
    it('should update category and regenerate slug from name', async () => {
      const existingCategory = { id: '1', name: 'Old Name' };

      const dto = {
        name: 'New Name',
      };

      const updatedCategory = {
        id: '1',
        name: 'New Name',
        slug: 'new-name',
      };

      mockCategoriesRepository.findById.mockResolvedValue(existingCategory);
      mockCategoriesRepository.update.mockResolvedValue(updatedCategory);

      const result = await service.update('1', dto as any);

      expect(repo.findById).toHaveBeenCalledWith('1');
      expect(repo.update).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          name: 'New Name',
          slug: 'new-name',
        }),
      );

      expect(result).toEqual(updatedCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoriesRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('999', { name: 'Test' } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete category if exists', async () => {
      const existingCategory = { id: '1', name: 'Tech' };

      mockCategoriesRepository.findById.mockResolvedValue(existingCategory);
      mockCategoriesRepository.remove.mockResolvedValue(undefined);

      const result = await service.delete('1');

      expect(repo.findById).toHaveBeenCalledWith('1');
      expect(repo.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'Category deleted successfully',
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockCategoriesRepository.findById.mockResolvedValue(null);

      await expect(service.delete('999')).rejects.toThrow(NotFoundException);
    });
  });
});
