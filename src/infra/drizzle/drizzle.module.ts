import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE', // Pastikan di Repository juga pakai @Inject('DRIZZLE')
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'production';

        const pool = new Pool({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          // Jika produksi (misal Supabase/Neon), aktifkan SSL
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DRIZZLE'],
})
export class DrizzleModule {}
