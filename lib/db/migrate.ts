import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { createClient } from '@libsql/client';

config({
  path: ['.env.local', '.env'],
});

const runMigrate = async () => {
  if (!process.env.DB_FILE_NAME) {
    throw new Error('DB_FILE_NAME is not defined');
  }

  const connection = createClient({
    url: process.env.DB_FILE_NAME,
    concurrency: 1,
  });
  const db = drizzle(connection);

  console.log('⏳ Running migrations...');

  const start = Date.now();
  await migrate(db, { migrationsFolder: './lib/db/migrations-sqlite' });
  const end = Date.now();

  console.log('✅ Migrations completed in', end - start, 'ms');
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
