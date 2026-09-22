import assert from "node:assert/strict";
import process from "node:process";
import test from "node:test";
import { createDatabase, readDatabaseConfig } from "../dist/index.js";

test("requires a PostgreSQL database URL without exposing its value", () => {
  assert.throws(() => readDatabaseConfig({}), /DATABASE_URL is required/);
  for (const value of ["not-a-url", "https://example.com/db", "postgresql://localhost"]) {
    assert.throws(() => readDatabaseConfig({ DATABASE_URL: value }), (error) => {
      assert.doesNotMatch(error.message, /example.com|not-a-url/);
      return true;
    });
  }
});

test("accepts PostgreSQL URLs and creates a centralized lazy connection", async () => {
  const config = readDatabaseConfig({ DATABASE_URL: "postgresql://localhost:5432/pulseboard" });
  assert.equal(config.connectionString, "postgresql://localhost:5432/pulseboard");
  const database = createDatabase(config);
  assert.equal(typeof database.db.select, "function");
  await database.close();
});

test("connects to a configured PostgreSQL instance", { skip: !process.env.DATABASE_URL }, async () => {
  const database = createDatabase(readDatabaseConfig(process.env));
  try {
    await database.ping();
  } finally {
    await database.close();
  }
});
