import { createDatabase, readDatabaseConfig } from "./index.js";

async function main(): Promise<void> {
  const database = createDatabase(readDatabaseConfig(process.env));
  try {
    await database.ping();
    console.log("Database connection OK");
  } finally {
    await database.close();
  }
}

main().catch(() => {
  // Do not print driver errors here: they may contain the connection URL.
  console.error("Database connection failed");
  process.exitCode = 1;
});
