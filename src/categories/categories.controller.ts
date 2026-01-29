import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Post,
  Body,
  Patch,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CreateCategorySchema,
  UpdateCategorySchema,
  type CreateCategoryInput,
  type UpdateCategoryInput,
} from './categories.schema';
import { ZodValidationPipe } from 'src/common/http/zod.validation.pipe';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategorySchema))
  async create(@Body() body: CreateCategoryInput) {
    return await this.service.create(body);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateCategorySchema))
  async update(@Param('id') id: string, @Body() body: UpdateCategoryInput) {
    return await this.service.update(id, body);
  }

  @Get()
  async list() {
    return await this.service.findAll();
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    const data = await this.service.findOne(id);
    if (!data) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return data;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
