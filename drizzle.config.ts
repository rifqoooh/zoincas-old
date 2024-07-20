import { defineConfig, type Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  console.log('🔴 Cannot find database url');
}

export default defineConfig({
  tablesFilter: ['zoincas_*'],
  schema: './src/lib/supabase/schema.ts',
  out: './migrations',
  // driver: 'pg',
  dialect: 'postgresql',
  dbCredentials: {
    database: 'postgres',
    // port: 6543, // Gives error: TypeError: Cannot read properties of undefined (reading 'toLowerCase')
    port: 5432, // This works
    url: process.env.DATABASE_URL || '',
    host: process.env.DATABASE_HOST || '',
    user: process.env.DATABASE_USER || '',
    password: process.env.PW || '',
    // connectionString: process.env.DATABASE_URL || '',
  },
  verbose: true,
  strict: true,
});
// satisfies Config;
