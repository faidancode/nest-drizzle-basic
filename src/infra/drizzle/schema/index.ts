import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as categoriesSchema from './categories';
import * as brandsSchema from './categories';

// Combine all schemas
export const schema = {
  ...categoriesSchema,
  ...brandsSchema,
};

// Define
export type Db = NodePgDatabase<typeof schema>;

// Re-export
export * from './categories';
export * from './brands';
