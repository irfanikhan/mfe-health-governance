import { defineConfig } from "drizzle-kit";
import { readDatabaseConfig } from "./src/config.js";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./migrations",
  ...(process.env.DATABASE_URL
    ? { dbCredentials: { url: readDatabaseConfig(process.env).connectionString } }
    : {}),
});
