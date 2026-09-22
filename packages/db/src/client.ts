import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import type { DatabaseConfig } from "./config.js";

export function createDatabase(config: DatabaseConfig) {
  const pool = new Pool({ connectionString: config.connectionString });
  const db = drizzle({ client: pool });

  return {
    db,
    async ping(): Promise<void> {
      await pool.query("SELECT 1");
    },
    async close(): Promise<void> {
      await pool.end();
    },
  };
}

export type Database = ReturnType<typeof createDatabase>;
