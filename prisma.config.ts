import { existsSync } from "node:fs";
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

loadEnv();

if (existsSync(".env.local")) {
  loadEnv({ path: ".env.local", override: false });
}

if (!process.env.DATABASE_URL && process.env.DATABASE_URL_UNPOOLED) {
  process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED;
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
