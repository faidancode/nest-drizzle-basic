import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { slugify } from 'src/common/utils';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schema';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const category = await this.repo.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryInput) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);

    return await this.repo.create({
      ...dto,
      slug,
    });
  }

  async update(id: string, dto: UpdateCategoryInput) {
    const category = await this.repo.findById(id);
    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found`);

    const updateData = { ...dto };

    if (dto.slug) {
      updateData.slug = slugify(dto.slug);
    } else if (dto.name) {
      updateData.slug = slugify(dto.name);
    }

    return await this.repo.update(id, updateData);
  }

  async delete(id: string) {
    const category = await this.repo.findById(id);

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    await this.repo.remove(id);

    return {
      message: 'Category deleted successfully',
    };
  }
}
