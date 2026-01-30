import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { BrandRepository } from './brands.repository';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService, BrandRepository],
})
export class BrandsModule {}
