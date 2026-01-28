import {
  pgTable,
  varchar,
  index,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/pg-core';
import { timestamps, uuid } from '../helper/db.helper';

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey(), // Menggunakan tipe data UUID native

    slug: varchar('slug', { length: 30 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),

    ...timestamps,
  },
  (t) => [
    uniqueIndex('uq_categories_slug').on(t.slug),
    index('idx_categories_name').on(t.name),
  ],
);
