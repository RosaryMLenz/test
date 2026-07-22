import { existsSync } from "node:fs";
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

loadEnv();

if (existsSync(".env.local")) {
  loadEnv({ path: ".env.local", override: false });
}

const migrationDatabaseUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

if (migrationDatabaseUrl) {
  process.env.DATABASE_URL = migrationDatabaseUrl;
}

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace(
    /([?&])sslmode=require(?=(&|$))/i,
    "$1sslmode=verify-full",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
