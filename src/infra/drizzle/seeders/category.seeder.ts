import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../schema';
import { eq } from 'drizzle-orm';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import { randomUUID } from 'crypto';

function ensureEnvLoaded() {
  const cwd = process.cwd();
  // Mencoba memuat .env.local terlebih dahulu, lalu .env
  loadEnv({ path: resolve(cwd, '.env.local') });
  loadEnv({ path: resolve(cwd, '.env') });
}

type CategorySeed = { name: string; slug: string; id?: string };

const categories: CategorySeed[] = [
  { name: 'Smartphone', slug: 'Smartphone' },
  { name: 'Laptop', slug: 'laptop' },
];

async function main() {
  ensureEnvLoaded();

  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 5432;
  const user = process.env.DB_USER as string;
  const password = process.env.DB_PASSWORD as string;
  const database = process.env.DB_NAME || 'postgres';

  if (!user) throw new Error('DB_USER is required');

  // Gunakan connection string dengan sslmode=disable untuk menghindari error SSL
  const connectionString = `postgresql://${user}:${password}@${host}:${port}/${database}?sslmode=disable`;

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { schema });

  try {
    let inserted = 0;
    for (const cat of categories) {
      // Cek apakah kategori sudah ada berdasarkan slug
      const existing = await db.query.categories.findFirst({
        where: eq(schema.categories.slug, cat.slug),
      });

      if (existing) {
        console.log(`Skipping: ${cat.name} (already exists)`);
        continue;
      }

      await db.insert(schema.categories).values({
        id: cat.id ?? randomUUID(),
        name: cat.name,
        slug: cat.slug,
        isActive: true, // Field baru boolean
      });

      inserted += 1;
    }
    console.log(`✅ Categories seeding done. Inserted: ${inserted}.`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
