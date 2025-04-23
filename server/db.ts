
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

// Test connection and handle errors
async function testConnection() {
  try {
    console.log("Testing database connection...");
    await db.select().from(schema.users).limit(1);
    console.log("Successfully connected to the database!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit if we can't connect to the database
  }
}

testConnection();
