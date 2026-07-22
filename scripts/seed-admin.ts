import { existsSync } from "node:fs";
import { config as loadEnv } from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

loadEnv();

if (existsSync(".env.local")) {
    loadEnv({ path: ".env.local", override: false });
}

if (!process.env.DATABASE_URL && process.env.DATABASE_URL_UNPOOLED) {
    process.env.DATABASE_URL = process.env.DATABASE_URL_UNPOOLED;
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed the admin user.");
}

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
    const name = process.env.ADMIN_SEED_NAME?.trim() || "Admin User";
    const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_SEED_PASSWORD;

    if (!email) {
        throw new Error("ADMIN_SEED_EMAIL is required to seed the admin user.");
    }

    if (!password || password.length < 12) {
        throw new Error("ADMIN_SEED_PASSWORD must contain at least 12 characters.");
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.upsert({
        where: { email },
        update: { name, password: hashedPassword, role: "admin" },
        create: { name, email, password: hashedPassword, role: "admin" },
    });

    console.log(`Admin account ready: ${user.email}`);
}

seedAdmin()
    .catch((error) => {
        console.error(error instanceof Error ? error.message : error);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
