import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async list() {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const data = await this.categoriesService.findOne(id);
    if (!data) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return data;
  }
}
