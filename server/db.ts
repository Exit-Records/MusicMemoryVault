import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Configure neon for serverless environment with error handling
try {
  neonConfig.webSocketConstructor = ws;
} catch (error) {
  console.warn('WebSocket configuration warning:', error);
}

// Create pool with proper error handling and connection options
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1, // Reduce max connections to avoid WebSocket issues
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 5000,
});

// Handle pool errors gracefully
pool.on('error', (err) => {
  console.error('Database pool error:', err);
});

export const db = drizzle({ client: pool, schema });