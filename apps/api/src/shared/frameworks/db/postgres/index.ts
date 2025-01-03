import { Pool } from 'pg';

export const pgClient: Pool = new Pool({
  connectionString: process.env.DATABASE_URI,
});
