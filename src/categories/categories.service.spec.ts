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
});
