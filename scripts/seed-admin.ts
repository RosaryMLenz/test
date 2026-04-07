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
    const hashedPassword = await bcrypt.hash("YourStrongAdminPassword", 10);
    await prisma.user.create({
        data: {
            name: "Admin User",
            email: "admin@rainforest21.com",
            password: hashedPassword,
            role: "admin",
        },
    });
    console.log("Admin user created.");
}

seedAdmin().finally(() => prisma.$disconnect());
