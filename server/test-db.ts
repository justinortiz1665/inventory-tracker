
import { db } from './db';

async function testConnection() {
  try {
    console.log("Testing database connection...");
    // Test query - will try to get a single user
    const result = await db.select().from(schema.users).limit(1);
    console.log("Connection successful!");
    console.log("Test query result:", result);
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testConnection();
