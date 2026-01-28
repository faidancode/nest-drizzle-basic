import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as categoriesSchema from './categories';

// Combine all schemas
export const schema = {
  ...categoriesSchema,
};

// Define
export type Db = NodePgDatabase<typeof schema>;

// Re-export
export * from './categories';
