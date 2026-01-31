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
import { BrandsService } from './brands.service';
import {
  CreateBrandSchema,
  UpdateBrandSchema,
  type CreateBrandInput,
  type UpdateBrandInput,
} from './brands.schema';
import { ZodValidationPipe } from 'src/common/http/zod.validation.pipe';

@Controller('brands')
export class BrandsController {
  constructor(private readonly service: BrandsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateBrandSchema))
  async create(@Body() body: CreateBrandInput) {
    return await this.service.create(body);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(UpdateBrandSchema))
  async update(@Param('id') id: string, @Body() body: UpdateBrandInput) {
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
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return data;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
