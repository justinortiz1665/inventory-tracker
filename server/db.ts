
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// For connection pooling - better for production
const connectionString = process.env.DATABASE_URL.replace('.us-east-2', '-pooler.us-east-2');

// Connection function
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
