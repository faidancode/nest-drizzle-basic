import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eq, sql } from 'drizzle-orm';
import { categories } from 'src/infra/drizzle/schema';
import type { Db } from 'src/infra/drizzle/schema';

@Injectable()
export class CategoriesRepository {
  constructor(@Inject('DRIZZLE') private readonly db: Db) {}

  async create(data: { name: string; slug: string; isActive?: boolean }) {
    const result = await this.db
      .insert(categories)
      .values({
        id: randomUUID(),
        name: data.name,
        slug: data.slug,
        isActive: data.isActive ?? true,
      })
      .returning();
    return result[0];
  }

  async update(
    id: string,
    data: Partial<{ name: string; slug: string; isActive: boolean }>,
  ) {
    const result = await this.db
      .update(categories)
      .set({
        ...data,
        updatedAt: new Date(), // Update timestamp manual jika tidak di-handle DB
      })
      .where(eq(categories.id, id))
      .returning();
    return result[0];
  }

  async findAll() {
    await this.db.execute(sql`
      select 
        current_database() as db,
        current_schema() as schema
    `);

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
