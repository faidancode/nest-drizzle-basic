import { Inject, Injectable } from '@nestjs/common';
import type { Db } from 'src/infra/drizzle/schema';

@Injectable()
export class BrandRepository {
  constructor(@Inject('DRIZZLE') private readonly db: Db) {}

  async create() {}
}
