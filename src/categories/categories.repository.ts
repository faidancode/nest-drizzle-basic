import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { categories } from 'src/infra/drizzle/schema';
import type { Db } from 'src/infra/drizzle/schema';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject('DRIZZLE_CLIENT') private readonly db: Db) {}

  async findAll() {
    return await this.db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(categories)
      .where(eq(categories.id, id));
    return result[0];
  }
}
