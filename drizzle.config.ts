// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

// Cek apakah sedang di production atau tidak
const isProduction = process.env.NODE_ENV === 'production';

// Tambahkan query parameter hanya jika di local
const sslMode = isProduction ? '' : '?sslmode=disable';

export default defineConfig({
  schema: './src/infra/drizzle/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}${sslMode}`,
  },
  verbose: true,
  strict: true,
});
