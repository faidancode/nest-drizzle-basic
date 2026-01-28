import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export async function createDrizzleClient(config: {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
}) {
  const isProduction = process.env.NODE_ENV === 'production';

  // sslmode=disable ONLY on dev
  const sslParam = isProduction ? '' : '?sslmode=disable';

  const connectionString = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}${sslParam}`;

  const pool = new Pool({
    connectionString,
    // cloud provider need rejectUnauthorized: false
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  });

  return drizzle(pool, { schema });
}
