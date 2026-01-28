import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

export async function createDrizzleClient(config: {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}) {
  // Menggunakan Pool dari paket 'pg'
  const pool = new Pool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    max: 10, // Sama dengan connectionLimit di MySQL
  });

  // Inisialisasi drizzle dengan pool tersebut
  const db = drizzle(pool, { schema });

  return db;
}
