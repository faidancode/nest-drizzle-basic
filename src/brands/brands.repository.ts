import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { eq, sql } from 'drizzle-orm';
import { brands } from 'src/infra/drizzle/schema';
import type { Db } from 'src/infra/drizzle/schema';

type InsertBrand = typeof brands.$inferInsert;
type UpdateBrand = Partial<typeof brands.$inferInsert>;

@Injectable()
export class BrandsRepository {
  constructor(@Inject('DRIZZLE') private readonly db: Db) {}
  async create(data: Omit<InsertBrand, 'id'>) {
    const result = await this.db
      .insert(brands)
      .values({
        id: randomUUID(),
        name: data.name,
        slug: data.slug,
        isActive: data.isActive ?? true,
      })
      .returning();
    return result[0];
  }

  async update(id: string, data: UpdateBrand) {
    const result = await this.db
      .update(brands)
      .set({
        ...data,
        updatedAt: new Date(), // Update timestamp manual jika tidak di-handle DB
      })
      .where(eq(brands.id, id))
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
      .from(brands)
      .where(eq(brands.isActive, true));
  }

  async findById(id: string) {
    const result = await this.db
      .select()
      .from(brands)
      .where(eq(brands.id, id));
    return result[0];
  }

  async remove(id: string): Promise<void> {
    // soft delete
    await this.findById(id); // ensure exists
    await this.db
      .update(brands)
      .set({ deletedAt: new Date() })
      .where(eq(brands.id, id));
  }
}
