export interface DatabaseConfig {
  connectionString: string;
}

export function readDatabaseConfig(env: Record<string, string | undefined>): DatabaseConfig {
  const connectionString = env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }

  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error("DATABASE_URL must be a valid PostgreSQL URL");
  }

  if (
    !["postgres:", "postgresql:"].includes(url.protocol) ||
    !url.hostname ||
    url.pathname.length <= 1
  ) {
    throw new Error("DATABASE_URL must include a PostgreSQL host and database name");
  }

  return { connectionString };
}
