import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    findAll: jest.fn().mockResolvedValue([{ id: '1', name: 'Tech' }]),
    findOne: jest.fn().mockResolvedValue({ id: '1', name: 'Tech' }),
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
});
