import { timestamp, uuid as pgUuid } from 'drizzle-orm/pg-core';

// Helper untuk UUID Native Postgres
export const uuid = (name: string) => pgUuid(name);

// Helper untuk Timestamps
export const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
};
