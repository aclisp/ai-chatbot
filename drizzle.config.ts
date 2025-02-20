import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({
  path: ['.env.local', '.env'],
});

export default defineConfig({
  schema: './lib/db/schema-sqlite.ts',
  out: './lib/db/migrations-sqlite',
  dialect: 'sqlite',
  dbCredentials: {
    // biome-ignore lint: Forbidden non-null assertion.
    url: process.env.DB_FILE_NAME!,
  },
});
