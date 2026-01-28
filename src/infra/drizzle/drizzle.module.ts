import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

@Global()
@Module({
  providers: [
    {
      provide: 'DRIZZLE',
      useFactory: () => {
        const isProduction = process.env.NODE_ENV === 'production';
        const sslParam = isProduction ? '' : '?sslmode=disable';

        const pool = new Pool({
          connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}${sslParam}`,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        });

        return drizzle(pool, { schema });
      },
    },
  ],
  exports: ['DRIZZLE'],
})
export class DrizzleModule {}
