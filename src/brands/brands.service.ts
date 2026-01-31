import { Injectable, NotFoundException } from '@nestjs/common';
import { BrandsRepository } from './brands.repository';
import { slugify } from 'src/common/utils';
import { CreateBrandInput, UpdateBrandInput } from './brands.schema';

@Injectable()
export class BrandsService {
  constructor(private readonly repo: BrandsRepository) {}

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const category = await this.repo.findById(id);

    if (!category) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return category;
  }

  async create(dto: CreateBrandInput) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);

    return await this.repo.create({
      ...dto,
      slug,
    });
  }

  async update(id: string, dto: UpdateBrandInput) {
    const category = await this.repo.findById(id);
    if (!category)
      throw new NotFoundException(`Brand with ID ${id} not found`);

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
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    await this.repo.remove(id);

    return {
      message: 'Brand deleted successfully',
    };
  }
}
